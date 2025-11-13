# HelpDesk Lite Backend

Express.js REST API with JWT authentication, MySQL persistence, and role-aware ticket workflows.

## Requirements

- Node.js ≥ 18
- MySQL ≥ 8
- npm

## Setup

```bash
cp .env.example .env
npm install
```

Create the database & user (adjust names as needed):

```sql
CREATE DATABASE helpdesk_lite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'helpdesk_user'@'localhost' IDENTIFIED BY 'supersecret';
GRANT ALL PRIVILEGES ON helpdesk_lite.* TO 'helpdesk_user'@'localhost';
FLUSH PRIVILEGES;
```

## Scripts

- `npm run dev` – start dev server with nodemon.
- `npm run start` – production server.
- `npm run migrate` – applies `database/migrations/schema.sql`.
- `npm run migrate:reset` – drops & re-creates schema (DANGER: data loss).
- `npm run seed` – populate sample data via `scripts/runSeed.js`.
- `npm run test` – executes Jest smoke tests.

Windows helper: `../scripts/demo_commands.ps1`.

## File Uploads

Ticket attachments stored in `uploads/`. Ensure directory exists (created automatically on upload). For production, integrate object storage + virus scanning.

## Security

- CORS origin enforced via `CORS_ORIGIN`.
- helmet + HSTS (disabled on localhost).
- Rate limiting on `/api/auth/*`.
- Passwords hashed with bcrypt.
- Refresh tokens hashed (SHA-256) before storage.
- Input validation from `express-validator`.
- Sanitized error messages (no stack traces leaked in production).

## Tests / Tools

See `../docs/HelpDeskLite.postman_collection.json` for Postman requests. Jest smoke tests cover validation & auth guard behaviour.

## Sample Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@example.com | Password123! |
| Support | support@example.com | Password123! |
| User | user@example.com | Password123! |

