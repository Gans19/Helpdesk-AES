-- ============================================
-- HelpDesk Lite - Users Insert Query
-- ============================================
-- Note: Passwords must be hashed with bcrypt before inserting
-- Use the seed script (npm run seed) which handles hashing automatically
-- OR use the hash generator below
-- ============================================

USE helpdesk_lite;

-- Option 1: Insert with pre-hashed passwords
-- You need to generate bcrypt hashes first (see below for Node.js script)
-- Password for all: 'Password123!'

INSERT INTO users (name, email, password_hash, role) VALUES
('Alice Admin', 'admin@example.com', '$2b$10$ZJ/6nsaF0GlStlFjqMAAlOO5Q9iC1A.PWjOyYt2mk3J1Dhbq6el3C', 'admin'),
('Sam Support', 'support@example.com', '$2b$10$ZJ/6nsaF0GlStlFjqMAAlOO5Q9iC1A.PWjOyYt2mk3J1Dhbq6el3C', 'support'),
('Uma User', 'user@example.com', '$2b$10$ZJ/6nsaF0GlStlFjqMAAlOO5Q9iC1A.PWjOyYt2mk3J1Dhbq6el3C', 'user')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role);

-- ============================================
-- To generate bcrypt hashes, use this Node.js script:
-- ============================================
-- const bcrypt = require('bcrypt');
-- const password = 'Password123!';
-- bcrypt.hash(password, 10).then(hash => console.log(hash));
-- ============================================

-- OR use the provided seed script which handles everything:
-- npm run seed --prefix backend

