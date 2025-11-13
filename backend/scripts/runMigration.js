/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const args = process.argv.slice(2);
const shouldReset = args.includes('--reset');

const schemaPath = path.join(__dirname, '..', 'database', 'migrations', 'schema.sql');

(async () => {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  if (shouldReset) {
    console.warn('!! Dropping database before migration (migrate:reset) !!');
    await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
  }

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await connection.query(`USE \`${DB_NAME}\`;`);

  const sql = fs.readFileSync(schemaPath, 'utf8');
  const statements = sql
    .split(/;\s*$/m)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await connection.query(statement);
  }

  await connection.end();
  console.log('✅ Migration completed');
})().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});

