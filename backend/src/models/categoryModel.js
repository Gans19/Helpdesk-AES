const pool = require('../config/database');

const listCategories = async () => {
  const [rows] = await pool.execute(
    'SELECT id, name, description, created_at, updated_at FROM categories ORDER BY name ASC'
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, description FROM categories WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const findByName = async (name) => {
  const [rows] = await pool.execute(
    'SELECT id FROM categories WHERE name = ? LIMIT 1',
    [name]
  );
  return rows[0] || null;
};

const createCategory = async ({ name, description }) => {
  const [result] = await pool.execute(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description]
  );
  return findById(result.insertId);
};

const updateCategory = async (id, { name, description }) => {
  await pool.execute(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );
  return findById(id);
};

const deleteCategory = async (id) => {
  await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
};

module.exports = {
  listCategories,
  findById,
  findByName,
  createCategory,
  updateCategory,
  deleteCategory
};

