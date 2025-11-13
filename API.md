# HelpDesk Lite API

Base URL: `http://localhost:5000/api`

All responses use the envelope:
```json
{
  "success": true,
  "message": "optional descriptive text",
  "data": { }
}
```
Errors:
```json
{
  "success": false,
  "message": "High-level message",
  "errors": [
    { "field": "email", "message": "Email is invalid" }
  ]
}
```

Authentication: Bearer JWT access token. Refresh token returned during login.

---

## Auth

| Method | Endpoint | Description | Request Body | Notes |
| ------ | -------- | ----------- | ------------ | ----- |
| POST | `/auth/register` | Register new account | `{ name, email, password, role? }` | Role defaults to `user`. Admin-only creation via seed/admin in production. |
| POST | `/auth/login` | Obtain tokens | `{ email, password }` | Returns `{ accessToken, refreshToken, expiresIn, user }`. |
| POST | `/auth/refresh` | Rotate tokens | `{ refreshToken }` | Requires valid stored refresh token. |

---

## Users

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/users/me` | Returns current user profile and role. |

---

## Tickets

| Method | Endpoint | Description | Notes |
| ------ | -------- | ----------- | ----- |
| GET | `/tickets` | List tickets | Users see own tickets; support/admin see all. Query params: `status`, `priority`, `categoryId`. |
| POST | `/tickets` | Create ticket | Multipart `FormData` with `title`, `description`, `categoryId`, `priority`, optional `attachment`. |
| GET | `/tickets/:id` | Ticket detail | Includes category, owner, assignment. |
| PUT | `/tickets/:id` | Update ticket | Users can update title/description while ticket open; support/admin can update status, priority, assignment. |
| DELETE | `/tickets/:id` | Delete ticket | Admin only. |

### Comments (Threaded)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/tickets/:id/comments` | Fetch comments, nested via `parentCommentId`. |
| POST | `/tickets/:id/comments` | Add comment `{ body, parentCommentId? }`; available to ticket owner, support, admin. |

---

## Categories (Admin)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/categories` | List categories. |
| POST | `/categories` | Create category `{ name, description? }`. |
| PUT | `/categories/:id` | Update category. |
| DELETE | `/categories/:id` | Delete category (only if no tickets or reassign first). |

---

## Dashboard

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/dashboard` | Returns `{ totals, recent }`. Users see scoped stats (own tickets); support/admin see global. |

---

## HTTP Status Codes

- 200 OK / 201 Created: success.
- 204 No Content: deletion success.
- 400 Bad Request: validation failure / business rule violation.
- 401 Unauthorized: missing/invalid token.
- 403 Forbidden: role restriction.
- 404 Not Found: missing resource.
- 409 Conflict: duplicates (e.g., email already used).
- 500 Internal Server Error: unexpected server issue (message sanitized).

---

## Sample Auth Flow

1. `POST /auth/login` → store access & refresh tokens.
2. Use access token in `Authorization: Bearer <token>` header.
3. On 401, call `POST /auth/refresh` with refresh token → rotate tokens.
4. Call `GET /users/me` to hydrate context.

See Postman collection in `docs/HelpDeskLite.postman_collection.json` for request samples.

