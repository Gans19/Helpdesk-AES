# HelpDesk Lite

HelpDesk Lite is a full-stack helpdesk ticketing prototype built with an Express/MySQL backend and a Vite/React frontend. It supports authenticated users with role-based access (user, support, admin), ticket creation and lifecycle management, threaded comments, dashboards, and admin category controls.

---

## Quickstart (1 minute)

1. **Clone & install**
   ```bash
   git clone <your-repo-url> helpdesk-lite
   cd helpdesk-lite
   npm install --prefix backend
   npm install --prefix frontend
   ```

2. **Database prep**
   ```sql
   CREATE DATABASE helpdesk_lite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'helpdesk_user'@'localhost' IDENTIFIED BY 'supersecret';
   GRANT ALL PRIVILEGES ON helpdesk_lite.* TO 'helpdesk_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Environment**
   - Copy `backend/.env.example` → `backend/.env`, adjust DB creds & JWT secrets.
   - Copy `frontend/.env.example` → `frontend/.env`, adjust `VITE_API_URL` if needed.

4. **Migrate & seed**
   ```powershell
   # Windows demo script (runs migrate + seed)
   ./scripts/demo_commands.ps1
   ```
   or
   ```bash
   npm --prefix backend run migrate
   npm --prefix backend run seed
   ```

5. **Run apps**
   ```bash
   npm --prefix backend run dev
   npm --prefix frontend run dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

6. **Login with sample accounts**
   - `admin@example.com / Password123!`
   - `support@example.com / Password123!`
   - `user@example.com / Password123!`

---

## Backend Highlights

- Express 4, organized controllers/routes/middleware.
- MySQL via `mysql2/promise`, prepared statements only.
- JWT short-lived access + hashed refresh tokens, rotation on refresh.
- BCrypt password hashing, express-validator everywhere, helmet + rate limiting + CORS whitelist.
- Global JSON error handler with `success:false` envelope.
- Multer disk storage for optional ticket attachments (`backend/uploads/`).
- SQL migration (`database/migrations/schema.sql`) with DDL & foreign keys.
- Seed script (`scripts/runSeed.js`) hashes passwords and inserts sample data.
- Postman collection (`docs/HelpDeskLite.postman_collection.json`) for smoke tests.
- Jest + Supertest smoke tests for validation/guards.
- Scripts: `start`, `dev`, `migrate`, `seed`, `migrate:reset`, `test`.

## Frontend Highlights

- Vite + React 18 + React Router 6.
- AuthContext stores user & tokens (localStorage fallback) with refresh handling.
- Axios instance with interceptors for Authorization, automatic refresh, and global error propagation.
- ProtectedRoute component enforces role-based routing.
- Pages: Login, Register, Dashboard, Ticket List/Detail/Create, Admin Categories.
- Ticket detail includes threaded comments, upload, status controls (role-aware).
- Dashboard summarises status counts & recent tickets.
- CSS Modules-style classnames via `global.css`, accessible forms, inline validation messages, notification banner.

## Security Notes

- CORS restricted via `CORS_ORIGIN`.
- Rate limiting on `/api/auth/*`.
- Refresh tokens stored hashed in DB; rotation invalidates previous token.
- Attachments stored with generated filenames; user input sanitized via validator trimming/escaping.
- Tokens stored in memory + localStorage fallback; README explains trade-offs & encourages httpOnly cookie alternative for production.

## Testing & Tooling

- Postman collection covers auth, tickets, comments, categories, dashboard.
- Jest smoke tests ensure validators & auth guards.
- Scripts + PowerShell demo to run migrations and seeds.
- Logging via morgan (dev) and server console.

## AI Usage

Documented prompts and commit message plan in `USE_OF_AI.md`. Recommended git history includes explicit AI attribution (`ai: feature ...`, etc.). See file for details.

## Next Steps

- Implement file storage hardening (virus scanning, S3).
- Swap token storage to httpOnly cookies for higher security.
- Add pagination & sorting for ticket tables.
- Add email notifications or websockets for ticket updates.

