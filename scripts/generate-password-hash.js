#!/usr/bin/env node
/**
 * scripts/generate-password-hash.js
 *
 * Usage:
 *   node scripts/generate-password-hash.js yourpassword
 *
 * Outputs the bcrypt hash to paste into ADMIN_PASSWORD_HASH in .env.local
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.js <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\nAdd this to your .env.local:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('\nAlso add a random session secret:');
  console.log(`ADMIN_SESSION_SECRET=${require('crypto').randomBytes(32).toString('hex')}`);
  console.log('');
});
