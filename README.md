
# SalaryIQ - AI-Powered Salary Intelligence Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![React 19](https://img.shields.io/badge/React-19-149ECA?style=flat&logo=react&logoColor=white)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/) [![Google Gemini](https://img.shields.io/badge/Google_Gemini-8B5CF6?style=flat&logo=google&logoColor=white)](https://gemini.google.com/) [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/) [![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](https://opensource.org/licenses/MIT)

SalaryIQ is an AI-powered platform that helps tech professionals (developers, designers, product managers, and more) understand where their compensation stands in the current market. By analyzing job title, experience, location, skills, and other factors, it delivers personalized verdicts: **underpaid**, **fairly paid**, or **overpaid**. Built with a modern Next.js stack, it features real-time AI insights, interactive visualizations, smart caching, and **comprehensive career analytics** for a seamless experience.

> Empowering salary transparency with data-driven recommendations to negotiate better or upskill effectively.

## 🎉 What's New in v2.0 (November 2025)

### 🚀 Major Feature: Advanced Analytics Dashboard
We've completely transformed SalaryIQ with **6 new analytics cards** that provide deep career insights:
- 📊 **Market Position**: See your percentile ranking and city premium
- 📈 **5-Year Projections**: Visualize salary growth with realistic timelines
- ⚡ **Skill Impact**: Discover which skills boost salary the most
- 🗺️ **Location Insights**: Compare salaries across major cities
- 🏢 **Industry Benchmarks**: Understand industry trends and opportunities
- 🎯 **Career Timeline**: Calculate years to target with 3 growth scenarios

### ✨ Enhanced User Experience
- **4-Stage Loading Screen**: Beautiful animated progress with fun facts
- **Fixed Header Alignment**: Perfect CSS Grid layout in results page
- **Modern Color System**: Tailwind CSS 4 with custom terracotta/sage/cream variables
- **Full Dark Mode**: Complete theme support throughout the app
- **Responsive Design**: Optimized for mobile, tablet, and desktop

----------

## Highlights

-   **Guided Intake Form**: User-friendly form with autocomplete, validation, skill tags, currency selection, and inline tips.
-   **AI-Driven Analysis**: Powered by Google Gemini (with multi-model fallbacks like gemini-2.0-flash-exp, gemini-1.5-pro, gemini-1.5-flash) for accurate salary ranges, percentiles, verdicts, and actionable advice.
-   **🆕 Advanced Analytics Dashboard**: Comprehensive career insights including:
    -   📊 **Market Position**: See where you rank (percentile) compared to similar professionals
    -   📈 **5-Year Earnings Projection**: Visualize your salary growth potential with realistic timelines
    -   ⚡ **Skill Impact Analysis**: Discover top 3-5 skills that could boost your salary with demand indicators
    -   🗺️ **Location Comparisons**: Compare your salary across 3-4 major cities
    -   🏢 **Industry Benchmarks**: See how different industries pay with growth trends (rising/stable/declining)
    -   🎯 **Time to Target**: Calculate years needed to reach target salary with 3 scenarios (average/aggressive/with skills)
-   **Stage-Based Loading Experience**: Beautiful 4-stage loading screen with progress indicators, animations, and fun facts
-   **Performance Optimization**: Supabase caching to reduce AI calls, respect rate limits, and enable quick results retrieval.
-   **Interactive Results**: Verdict banners, Recharts bell curves with percentile markers, AI reasoning explanations, and personalized recommendations.
-   **Social Sharing**: Dynamic OG images and pre-filled templates for Twitter, LinkedIn, and more.
-   **Modern Design System**: Tailwind CSS 4 with custom color variables (terracotta/sage/cream theme), full dark mode support, and responsive layouts.
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
3.  On cache miss, queries Gemini AI with enhanced prompt requesting analytics.
4.  AI returns comprehensive response including salary range, verdict, and 6 analytics datasets.
5.  API transforms snake_case to camelCase and structures analytics data.
6.  Caches complete response (7 days) and returns JSON.
7.  Frontend displays 4-stage loading screen with smooth transitions.
8.  Dashboard renders with verdict, charts, recommendations, and analytics cards.
9.  User can explore analytics insights and share results.

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

## 🎨 Design & User Experience

