# Frontend Brief (`frontend/`)

## Overview
- Next.js App Router frontend for `FinTrack AI`.
- Client-heavy React UI with protected finance dashboard flows.
- Integrates with backend REST API for auth, transactions, analytics, AI insights, and payments.
- Strong visual focus: animated gradients, motion effects, glassmorphism-inspired cards.

## Tech Stack
- Framework: Next.js (`app/` directory), React
- Styling/UI: global CSS + utility classes, custom component styles, theme toggling with `next-themes`
- Animation: `framer-motion`, `gsap`
- Charts: `recharts`
- Notifications: `react-hot-toast`
- Payments UI: `@paypal/react-paypal-js`

## App Pages
- Public:
  - `/` landing page
  - `/login`
  - `/signup`
- Protected:
  - `/dashboard` (overview + recent transactions)
  - `/add-expense` (add transaction + PayPal add-funds flow)
  - `/analytics` (category/monthly/income-expense visualizations)
  - `/ai-insights` (on-demand AI analysis from user transactions)

## Key Architecture Notes
- `src/lib/api.js` centralizes all API calls and auto-attaches JWT from `localStorage`.
- `AuthContext` stores current user/token in client state + `localStorage`.
- `ProtectedRoute` is used on finance pages to guard access.
- `providers.js` composes theme provider + auth provider globally.
- Root layout wraps pages with shared `AppLayout`, toasts, and global theming.

## Feature Flows
- Auth flow:
  - login/signup call backend auth endpoints
  - token + user persisted in `localStorage`
  - redirect to `/dashboard`
- Dashboard flow:
  - fetches transactions + analytics in parallel
  - renders balance, stats, recent list, and quick actions
- AI flow:
  - collects transactions
  - sends them to backend AI endpoint
  - displays structured summary/alerts/tips
- Payment flow:
  - creates PayPal order via backend
  - captures/verifies payment
  - stores successful payment as transaction

## Config Notes
- Uses `NEXT_PUBLIC_API_URL` (fallback `http://localhost:5000/api`).
- Uses `NEXT_PUBLIC_PAYPAL_CLIENT_ID` for PayPal button initialization.

## Quick Observations
- Good: clear page-level separation, reusable components, consistent API abstraction.
- Watchlist:
  - Marketing text references Gemini while backend currently calls Groq.
  - App is mostly client-rendered; SEO and SSR benefits are limited on feature pages.
  - Some visual styling is inline-heavy, which can make long-term design maintenance harder.
