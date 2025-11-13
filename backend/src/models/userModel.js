const pool = require('../config/database');

const sanitizeUser = (record) => {
  if (!record) return null;
  const { password_hash, ...rest } = record;
  return rest;
};

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

const createUser = async ({ name, email, passwordHash, role }) => {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  const created = await findById(result.insertId);
  return sanitizeUser(created);
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  sanitizeUser
};

