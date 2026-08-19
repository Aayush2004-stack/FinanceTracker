# FinanceTracker API

A Node.js + TypeScript backend API for tracking personal finances with user authentication, OTP-based email verification, and transaction management.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
- [Security Notes](#security-notes)

## Features
- User registration and login with JWT authentication
- OTP-based email verification and forgot-password flow
- Password reset and password change endpoints
- Category management (create, read, update, delete)
- Area management (create, read, update, delete)
- Transaction management (create, read, update, delete)
- PostgreSQL database integration
- Global error handling and API rate limiting

## Tech Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** PostgreSQL (`pg`)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Email Service:** Nodemailer (SMTP)

## Project Structure
```text
FinanceTracker/
├── backend/
│   ├── app.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── configs/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- PostgreSQL database

### Installation
```bash
cd /home/runner/work/FinanceTracker/FinanceTracker/backend
npm install
```

## Environment Variables
Create a `.env` file inside `/home/runner/work/FinanceTracker/FinanceTracker/backend`:

```env
PORT=3001
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## Available Scripts
Run these from `/home/runner/work/FinanceTracker/FinanceTracker/backend`:

- `npm run dev` — start development server with auto-reload
- `npm run build` — compile TypeScript to JavaScript
- `npm start` — start server (currently same command behavior as `dev`)

## API Routes
Base URL: `http://localhost:3001`

### Auth (`/api/auth`)
- `POST /register`
- `POST /login`
- `POST /send-email-verification-otp`
- `POST /validate-email-verification-otp`
- `POST /send-forgot-password-otp`
- `POST /validate-forgot-password-otp`
- `POST /reset-password` *(requires authentication)*
- `PUT /change-password` *(requires authentication)*

### Categories (`/api/categories`) *(requires authentication)*
- `POST /`
- `GET /`
- `GET /:id`
- `PUT /:id`
- `DELETE /:id`

### Areas (`/api/areas`) *(requires authentication)*
- `POST /`
- `GET /`
- `GET /:id`
- `PUT /:id`
- `DELETE /:id`

### Transactions (`/api/transactions`) *(requires authentication)*
- `POST /`
- `GET /`
- `PUT /:id`
- `DELETE /:id`

## Security Notes
- Most endpoints are protected with JWT auth middleware.
- Global API limiter is enabled (`100 requests / 15 minutes / IP`).
- Additional auth limiter is enabled on `/api/auth` (`5 requests / 15 minutes / IP`).
- OTP values are hashed before storage.
