const pool = require('../config/database');

const baseSelect = `
  SELECT
    t.id,
    t.title,
    t.description,
    t.priority,
    t.status,
    t.attachment,
    t.created_at,
    t.updated_at,
    t.user_id,
    owner.name AS owner_name,
    owner.email AS owner_email,
    t.assigned_to,
    assignee.name AS assignee_name,
    assignee.email AS assignee_email,
    c.id AS category_id,
    c.name AS category_name
  FROM tickets t
  INNER JOIN users owner ON owner.id = t.user_id
  INNER JOIN categories c ON c.id = t.category_id
  LEFT JOIN users assignee ON assignee.id = t.assigned_to
`;

const findById = async (id) => {
  const [rows] = await pool.execute(`${baseSelect} WHERE t.id = ?`, [id]);
  return rows[0] || null;
};

const listTickets = async ({ role, userId, filters = {} }) => {
  const params = [];
  const where = [];

  if (role === 'user') {
    where.push('t.user_id = ?');
    params.push(userId);
  }
  if (filters.status) {
    where.push('t.status = ?');
    params.push(filters.status);
  }
  if (filters.priority) {
    where.push('t.priority = ?');
    params.push(filters.priority);
  }
  if (filters.categoryId) {
    where.push('t.category_id = ?');
    params.push(filters.categoryId);
  }

  const sql = `${baseSelect} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY t.created_at DESC`;
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const createTicket = async ({ title, description, priority, categoryId, userId, attachment }) => {
  const [result] = await pool.execute(
    `INSERT INTO tickets (title, description, priority, category_id, user_id, attachment)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, priority, categoryId, userId, attachment]
  );
  return findById(result.insertId);
};

const updateTicket = async (id, payload) => {
  const fields = [];
  const params = [];

  if (payload.title !== undefined) {
    fields.push('title = ?');
    params.push(payload.title);
  }
  if (payload.description !== undefined) {
    fields.push('description = ?');
    params.push(payload.description);
  }
  if (payload.priority !== undefined) {
    fields.push('priority = ?');
    params.push(payload.priority);
  }
  if (payload.status !== undefined) {
    fields.push('status = ?');
    params.push(payload.status);
  }
  if (payload.assignedTo !== undefined) {
    fields.push('assigned_to = ?');
    params.push(payload.assignedTo);
  }
  if (payload.attachment !== undefined) {
    fields.push('attachment = ?');
    params.push(payload.attachment);
  }

  if (!fields.length) return findById(id);

  params.push(id);
  await pool.execute(`UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`, params);
  return findById(id);
};

const deleteTicket = async (id) => {
  await pool.execute('DELETE FROM tickets WHERE id = ?', [id]);
};

const countTicketsByStatus = async ({ role, userId }) => {
  const params = [];
  let sql = `
    SELECT status, COUNT(*) as total
    FROM tickets
  `;
  if (role === 'user') {
    sql += ' WHERE user_id = ?';
    params.push(userId);
  }
  sql += ' GROUP BY status';
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const recentTickets = async ({ role, userId, limit = 5 }) => {
  const params = [];
  let sql = `${baseSelect} `;
  if (role === 'user') {
    sql += 'WHERE t.user_id = ? ';
    params.push(userId);
  }
  sql += 'ORDER BY t.created_at DESC LIMIT ?';
  params.push(limit);
  const [rows] = await pool.execute(sql, params);
  return rows;
};

module.exports = {
  findById,
  listTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  countTicketsByStatus,
  recentTickets
};

