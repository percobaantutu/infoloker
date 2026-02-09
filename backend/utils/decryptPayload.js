const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Cache for the private key
let privateKeyCache = null;

/**
 * Load private key from file or environment
 * @returns {string} Private key in PEM format
 */
const getPrivateKey = () => {
  if (privateKeyCache) return privateKeyCache;
  
  // First try environment variable (for production)
  if (process.env.RSA_PRIVATE_KEY) {
    privateKeyCache = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n');
    return privateKeyCache;
  }
  
  // Fall back to file (for development)
  const keyPath = path.join(__dirname, '../config/keys/private.pem');
  if (fs.existsSync(keyPath)) {
    privateKeyCache = fs.readFileSync(keyPath, 'utf8');
    return privateKeyCache;
  }
  
  console.warn('⚠️  No RSA private key found. Encryption disabled.');
  return null;
};

/**
 * Decrypt an encrypted payload from the frontend
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @returns {string} Decrypted plaintext
 */
const decryptPayload = (encryptedData) => {
  try {
    const privateKey = getPrivateKey();
    if (!privateKey) {
      throw new Error('Private key not available');
    }
    
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption failed:', error.message);
    throw new Error('Failed to decrypt payload');
  }
};

/**
 * Check if the data appears to be encrypted (Base64 and proper length)
 * @param {string} data - Data to check
 * @returns {boolean}
 */
const isEncrypted = (data) => {
  if (!data || typeof data !== 'string') return false;
  // RSA 2048-bit encrypted data is always 256 bytes = ~344 chars in Base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  return data.length >= 300 && base64Regex.test(data);
};

/**
 * Decrypt password if encrypted, otherwise return as-is
 * @param {string} password - Potentially encrypted password
 * @returns {string} Plain text password
 */
const decryptPasswordIfNeeded = (password) => {
  if (isEncrypted(password)) {
    return decryptPayload(password);
  }
  return password;
};

module.exports = {
  decryptPayload,
  decryptPasswordIfNeeded,
  isEncrypted,
  getPrivateKey
};
