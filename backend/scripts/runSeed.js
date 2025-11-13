/* eslint-disable no-console */
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const seedData = require('../database/seeds/seedData');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function seed() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: false
  });

  try {
    await connection.beginTransaction();

    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('TRUNCATE TABLE comments;');
    await connection.query('TRUNCATE TABLE tickets;');
    await connection.query('TRUNCATE TABLE refresh_tokens;');
    await connection.query('TRUNCATE TABLE categories;');
    await connection.query('TRUNCATE TABLE users;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    const userIdMap = new Map();
    for (const user of seedData.users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, passwordHash, user.role]
      );
      userIdMap.set(user.email, result.insertId);
    }

    const categoryIdMap = new Map();
    for (const category of seedData.categories) {
      const [result] = await connection.execute(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      );
      categoryIdMap.set(category.name, result.insertId);
    }

    const ticketIdMap = new Map();
    for (const ticket of seedData.tickets) {
      const [result] = await connection.execute(
        `INSERT INTO tickets
        (user_id, assigned_to, category_id, title, description, priority, status, attachment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userIdMap.get(ticket.ownerEmail),
          ticket.assignedEmail ? userIdMap.get(ticket.assignedEmail) : null,
          categoryIdMap.get(ticket.categoryName),
          ticket.title,
          ticket.description,
          ticket.priority,
          ticket.status,
          ticket.attachment
        ]
      );
      ticketIdMap.set(ticket.title, result.insertId);
    }

    for (const comment of seedData.comments) {
      let parentId = null;
      if (comment.parentBody) {
        const [rows] = await connection.execute(
          'SELECT id FROM comments WHERE ticket_id = ? AND body = ? LIMIT 1',
          [ticketIdMap.get(comment.ticketTitle), comment.parentBody]
        );
        parentId = rows[0]?.id || null;
      }

      await connection.execute(
        `INSERT INTO comments (ticket_id, user_id, parent_comment_id, body)
         VALUES (?, ?, ?, ?)`,
        [
          ticketIdMap.get(comment.ticketTitle),
          userIdMap.get(comment.authorEmail),
          parentId,
          comment.body
        ]
      );
    }

    await connection.commit();
    console.log('✅ Database seeded successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

seed();

