# Use of AI

## Prompts

1. **Project Scaffold (2025-11-13)**  
   *"Create a full-stack HelpDesk Lite boilerplate with Express, React, JWT auth, MySQL schema, and seeding scripts. Include role-based routes and validation."*

2. **Security Review (2025-11-13)**  
   *"Double-check the Express middleware stack for security best practices (helmet, cors, rate limiting, sanitized errors)."*

3. **Frontend Auth Flow (2025-11-13)**  
   *"Design a React AuthContext with axios interceptors that handles refresh tokens and role-based routing."*

4. **Documentation Pass (2025-11-13)**  
   *"Summarize setup steps, sample credentials, and security trade-offs for storing JWTs in localStorage vs httpOnly cookies."*

## Planned Commit Messages

- `ai: scaffold express api with auth, tickets, categories`
- `ai: wire mysql migrations and seed scripts`
- `ai: add react auth context and protected routes`
- `ai: document api contract and ai usage`
- `ai: polish ui, notifications, and dashboard`
- `ai: add postman collection and smoke tests`

These commit messages explicitly acknowledge AI assistance per policy.

## Notes

- Human review recommended before production.
- Secrets in `.env` examples are placeholders and must be changed.
- Token storage strategy discussed in README; production deployment should adopt httpOnly cookies & CSRF mitigation.

