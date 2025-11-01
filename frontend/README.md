# SalaryIQ Frontend

AI-powered salary analysis built with Next.js 16, Google Gemini, and Supabase. The `frontend` package contains the entire web application: marketing landing page, salary intake form, loading experience, analysis results dashboard, OG image generator, and all shared client/server utilities.

For a product-level overview, see the root `README.md`. This document focuses on the application internals and day-to-day developer workflow.

---

## Feature Highlights

- **Guided salary form** – React Hook Form + Zod validation with popular skill shortcuts, currency picker, and smart sanitization (`src/components/salary-form.tsx`).
- **Optimistic UX** – Full-screen loading overlay rotates market facts while the analysis runs (`src/components/loading-screen.tsx`).
- **AI analysis pipeline** – `/api/analyze` validates payloads, enforces in-memory rate limits, reuses Supabase cache, and calls Gemini with automatic model fallback (`src/app/api/analyze/route.ts`, `src/lib/gemini.ts`, `src/lib/rate-limiter.ts`).
- **Results dashboard** – Recharts visualization, percentile-aware verdict copy, AI reasoning, recommendations, and social share tooling (`src/components/results-dashboard.tsx`).
- **Dynamic OG images** – `/api/og` generates verdict-branded cards for Twitter/LinkedIn posts (`src/app/api/og/route.tsx`).

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, Edge routes for OG)
- **Language / Types**: TypeScript + Zod runtime validation
- **State**: Zustand (persistent store) + TanStack Query (mutations, caching)
- **Styling**: Tailwind CSS 4 + `tw-animate-css` + Geist fonts
- **Charts**: Recharts
- **AI**: Google Gemini (multi-model fallback with retry logic)
- **Storage & Cache**: Supabase Postgres (`analysis_cache` table)
- **Notifications**: Sonner toasts

---

## Project Structure

```
src/
├── app/                 # App Router routes (marketing, API, OG, results)
├── components/          # Reusable UI building blocks
├── hooks/               # Custom hooks (React Query integration)
├── lib/                 # Gemini client, Supabase helpers, validation, utils
├── stores/              # Zustand global store
└── types/               # Shared TypeScript interfaces
```

Additional documentation lives under `docs/`:

- `docs/Project Guide/PRD.md` – Product requirements and roadmap
- `docs/Project Guide/DB info.md` – Supabase schema definitions
- `docs/fixes/*.md` – Postmortems for notable fixes (Gemini model updates, Next.js 15 params change, verdict tuning)

---

## Prerequisites

- Node.js 18+
- npm 9+
- Supabase project (free tier is sufficient)
- Google Gemini API key with access to `gemini-1.5-*` and `gemini-2.0-flash-exp`
- (Optional) Vercel account for hosting

---

## Setup

Install dependencies:

```bash
npm install
```

Create `frontend/.env.local` (copy from `.env.local.example`) and fill in credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=optional_service_role_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> The service role key enables secure cache writes from API routes. If you omit it, the API will fall back to the anon key.

---

## Supabase Schema

Run the SQL from `docs/Project Guide/DB info.md` in the Supabase SQL editor to provision required tables:

```sql
create table if not exists public.analysis_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key varchar(255) not null unique,
  ai_response jsonb not null,
  created_at timestamptz default timezone('utc', now()),
  expires_at timestamptz not null,
  ip_address inet,
  request_fingerprint text
);

create index if not exists analysis_cache_expires_at_idx
  on public.analysis_cache (expires_at);
```

The optional `salary_submissions` table is included in the same file if you plan to collect anonymized dataset contributions later.

---

## Running Locally

```bash
npm run dev
```

Open http://localhost:3000 and submit the salary form. The app will:
1. Validate input client-side.
2. Show the animated loading overlay while `POST /api/analyze` resolves.
3. Navigate to `/results/:id` to display the cached analysis.

---

## Quality Checks

```bash
# Static analysis
npm run lint

# Production build
npm run build

# Start production server
npm run start
```

Consider running `npm run lint` before committing; ESLint is configured via `eslint.config.mjs` with Next.js and TypeScript rules.

---

## Deployment

1. **Vercel**  
   - Link the repo, set `NEXT_PUBLIC_*`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY` in the project settings.  
   - Deploy using the Vercel dashboard or `vercel` CLI.

2. **Supabase**  
   - Ensure the `analysis_cache` table exists and Row Level Security is configured (RLS off for this table or appropriate policies).

3. **Environment variables**  
   - Update `NEXT_PUBLIC_APP_URL` to the production hostname for correct share links and OG images.

---

## Gemini Model Fallback

The prompt first attempts `gemini-2.0-flash-exp`, then falls back to `gemini-1.5-pro`, and finally `gemini-1.5-flash`. If all models fail, the API returns an error after exponential backoff (1s → 2s → 4s).

To add/remove models, edit `GEMINI_MODELS` in `src/lib/gemini.ts`.

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| **Repeated Gemini 404 errors** | Ensure listed model IDs are available to your API key. Reference `docs/fixes/GEMINI_FIX.md`. |
| **`params` Promise error on results page** | You are likely on an older build. Next.js 15 requires unwrapping with `React.use()` or `await`. See `docs/fixes/NEXTJS_15_FIX.md`. |
| **Unexpected verdicts** | Verdict logic uses percentile thresholds (P25/P75). Details in `docs/fixes/VERDICT_LOGIC_FIX.md`. Clear cached rows in Supabase if testing repeats. |
| **Rate limit exceeded (429)** | `src/lib/rate-limiter.ts` enforces in-memory RPM/RPD limits. Wait and retry; for heavy load consider Redis/multi-instance coordination. |

---

## Handy Commands

```bash
# Clear analysis cache (in Supabase SQL editor)
delete from analysis_cache where expires_at < now();

# Run only the OG image route locally
npm run dev -- --turbo --filter=api/og
```

---

## Contributing Notes

- Keep updates type-safe; add types to `src/types/index.ts` when introducing new data structures.
- Follow the existing directory conventions (`lib/` for shared helpers, `components/` for UI, `hooks/` for React hooks).
- If you introduce new environment variables, update this README and `.env.local.example`.

Happy shipping! 🚀
