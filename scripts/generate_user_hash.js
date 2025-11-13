/* eslint-disable no-console */
// Quick script to generate bcrypt hash for a password
// Usage: node scripts/generate_user_hash.js "YourPassword123!"

const bcrypt = require('bcrypt');

const password = process.argv[2] || 'Password123!';

bcrypt.hash(password, 10)
  .then((hash) => {
    console.log('\n✅ Password hash generated:');
    console.log(hash);
    console.log('\n📝 Use this in your SQL INSERT statement:\n');
    console.log(`INSERT INTO users (name, email, password_hash, role) VALUES`);
    console.log(`('Your Name', 'email@example.com', '${hash}', 'user');\n`);
  })
  .catch((err) => {
    console.error('Error generating hash:', err);
    process.exit(1);
  });

