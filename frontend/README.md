# HelpDesk Lite Frontend

Vite + React SPA for interacting with the HelpDesk Lite API.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Defaults to `http://localhost:5173` and expects API at `http://localhost:5000/api`.

## Auth Flow

- Login stores access + refresh tokens in memory and `localStorage` (fallback).
- Access token attached via axios interceptor.
- 401 triggers automatic refresh using stored refresh token.
- `ProtectedRoute` checks role before rendering.

> **Security note:** localStorage is vulnerable to XSS; production environments should implement httpOnly cookies and CSRF protections. Documented trade-offs in root README.

## Pages

- **Login / Register** – form validation, error feedback.
- **Dashboard** – status counts, recent tickets.
- **Tickets** – list, create, detail with comments.
- **Admin Categories** – CRUD for categories.
- **Profile** – derived from `/users/me` (exposed in header).

## Styling

Minimal layout via `src/styles/global.css`. Replace with Tailwind or a design system if desired.

## Scripts

- `npm run dev` – start dev server.
- `npm run build` – production build.
- `npm run preview` – preview production bundle.