### Modern Color System
- **Terracotta Primary** (`#B85042`): Warm, professional brand color for CTAs and accents
- **Sage Secondary** (`#A7BEAE`): Calming green for "fair" verdicts and secondary elements
- **Cream Background** (`#E7E8D1`): Minimal, clean aesthetic for excellent readability
- **Tailwind CSS 4**: Custom color variables with `@theme inline` directive
- **Full Dark Mode**: Complete theme support with dark: variants throughout

### UI Components
- **4-Stage Loading Screen**:
  - Smooth animations with terracotta gradient icons
  - Progress bars with shimmer effects
  - Stage indicators and fun facts
  - Trust badges at bottom
- **Analytics Cards**:
  - Consistent 12x12 colored icon headers
  - Hover effects and smooth transitions
  - Responsive grid layouts
  - Color-coded data visualization (green/red for positive/negative)
- **Verdict Display**:
  - Large emoji indicators (📉 underpaid, ✅ fair, 🎉 overpaid)
  - Color-coded backgrounds and borders
  - Confidence score badges
- **Interactive Charts**:
  - Recharts bell curves with your position
  - Percentile markers (25th, 50th, 75th)
  - Terracotta highlighting for median values

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layouts**: 1/2/3 column grids based on viewport
- **Text Truncation**: "Back to Home" → "Back" on mobile
- **Touch-Friendly**: Large tap targets and proper spacing

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
│   │   ├── analyze/route.ts            # AI analysis endpoint with analytics
│   │   ├── results/[id]/route.ts       # Cached results retrieval
│   │   ├── results/[id]/metadata/      # OG metadata endpoint
│   │   └── og/route.tsx                # OG image generation
│   ├── analyze/page.tsx                # Form page
│   ├── results/[id]/
│   │   ├── page.tsx                    # Dynamic results page with header
│   │   └── metadata.ts                 # OG metadata generator
│   ├── layout.tsx                      # Root layout with providers
│   ├── globals.css                     # Tailwind + CSS variables (@theme inline)
│   └── page.tsx                        # Homepage/landing
├── components/
│   ├── loading-screen.tsx              # 4-stage loading with animations
│   ├── results-dashboard.tsx           # Verdict, charts, recommendations, analytics
│   ├── salary-chart.tsx                # Recharts bell curve
│   ├── salary-form.tsx                 # Intake form with validation
│   ├── share-buttons.tsx               # Social share widgets
│   └── analytics/                      # 🆕 Analytics card components
│       ├── market-position-card.tsx    # Percentile ranking & market position
│       ├── earning-projection-card.tsx # 5-year salary projections
│       ├── skill-impact-card.tsx       # Skill salary impacts
│       ├── location-comparison-card.tsx# City comparisons
│       ├── industry-benchmark-card.tsx # Industry insights
│       └── time-to-target-card.tsx     # Career timeline scenarios
├── lib/
│   ├── gemini.ts                       # AI client with enhanced analytics prompt
│   ├── supabase.ts                     # Database client
│   ├── validations.ts                  # Zod schemas
│   ├── rate-limiter.ts                 # API rate limiting (15 RPM, 200 RPD)
│   ├── providers.tsx                   # Query client setup
│   └── utils.ts                        # Helpers (formatCurrency, etc.)
├── stores/
│   └── salary-store.ts                 # Zustand global store
├── hooks/
│   └── use-salary-analysis.ts          # Custom TanStack hooks
└── types/
    └── index.ts                        # TypeScript types + analytics interfaces
