const pool = require('../config/database');

const listByTicketId = async (ticketId) => {
  const [rows] = await pool.execute(
    `SELECT c.id, c.ticket_id, c.user_id, c.parent_comment_id, c.body, c.created_at,
            u.name AS author_name, u.email AS author_email
     FROM comments c
     INNER JOIN users u ON u.id = c.user_id
     WHERE c.ticket_id = ?
     ORDER BY c.created_at ASC`,
    [ticketId]
  );
  return rows;
};

const createComment = async ({ ticketId, userId, parentCommentId, body }) => {
  const [result] = await pool.execute(
    `INSERT INTO comments (ticket_id, user_id, parent_comment_id, body)
     VALUES (?, ?, ?, ?)`,
    [ticketId, userId, parentCommentId || null, body]
  );

  const [rows] = await pool.execute(
    `SELECT c.id, c.ticket_id, c.user_id, c.parent_comment_id, c.body, c.created_at,
            u.name AS author_name, u.email AS author_email
     FROM comments c
     INNER JOIN users u ON u.id = c.user_id
     WHERE c.id = ?`,
    [result.insertId]
  );
  return rows[0];
};

module.exports = {
  listByTicketId,
  createComment
};

