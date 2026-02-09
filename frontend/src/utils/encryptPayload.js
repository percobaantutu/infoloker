/**
 * Credential Encryption Utility
 * Uses RSA-OAEP to encrypt sensitive data before sending to backend
 */

import { BASE_URL } from "./apiPaths";

let publicKeyCache = null;
let publicKeyPromise = null;

/**
 * Fetches the public key from the backend
 * @returns {Promise<CryptoKey|null>} The public key or null if not available
 */
const fetchPublicKey = async () => {
  if (publicKeyCache) return publicKeyCache;
  
  // Prevent concurrent fetches
  if (publicKeyPromise) return publicKeyPromise;
  
  publicKeyPromise = (async () => {
    try {
      // Remove trailing slash from BASE_URL if present
      const apiBase = BASE_URL.replace(/\/$/, '');
      const response = await fetch(`${apiBase}/api/auth/public-key`);
      const data = await response.json();
      
      if (!data.publicKey) {
        console.warn('Encryption not available - sending plain text');
        return null;
      }
      
      // Convert PEM to CryptoKey
      const pemContents = data.publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\s/g, '');
      
      const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
      
      publicKeyCache = await window.crypto.subtle.importKey(
        'spki',
        binaryDer.buffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256'
        },
        false,
        ['encrypt']
      );
      
      return publicKeyCache;
    } catch (error) {
      console.error('Failed to fetch public key:', error);
      return null;
    } finally {
      publicKeyPromise = null;
    }
  })();
  
  return publicKeyPromise;
};

/**
 * Encrypts a string using RSA-OAEP
 * @param {string} plaintext - The text to encrypt
 * @returns {Promise<string>} Base64 encoded encrypted data, or original if encryption unavailable
 */
export const encryptCredential = async (plaintext) => {
  try {
    const publicKey = await fetchPublicKey();
    
    if (!publicKey) {
      // Encryption not available - return as-is
      return plaintext;
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      data
    );
    
    // Convert to Base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    return base64;
  } catch (error) {
    console.error('Encryption failed:', error);
    // Fall back to plain text if encryption fails
    return plaintext;
  }
};

/**
 * Pre-fetches the public key for faster encryption later
 */
export const prefetchPublicKey = () => {
  fetchPublicKey().catch(() => {});
};

export default { encryptCredential, prefetchPublicKey };
