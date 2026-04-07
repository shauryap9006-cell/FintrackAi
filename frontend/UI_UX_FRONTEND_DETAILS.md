# FinTrack AI: UI/UX & Frontend Documentation

FinTrack AI is a modern, premium financial management application designed with a focus on visual excellence, smooth interactions, and AI-driven utility.

## 🎨 Design Philosophy & Aesthetics

The application follows a **Premium Modern Web** aesthetic, characterized by:

- **Glassmorphism**: Extensive use of `backdrop-filter: blur()` and semi-transparent backgrounds to create depth and a layered feel.
- **Dynamic Gradients**: Vibrant linear gradients (Indigo to Cyan) used for primary actions, text highlights, and background accents.
- **Dark & Light Modes**: Full support for system-preferred or user-selected themes with smooth CSS transitions.
- **Micro-Animations**: subtle hover scales, entrance fades, and page transitions powered by Framer Motion.
- **Modern Typography**: Utilizes the 'Inter' font family for its clean, professional, and readable appearance across all devices.

## 🛠 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.2 (App Router) |
| **Language** | JavaScript (ES6+) |
| **Logic/UI** | React 19.2 |
| **Styling** | Tailwind CSS v4 (Custom Design Tokens) |
| **Animations** | Framer Motion 12.3 |
| **Charts** | Recharts 3.8 |
| **Toasts** | React Hot Toast |
| **Context** | React Context API (Auth, Theme) |

## 📐 Frontend Architecture

The project follows a standard Next.js App Router structure under `src/`:

- **/app**: Contains all pages, layouts, and global styles.
  - `(auth)/`: Login and Signup pages.
  - `dashboard/`: Core application overview.
  - `analytics/`: Data visualization and spending trends.
  - `ai-insights/`: AI-powered financial advisory interface.
  - `add-expense/`: Input form for new entries.
- **/components**: Reusable UI primitives and complex domain components.
  - `BalanceCard`, `TransactionList`, `AIInsightsPanel`, etc.
- **/context**: Shared state management for Authentication and UI settings.
- **/lib**: API wrappers, utility functions, and constant definitions.

## ✨ Core UI/UX Features

### 1. Smart Dashboard
The central hub providing an immediate overview of financial health.
- **Balance Card**: Visualizes current net balance with quick action buttons.
- **Stats Row**: High-level summary of total income, expenses, and transaction count.
- **Recent Activity**: A minimalist list of the latest transactions with category-specific tagging.

### 2. AI-Powered Advisory
Leveraging Google Gemini AI to provide context-aware financial advice.
- **Insights Panel**: Displays AI-generated tips based on the user's spending habits.
- **Conversational UI**: Clean, card-based interface for easy reading of recommendations.

### 3. Data Visualization
Transforms raw numbers into actionable insights.
- **Category Breakdowns**: Pie/Donut charts showing where money goes.
- **Spending Trends**: Line/Area charts visualizing financial progress over time.

### 4. Interactive UX
- **Skeleton Loaders**: Custom skeleton components used during data fetching to maintain layout stability.
- **Protected Routing**: Seamless redirection for unauthenticated users using a specialized `ProtectedRoute` wrapper.
- **Responsive Layout**: A persistent sidebar on desktop that transforms into a mobile-friendly navigation pattern.

## 💎 Design Tokens (CSS Variables)

The design system is built on localized CSS variables in `globals.css`:

```css
:root {
  --color-primary: #6366f1;   /* Indigo-500 */
  --color-accent: #06b6d4;    /* Cyan-500 */
  --color-success: #10b981;   /* Emerald-500 */
  --color-danger: #ef4444;    /* Red-500 */
  --bg-primary: #ffffff;
  --bg-card: #ffffff;
  --glass-bg: rgba(255, 255, 255, 0.7);
}

.dark {
  --bg-primary: #0b0f1a;
  --bg-card: #1e293b;
  --glass-bg: rgba(30, 41, 59, 0.7);
}
```

## 🚀 Performance Optimizations
- **Turbopack**: Uses the latest Next.js compiler for lightning-fast development builds.
- **Lazy Loading**: Automatic code splitting provided by Next.js.
- **Optimized Assets**: Dynamic font loading and optimized SVG icons.
