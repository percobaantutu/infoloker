const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generates RSA key pair for credential encryption
 * Run this once: node utils/generateKeys.js
 */

const keysDir = path.join(__dirname, '../config/keys');

// Create keys directory if it doesn't exist
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

// Generate 2048-bit RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Save keys
fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);
fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);

console.log('✅ RSA key pair generated successfully!');
console.log(`📁 Keys saved to: ${keysDir}`);
console.log('\n⚠️  IMPORTANT: Add config/keys/private.pem to .gitignore!');