Enjoy building with HelpDesk Lite!
# HelpDesk Lite

HelpDesk Lite is a full-stack helpdesk ticketing prototype built with an Express/MySQL backend and a Vite/React frontend. It supports authenticated users with role-based access (user, support, admin), ticket creation and lifecycle management, threaded comments, dashboards, and admin category controls.

---

## Quickstart (1 minute)

1. **Clone & install**
   `ash
   git clone <your-repo-url> helpdesk-lite
   cd helpdesk-lite
   npm install --prefix backend
   npm install --prefix frontend
   `

2. **Database prep**
   `sql
   CREATE DATABASE helpdesk_lite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'helpdesk_user'@'localhost' IDENTIFIED BY 'supersecret';
   GRANT ALL PRIVILEGES ON helpdesk_lite.* TO 'helpdesk_user'@'localhost';
   FLUSH PRIVILEGES;
   `

3. **Environment**
   - Copy ackend/.env.example  ackend/.env, adjust DB creds & JWT secrets.
   - Copy rontend/.env.example  rontend/.env, adjust VITE_API_URL if needed.

4. **Migrate & seed**
   `powershell
   # Windows demo script (runs migrate + seed)
   ./scripts/demo_commands.ps1
   `
   or
   `ash
   npm --prefix backend run migrate
   npm --prefix backend run seed
   `

5. **Run apps**
   `ash
   npm --prefix backend run dev
   npm --prefix frontend run dev
   `
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

6. **Login with sample accounts**
   - dmin@example.com / Password123!
   - support@example.com / Password123!
   - user@example.com / Password123!

---

## Backend Highlights

- Express 4, organized controllers/routes/middleware.
- MySQL via mysql2/promise, prepared statements only.
- JWT short-lived access + hashed refresh tokens, rotation on refresh.
- BCrypt password hashing, express-validator everywhere, helmet + rate limiting + CORS whitelist.
- Global JSON error handler with success:false envelope.
- Multer disk storage for optional ticket attachments (ackend/uploads/).
- SQL migration (database/migrations/schema.sql) with DDL & foreign keys.
- Seed script (scripts/runSeed.js) hashes passwords and inserts sample data.
- Postman collection (docs/HelpDeskLite.postman_collection.json) for smoke tests.
- Jest + Supertest smoke tests for validation/guards.
- Scripts: start, dev, migrate, seed, migrate:reset, 	est.

## Frontend Highlights

- Vite + React 18 + React Router 6.
- AuthContext stores user & tokens (localStorage fallback) with refresh handling.
- Axios instance with interceptors for Authorization, automatic refresh, and global error propagation.
- ProtectedRoute component enforces role-based routing.
- Pages: Login, Register, Dashboard, Ticket List/Detail/Create, Admin Categories.
- Ticket detail includes threaded comments, upload, status controls (role-aware).
- Dashboard summarises status counts & recent tickets.
- CSS Modules-style classnames via global.css, accessible forms, inline validation messages, notification banner.

## Security Notes

- CORS restricted via CORS_ORIGIN.
- Rate limiting on /api/auth/*.
- Refresh tokens stored hashed in DB; rotation invalidates previous token.
- Attachments stored with generated filenames; user input sanitized via validator trimming/escaping.
- Tokens stored in memory + localStorage fallback; README explains trade-offs & encourages httpOnly cookie alternative for production.

## Testing & Tooling

- Postman collection covers auth, tickets, comments, categories, dashboard.
- Jest smoke tests ensure validators & auth guards.
- Scripts + PowerShell demo to run migrations and seeds.
- Logging via morgan (dev) and server console.

## AI Usage

Documented prompts and commit message plan in USE_OF_AI.md. Recommended git history includes explicit AI attribution (i: feature ..., etc.). See file for details.

## Next Steps

- Implement file storage hardening (virus scanning, S3).
- Swap token storage to httpOnly cookies for higher security.
- Add pagination & sorting for ticket tables.
- Add email notifications or websockets for ticket updates.

Enjoy building with HelpDesk Lite!
