const pool = require('../config/database');

const createToken = async ({ userId, tokenHash, expiresAt }) => {
  await pool.execute(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [userId, tokenHash, expiresAt]
  );
};

const findByTokenHash = async (tokenHash) => {
  const [rows] = await pool.execute(
    'SELECT * FROM refresh_tokens WHERE token_hash = ? LIMIT 1',
    [tokenHash]
  );
  return rows[0] || null;
};

const deleteByTokenHash = async (tokenHash) => {
  await pool.execute(
    'DELETE FROM refresh_tokens WHERE token_hash = ?',
    [tokenHash]
  );
};

const deleteByUser = async (userId) => {
  await pool.execute(
    'DELETE FROM refresh_tokens WHERE user_id = ?',
    [userId]
  );
};

module.exports = {
  createToken,
  findByTokenHash,
  deleteByTokenHash,
  deleteByUser
};