```

----------

## How It Works

1.  **Landing Page**: User arrives at modern homepage with hero section and feature showcase.
2.  **Form Submission**: User clicks "Get Started" and enters details on `/analyze` page (job title, years of experience, location, industry, skills, optional salary).
3.  **Validation**: Zod ensures clean data with comprehensive error messages.
4.  **4-Stage Loading**: Beautiful animated loading screen guides user through analysis process:
    -   🔍 Stage 1: Analyzing Your Profile
    -   📊 Stage 2: Comparing Market Data
    -   🤖 Stage 3: AI Processing
    -   ✨ Stage 4: Finalizing Your Report
5.  **API Processing**: `/api/analyze` checks Supabase cache (7-day TTL); if missed, calls Gemini AI with enhanced prompt.
6.  **AI Output**: Returns comprehensive JSON with:
    -   Salary range (min/median/max/percentiles)
    -   Verdict (underpaid/fair/overpaid) with ±25% threshold logic
    -   Confidence score and reasoning
    -   Personalized recommendations
    -   **🆕 6 Analytics datasets**: market position, earning projections, skill impacts, location comparisons, industry benchmarks, career timeline
7.  **Dashboard Rendering**: Results page displays:
    -   Large verdict card with emoji and percentage
    -   Interactive Recharts salary visualization
    -   AI reasoning and recommendations
    -   **🆕 Advanced Analytics Section**: 6 cards in responsive grid (1/2/3 columns)
8.  **Caching**: Complete result stored in Supabase for 7 days with smart cache key generation.
9.  **Sharing**: Dynamic OG images with real data for social platform previews.

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

## 🆕 Advanced Analytics Feature

SalaryIQ now provides comprehensive career insights through 6 interactive analytics cards:

### 📊 Market Position Card
- **Percentile Ranking**: See exactly where you stand (e.g., 75th percentile = earning more than 75% of similar professionals)
- **National/Regional Average**: Compare against the broader market
- **City Premium**: Understand location-based salary differences (e.g., +35% in SF vs national average)
- **Visual Representation**: Large percentile display with sage-green themed design

### 📈 Earning Projection Card
- **5-Year Timeline**: See projected salary for current year, year 3, and year 5
- **Growth Rate**: Average annual growth rate based on your role and experience level
- **Visual Timeline**: Clean progression cards showing salary evolution
- **Realistic Projections**: Based on industry data and career level trends

### ⚡ Skill Impact Card
- **High-Value Skills**: Top 3-5 skills that could boost your salary
- **Salary Increase**: Both absolute ($15k) and percentage (+12%) gains
- **Demand Indicators**: Color-coded badges (high/medium/low demand)
- **Learning Roadmap**: Focus on skills with highest ROI

### 🗺️ Location Comparison Card
- **City Analysis**: Compare salaries across 3-4 major tech hubs
- **Percentage Differences**: Clear indicators (+28%, -15%) vs current location
- **Average Salaries**: See what similar roles earn in each city
- **Visual Bars**: Color-coded progress bars (green for higher, red for lower)

### 🏢 Industry Benchmark Card
- **Industry Insights**: Compare across 3-4 relevant industries
- **Growth Trends**: See which industries are rising, stable, or declining
- **Salary Differences**: Understand industry pay variations
- **Strategic Planning**: Identify high-growth sectors for career pivots

### 🎯 Time to Target Card
- **3 Growth Scenarios**:
  - **Average Growth**: Industry-standard progression (5-7% annually)
  - **Aggressive Growth**: Active job changes and negotiations (15-20% annually)
  - **With Skill Upgrades**: Learning high-value skills (20-25% annually)
- **Timeline Visualization**: Years needed to reach median/target salary
- **Fastest Path Highlighted**: See which strategy gets you there quickest
- **Actionable Insights**: Clear comparison of different career strategies

### Technical Implementation
- **AI-Powered**: Gemini generates all analytics based on current market data
- **Type-Safe**: Full TypeScript coverage with 6 new interfaces
- **Responsive Design**: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Conditional Rendering**: Cards only appear when AI provides data
- **Performance**: Cached with main result (7-day TTL)
- **Consistent Patterns**: All cards follow same structure (header, content, footer)

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

### ✅ Completed (Nov 2025)
-   ✅ **Advanced Analytics**: Market position, earning projections, skill impacts, location/industry comparisons, career timelines
-   ✅ **Enhanced UX**: 4-stage loading screen, improved header alignment, modern color system
-   ✅ **Design System**: Tailwind CSS 4 with custom variables, consistent component patterns

### 🚧 In Progress
-   **Community Features**: Salary submissions and aggregated dashboards
-   **Cost-of-Living Adjustments**: Enhanced location comparisons with real CoL data

### 📋 Planned
-   **AI Enhancements**: Negotiation chatbots, interactive career advisors, personalized learning paths
-   **Data Visualization**: Historical salary trends, industry growth charts, skill demand graphs
-   **Export Features**: PDF reports, CSV data exports, shareable analytics links
-   **UX Polish**: Localization (i18n), additional currencies, accessibility improvements
-   **Scalability**: Enhanced monitoring, webhook integrations, API rate limit tiers
-   **Analytics Export**: Allow users to download comprehensive career reports

----------

## Maintainers

-   **Akshad Jaiswal** [](https://github.com/akshadjaiswal)– Initial build and core features.

Feedback via issues/PRs is appreciated! 🚀