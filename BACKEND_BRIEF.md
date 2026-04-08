# Backend Brief (`backend/`)

## Overview
- Node.js + Express API for a personal finance app (`FinTrack AI`).
- MongoDB with Mongoose for persistence (`User`, `Transaction`).
- JWT-based authentication protects finance, analytics, AI, and payments routes.
- Also supports in-memory MongoDB fallback for local testing when local Mongo is unavailable.

## Tech Stack
- Runtime/framework: Node.js, Express
- Database/ODM: MongoDB, Mongoose
- Auth/security: `jsonwebtoken`, `bcryptjs`
- Validation: `express-validator`
- External services:
  - Groq chat completions API (AI insights generation)
  - PayPal Checkout API (order create/capture)
- Infra helpers: `dotenv`, `cors`, `mongodb-memory-server`

## API Surface
- `GET /api/health` - health check
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me` (protected)
- Transactions (protected):
  - `POST /api/transactions/add`
  - `GET /api/transactions`
  - `DELETE /api/transactions/:id`
- Analytics (protected):
  - `GET /api/analytics`
- AI (protected):
  - `POST /api/ai/advice`
- Payments (protected):
  - `POST /api/payments/create-order`
  - `POST /api/payments/verify`

## Core Business Logic
- `transactionController`: create/list/delete user-owned transactions.
- `analyticsController`: aggregates monthly spending, category totals, and income-vs-expense balance.
- `aiController`: summarizes transaction data and requests structured JSON financial advice from Groq.
- `paymentController`: creates and captures PayPal orders; optionally stores completed payments as transactions.
- `authController`: user registration/login + token issuance.

## Data Model Snapshot
- `User`: `name`, `email` (unique), `password` (hashed pre-save), `createdAt`.
- `Transaction`: `amount`, `category`, `type` (`income|expense`), `date`, `userId`, `note`, timestamps.

## Environment / Config Notes
- Main vars in `.env.example`:
  - `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`, Razorpay keys (legacy), plus app also expects JWT/PayPal vars in runtime.
- Auth uses fallback JWT secret if unset (not recommended for production).
- DB connect tries configured URI first; if localhost fails, starts ephemeral in-memory DB.

## Quick Observations
- Good: clean controller/route separation, protected routes, clear aggregate analytics.
- Watchlist:
  - `transactions` route has duplicated `type` validator line.
  - Frontend says Gemini, backend currently calls Groq endpoint.
  - Fallback secrets/defaults are convenient for dev but risky for production.
