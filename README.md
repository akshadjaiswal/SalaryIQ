
# SalaryIQ - AI-Powered Salary Intelligence Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![React 19](https://img.shields.io/badge/React-19-149ECA?style=flat&logo=react&logoColor=white)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/) [![Google Gemini](https://img.shields.io/badge/Google_Gemini-8B5CF6?style=flat&logo=google&logoColor=white)](https://gemini.google.com/) [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/) [![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](https://opensource.org/licenses/MIT)

SalaryIQ is an AI-powered platform that helps tech professionals (developers, designers, product managers, and more) understand where their compensation stands in the current market. By analyzing job title, experience, location, skills, and other factors, it delivers personalized verdicts: **underpaid**, **fairly paid**, or **overpaid**. Built with a modern Next.js stack, it features real-time AI insights, interactive visualizations, and smart caching for a seamless experience.

> Empowering salary transparency with data-driven recommendations to negotiate better or upskill effectively.

----------

## Highlights

-   **Guided Intake Form**: User-friendly form with autocomplete, validation, skill tags, currency selection, and inline tips.
-   **AI-Driven Analysis**: Powered by Google Gemini (with multi-model fallbacks like gemini-2.0-flash-exp, gemini-1.5-pro, gemini-1.5-flash) for accurate salary ranges, percentiles, verdicts, and actionable advice.
-   **Performance Optimization**: Supabase caching to reduce AI calls, respect rate limits, and enable quick homepage stats.
-   **Interactive Results**: Verdict banners, Recharts bell curves with percentile markers, AI reasoning explanations, and personalized recommendations.
-   **Social Sharing**: Dynamic OG images and pre-filled templates for Twitter, LinkedIn, and more.
-   **Future-Proof Design**: Type-safe codebase, component-driven architecture, and extensible for community features.

For the full product requirements and roadmap, see docs/Project Guide/PRD.md.

----------

## Architecture

-   **Frontend**: Next.js 16 (App Router) with React 19 for a responsive, server-rendered experience.
-   **Backend**: Next.js API routes for analysis and OG image generation.
-   **Database**: Supabase (PostgreSQL) for caching AI responses (and future salary submissions).
-   **AI Integration**: Resilient Gemini API calls with exponential backoff retries.
-   **State Management**: Zustand for global state + TanStack Query for data fetching/caching.

### Request Flow

1.  User submits form data via React Hook Form.
2.  API route validates input, checks Supabase cache.
3.  On cache miss, queries Gemini AI.
4.  Caches response and returns JSON (salary range, verdict, etc.).
5.  Frontend renders dashboard with charts and shares.

----------



## Tech Stack

<div align="center">

| Category | Technology |
|--------|------------|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css&logoColor=white) |
| **State** | ![Zustand](https://img.shields.io/badge/Zustand-5-8B5CF6?logo=react&logoColor=white) • ![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=react-query&logoColor=white) |
| **Forms** | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-8-EC5990?logo=react&logoColor=white) • ![Zod](https://img.shields.io/badge/Zod-3-3DDC84?logoColor=white) |
| **Charts** | ![Recharts](https://img.shields.io/badge/Recharts-2-7C3AED?logo=react&logoColor=white) |
| **AI** | ![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5-8B5CF6?logo=google&logoColor=white) |
| **Database** | ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white) |
| **OG Images** | ![Vercel OG](https://img.shields.io/badge/Vercel_OG-000000?logo=vercel&logoColor=white) |
</div>


----------

## Quick Start

### Prerequisites

-   Node.js 18+ and npm
-   Supabase account (free tier sufficient)
-   Google Gemini API key (free tier: 1,500 req/day)

### 1. Clone & Install

bash

```
git clone https://github.com/akshadjaiswal/SalaryIQ.git
cd SalaryIQ/frontend
npm install
```

### 2. Environment Setup

Copy .env.local.example to .env.local and fill in:

text

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional for server-side ops
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production
```

### 3. Database Setup

Run the SQL scripts from docs/Project Guide/DB info.md in your Supabase SQL Editor to create analysis_cache (and optional salary_submissions).

### 4. Run Development Server

bash

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test the end-to-end flow.

### Additional Commands

-   npm run lint: Run ESLint for code quality.
-   npm run build: Production build.
-   npm run start: Serve the built app.

For troubleshooting, see frontend/README.md.

----------

## Project Structure

text

```
frontend/src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # AI analysis endpoint
│   │   └── og/route.tsx          # OG image generation
│   ├── results/[id]/page.tsx     # Dynamic results page
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Homepage/landing
├── components/
│   ├── loading-screen.tsx        # Loading UI during analysis
│   ├── results-dashboard.tsx     # Verdict, charts, recommendations
│   ├── salary-chart.tsx          # Recharts bell curve
│   ├── salary-form.tsx           # Intake form with validation
│   └── share-buttons.tsx         # Social share widgets
├── lib/
│   ├── gemini.ts                 # AI client with fallbacks
│   ├── supabase.ts               # Database client
│   ├── validations.ts            # Zod schemas
│   ├── providers.tsx             # Query client setup
│   └── utils.ts                  # Helpers (e.g., cache keys)
├── stores/
│   └── salary-store.ts           # Zustand global store
├── hooks/
│   └── use-salary-analysis.ts    # Custom TanStack hooks
└── types/
    └── index.ts                  # Shared TypeScript types
```

----------

## How It Works

1.  **Form Submission**: User enters details (job title, years of experience, location, industry, skills, optional salary).
2.  **Validation**: Zod ensures clean data.
3.  **API Processing**: /api/analyze checks cache; if missed, calls Gemini for insights.
4.  **AI Output**: Returns JSON with range, verdict, percentile, recommendations, and confidence.
5.  **Dashboard Rendering**: Displays results with interactive charts and share options.
6.  **Caching**: Stores in Supabase for 24 hours to optimize performance.
7.  **Sharing**: Generates dynamic OG images for social previews.

----------

## Deployment

### Vercel (Recommended)

1.  Install Vercel CLI: npm i -g vercel
2.  Deploy: cd frontend && vercel
3.  Set environment variables in Vercel dashboard.
4.  Update NEXT_PUBLIC_APP_URL to your domain.

### Monitoring

-   Vercel Logs: For API debugging.
-   Supabase Dashboard: Track cache usage; add a cron for cleaning expired entries.

----------

## Contributing

Contributions are welcome! To get started:

1.  Fork the repo and create a feature branch from main.
2.  Follow existing patterns (TypeScript, App Router, component-based).
3.  Update docs for any config/architecture changes.
4.  Run npm run lint before committing.
5.  Submit a PR with:
    -   Change summary and rationale.
    -   Impacted files.
    -   Testing steps.
    -   Screenshots for UI updates.

### Reporting Issues

Include:

-   Expected vs. actual behavior.
-   Reproduction steps.
-   Environment (browser, OS, Node).
-   Logs/screenshots.

----------

## Roadmap

-   **Community Features**: Salary submissions and aggregated dashboards.
-   **Advanced Analytics**: Historical trends, cost-of-living comparisons.
-   **AI Enhancements**: Negotiation chatbots, career advisors.
-   **UX Polish**: Localization, multi-currency, exports.
-   **Scalability**: Rate limiting, monitoring integrations.

----------

## Maintainers

-   **Akshad Jaiswal** [](https://github.com/akshadjaiswal)– Initial build and core features.

Feedback via issues/PRs is appreciated! 🚀