# SalaryIQ - AI-Powered Salary Analysis

A modern, full-stack Next.js application that provides AI-powered salary analysis using Google Gemini AI. Help professionals understand if they're underpaid, fairly paid, or overpaid in the current market.

## Features

- **AI-Powered Analysis**: Utilizes Google Gemini AI to provide accurate salary insights
- **Real-time Market Data**: Compares salaries against current market benchmarks
- **Interactive Visualizations**: Beautiful charts powered by Recharts
- **Smart Caching**: Results cached in Supabase for performance
- **Social Sharing**: Dynamic OG images for Twitter/LinkedIn sharing
- **Type-Safe**: Built with TypeScript and Zod validation
- **Modern UI**: Responsive design with Tailwind CSS
- **State Management**: Zustand for global state, TanStack Query for server state

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS, lucide-react icons
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 1.5 Flash
- **OG Images**: @vercel/og

## Quick Start

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Environment Setup

Create `.env.local` in the `frontend` directory (copy from `.env.local.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App URL (update when deploying)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

Run the SQL script in `frontend/README.md` in your Supabase SQL Editor.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # Salary analysis endpoint
│   │   └── og/route.tsx          # Dynamic OG image generation
│   ├── results/[id]/page.tsx     # Results page
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Homepage
├── components/
│   ├── loading-screen.tsx        # Analysis loading UI
│   ├── results-dashboard.tsx     # Results display
│   ├── salary-chart.tsx          # Recharts visualization
│   ├── salary-form.tsx           # Form with validation
│   └── share-buttons.tsx         # Social sharing
├── lib/
│   ├── gemini.ts                 # Gemini AI client
│   ├── supabase.ts               # Supabase client
│   ├── validations.ts            # Zod schemas
│   ├── providers.tsx             # TanStack Query setup
│   └── utils.ts                  # Utility functions
├── stores/
│   └── salary-store.ts           # Zustand store
├── hooks/
│   └── use-salary-analysis.ts    # TanStack Query hooks
└── types/
    └── index.ts                  # TypeScript types
```

## How It Works

1. User fills out the salary form (job title, experience, location, skills)
2. Form validates with Zod schema
3. Data sent to `/api/analyze` endpoint
4. API checks Supabase cache for similar queries
5. If cache miss, calls Gemini AI for analysis
6. AI returns salary range, verdict, recommendations
7. Results cached and returned to frontend
8. User sees results with interactive charts
9. User can share results on social media

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

Set environment variables in Vercel dashboard and update `NEXT_PUBLIC_APP_URL` to your production URL.

## License

MIT
