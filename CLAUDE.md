# SalaryIQ - AI-Powered Salary Analysis Platform

> **Purpose**: This file provides comprehensive context for AI assistants to quickly understand the SalaryIQ codebase without full scanning. Last updated: 2025-11-03

---

## 🎯 Project Overview

**SalaryIQ** is an AI-powered web application that analyzes job market data to determine if users are fairly compensated. It provides salary insights, market comparisons, and personalized recommendations.

### Core Features
- AI-powered salary analysis using Google Gemini
- **NEW**: Advanced analytics (market position, earning projections, skill impacts, location/industry comparisons, career timeline)
- Real-time market data comparison
- Shareable results with dynamic OG images
- Multi-currency support (USD, EUR, GBP, INR, CAD, AUD)
- Smart caching to reduce API costs
- Rate limiting for API protection
- Stage-based loading screen with progress indicators

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15.0.1 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19.2.0 + Tailwind CSS 4
- **State**: Zustand with localStorage persistence
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts (bar charts)
- **Notifications**: Sonner (toast messages)

### Backend
- **Runtime**: Next.js API Routes (Node.js + Edge)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.0 Flash / 1.5 Pro
- **OG Images**: @vercel/og (Edge Runtime)
- **Rate Limiting**: In-memory timestamps with cleanup

### Deployment
- **Platform**: Vercel
- **URL**: https://salaryiq.vercel.app

---

## 📁 Project Structure

```
SalaryIQ/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── page.tsx        # NEW: Landing page with "Get Started"
│   │   │   ├── layout.tsx      # Root layout + metadata
│   │   │   ├── analyze/        # NEW: Dedicated form page
│   │   │   │   └── page.tsx    # Salary analysis form
│   │   │   ├── results/[id]/   # Dynamic results pages
│   │   │   │   ├── page.tsx    # Results display page
│   │   │   │   └── metadata.ts # OG metadata generator
│   │   │   └── api/            # API routes
│   │   │       ├── analyze/route.ts         # Main analysis endpoint
│   │   │       ├── results/[id]/route.ts    # Get cached results
│   │   │       ├── results/[id]/metadata/route.ts  # OG data endpoint
│   │   │       └── og/route.tsx             # OG image generator
│   │   ├── components/         # React components
│   │   │   ├── salary-form.tsx          # Input form
│   │   │   ├── results-dashboard.tsx    # Results display with analytics
│   │   │   ├── salary-chart.tsx         # Recharts visualization
│   │   │   ├── share-buttons.tsx        # Social sharing
│   │   │   ├── loading-screen.tsx       # 4-stage loading with progress
│   │   │   └── analytics/              # NEW: Analytics card components
│   │   │       ├── market-position-card.tsx       # Percentile ranking
│   │   │       ├── earning-projection-card.tsx    # 5-year projections
│   │   │       ├── skill-impact-card.tsx          # Skill salary impacts
│   │   │       ├── location-comparison-card.tsx   # City comparisons
│   │   │       ├── industry-benchmark-card.tsx    # Industry insights
│   │   │       └── time-to-target-card.tsx        # Career timeline
│   │   ├── lib/                # Core utilities
│   │   │   ├── validations.ts   # Zod schemas & helpers
│   │   │   ├── gemini.ts        # AI integration
│   │   │   ├── supabase.ts      # Database & cache
│   │   │   ├── rate-limiter.ts  # API rate limiting
│   │   │   ├── utils.ts         # Helper functions
│   │   │   └── providers.tsx    # React Query setup
│   │   ├── stores/             # Zustand state
│   │   │   └── salary-store.ts  # Global state + history
│   │   ├── hooks/              # Custom hooks
│   │   │   └── use-salary-analysis.ts  # Analysis mutation
│   │   └── types/              # TypeScript definitions
│   │       └── index.ts
│   ├── public/                 # Static assets
│   └── package.json
├── CLAUDE.md                   # This file
└── README.md
```

---

## 🔄 Data Flow

### Analysis Request Flow
```
1. User fills form (salary-form.tsx)
   ↓
2. Client validation (Zod schema)
   ↓
3. POST /api/analyze
   ↓
4. Server validation
   ↓
5. Generate cache key
   ↓
6. Check Supabase cache → HIT? Return cached result
   ↓ MISS
7. Check rate limit → EXCEEDED? Return 429
   ↓ OK
8. Call Gemini AI (with retry + fallback)
   ↓
9. Calculate verdict (±25% threshold)
   ↓
10. Cache result (7 days)
    ↓
11. Return AnalysisResult with unique ID
    ↓
12. Store in Zustand + localStorage
    ↓
13. Navigate to /results/[id]
```

### OG Image Generation Flow
```
1. User shares /results/[id]
   ↓
2. Next.js calls generateMetadata()
   ↓
3. Fetch /api/results/[id]/metadata
   ↓
4. Get minimal data (verdict, diff, min, max, currency)
   ↓
5. Build OG image URL with params
   ↓
6. Social platforms request /api/og?params
   ↓
7. Generate 1200x630 image (Edge Runtime)
   ↓
8. Return PNG with dynamic verdict/salary
```

---

## 🔑 Key Files & Their Roles

### Validation & Data
| File | Purpose |
|------|---------|
| `lib/validations.ts` | Zod schemas, sanitization, cache key generation |
| `types/index.ts` | TypeScript interfaces for all data structures |
| `lib/utils.ts` | Currency formatting, percentage formatting |

### AI & Analysis
| File | Purpose |
|------|---------|
| `lib/gemini.ts` | Gemini client, retry logic, prompt engineering |
| `app/api/analyze/route.ts` | Main analysis endpoint with verdict calculation |
| `lib/rate-limiter.ts` | 15 RPM / 200 RPD rate limiting |

### Database & Caching
| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Supabase client, cache CRUD operations |
| Cache expiry: **7 days** |

### UI Components
| File | Purpose |
|------|---------|
| `components/salary-form.tsx` | Multi-step form with autocomplete |
| `components/results-dashboard.tsx` | Main results display with verdict card + analytics |
| `components/salary-chart.tsx` | Recharts bar chart with percentiles |
| `components/share-buttons.tsx` | Twitter/LinkedIn/Copy sharing |
| `components/loading-screen.tsx` | 4-stage loading (Analyzing → Market Data → AI → Finalize) |
| `components/analytics/market-position-card.tsx` | Shows percentile rank and market position |
| `components/analytics/earning-projection-card.tsx` | 5-year salary projections with growth rates |
| `components/analytics/skill-impact-card.tsx` | Top 3-5 skills that boost salary |
| `components/analytics/location-comparison-card.tsx` | City salary comparisons |
| `components/analytics/industry-benchmark-card.tsx` | Industry insights with growth trends |
| `components/analytics/time-to-target-card.tsx` | Timeline to reach target salary |

### Sharing & SEO
| File | Purpose |
|------|---------|
| `app/results/[id]/metadata.ts` | Dynamic OG metadata generation |
| `app/api/results/[id]/metadata/route.ts` | Fetches minimal result data for OG |
| `app/api/og/route.tsx` | Generates 1200x630 OG images |

### State Management
| File | Purpose |
|------|---------|
| `stores/salary-store.ts` | Zustand store with localStorage |
| Persists: `formData`, `analysisResult`, `analysisHistory` (last 10) |

---

## 🧮 Business Logic

### Validation Rules (validations.ts)
- **Job Title**: 2-100 chars, alphanumeric + spaces/hyphens/dots
- **Experience**: 0-50 years (whole numbers)
- **Industry**: Required, 2-50 chars
- **Skills**: 1-20 items, each 2-50 chars
- **Current Salary**: Optional, positive integer, max 10M
- **Currency**: 3-char code (USD/EUR/GBP/INR/CAD/AUD)

### Verdict Calculation (api/analyze/route.ts)
```
IF currentSalary provided:
  - Within min-max range:
    * ±25% of median → "fair"
    * >25% below median → "underpaid"
    * >25% above median → "overpaid"
  - Below min → "underpaid"
  - Above max → "overpaid"

ELSE (no current salary):
  - difference < -20% → "underpaid"
  - difference > 20% → "overpaid"
  - else → "fair"
```

### Seniority Mapping (lib/gemini.ts)
```
0-2 YOE   → Junior/Entry (lower range)
3-5 YOE   → Mid-level (around median)
6-10 YOE  → Senior (60-80th percentile)
11-15 YOE → Staff/Principal (75-90th percentile)
16+ YOE   → Architect/Distinguished (85-95th percentile)
```

### Currency Benchmarks
**USD (United States)**
- Junior: $50-80k
- Mid: $80-130k
- Senior: $130-200k
- Staff: $180-300k
- Architect: $250-500k+

**INR (India)**
- Junior: ₹4-8L
- Mid: ₹10-18L
- Senior: ₹18-35L
- Staff: ₹30-60L
- Architect: ₹40-80L+

---

## 🌐 API Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/analyze` | POST | Main salary analysis | None |
| `/api/results/[id]` | GET | Get cached result by ID | None |
| `/api/results/[id]/metadata` | GET | Get minimal OG metadata | None |
| `/api/og` | GET | Generate OG image | None |

### Rate Limits
- **Per Minute**: 15 requests
- **Per Day**: 200 requests
- **Retry Header**: `Retry-After` in 429 response

---

## 🎨 Design System

### Color Palette (Updated 2025-11-03)

**IMPORTANT**: All colors are defined as CSS variables in `globals.css` and available as Tailwind utility classes. Never use hardcoded hex values in components - always use the utility classes!

**Primary - Terracotta** (CSS class prefix: `terra-`)
- `terra-50`: `#fbe8e5` - Lightest backgrounds
- `terra-100`: `#f7d1cc` - Light backgrounds
- `terra-500`: `#B85042` - Main brand color (buttons, accents, median highlights)
- `terra-600`: `#a5463a` - Hover state
- `terra-900`: `#5c2620` - Dark accents
- Usage: `bg-terra-500`, `text-terra-600`, `border-terra-200`, etc.

**Secondary - Sage Green** (CSS class prefix: `sage-`)
- `sage-50`: `#e8ebe9` - Lightest backgrounds
- `sage-100`: `#d1d6d3` - Light backgrounds
- `sage-500`: `#A7BEAE` - Secondary accent, "fair" verdict
- `sage-600`: `#8fa69a` - Darker shade
- `sage-900`: `#4d5f56` - Text/dark accents
- Usage: `bg-sage-50`, `text-sage-600`, `border-sage-200`, etc.

**Neutral - Cream** (CSS class prefix: `cream-`)
- `cream-50`: `#faf8f0` - Lightest backgrounds
- `cream-100`: `#E7E8D1` - Main background color
- `cream-200`: `#d4d6b8` - Subtle backgrounds
- `cream-300`: `#c1c39f` - Borders and dividers
- Usage: `bg-cream-100`, `border-cream-300`, etc.

**Standard Tailwind Colors**
- **Text**: `text-foreground` (#2d2d2d), `text-muted-foreground` (#6b6b6b)
- **Backgrounds**: `bg-white`, `bg-slate-50`, `bg-slate-100`, etc.
- **Semantic**: `text-red-600`, `text-green-600`, `text-amber-600` for verdicts

**Semantic Colors (Verdicts)**
- **Underpaid**: Red (`text-red-600`, `bg-red-50`)
- **Fair**: Sage Green (`text-sage-600`, `bg-sage-50`)
- **Overpaid**: Amber (`text-amber-600`, `bg-amber-50`)

### CSS Variable System (Tailwind CSS 4)
Defined in `app/globals.css` using `@theme inline`:
```css
@theme inline {
  --color-terra-50: var(--terra-50);
  --color-terra-100: var(--terra-100);
  --color-terra-500: var(--terra-500);
  --color-terra-600: var(--terra-600);
  --color-terra-900: var(--terra-900);
  // ... same for sage and cream
}
```

**Important Notes**:
- Recharts requires actual hex values (use constants like `TERRA_500 = "#B85042"`)
- All other components must use utility classes: `bg-terra-500` NOT `bg-[#B85042]`
- Dark mode variants: `dark:bg-terra-900/30`, `dark:text-sage-400`

### Typography
- **Font**: Geist Sans (primary), Geist Mono (code)
- **Sizes**: Tailwind scale (text-sm to text-7xl)
- **Weight**: Regular (400), Medium (500), Semibold (600), Bold (700), Black (900)

---

## 🔧 Environment Variables

```env
# Required
GOOGLE_GEMINI_API_KEY=           # Gemini API key
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon key

# Optional
NEXT_PUBLIC_APP_URL=             # Defaults to https://salaryiq.vercel.app
```

---

## 🚀 Common Tasks

### Adding a New Currency
1. Update `CURRENCIES` array in `lib/validations.ts`
2. Add symbol to `currencySymbols` in `app/api/og/route.tsx`
3. Add benchmark data to Gemini prompt in `lib/gemini.ts`
4. Update `formatCurrency()` in `lib/utils.ts` if special formatting needed

### Changing Verdict Thresholds
- Edit lines 96-111 in `app/api/analyze/route.ts`
- Current: ±25% for fair range
- Test with various salary inputs

### Modifying AI Prompt
- Edit `analyzeSalaryWithRetry()` in `lib/gemini.ts`
- Update seniority mapping (lines 45-60)
- Add currency benchmarks (lines 70-90)

### Adjusting Cache Duration
- Default: 7 days
- Change in `app/api/analyze/route.ts` line 148
- `cacheAnalysis(cacheKey, result, 7)` → adjust number

### Updating OG Image Design
- Edit `app/api/og/route.tsx`
- Dimensions: 1200x630 (fixed for social platforms)
- Uses inline styles (no external CSS in Edge Runtime)

---

## 🐛 Troubleshooting

### OG Images Not Updating
- Check `/api/results/[id]/metadata` endpoint is accessible
- Verify Supabase connection
- Clear social platform cache (Twitter Card Validator, LinkedIn Post Inspector)
- Check browser console for metadata fetch errors

### Rate Limit Issues
- Check `lib/rate-limiter.ts` thresholds
- Increase limits if needed (currently 15 RPM, 200 RPD)
- Monitor Gemini API quota usage

### Cache Not Working
- Verify Supabase connection
- Check `analysis_cache` table exists
- Ensure `created_at` column has timestamp
- Review `generateCacheKey()` logic for consistency

### Gemini API Errors
- Check API key is valid
- Verify model availability (fallback: gemini-1.5-pro)
- Review prompt length (max 30K chars)
- Check retry logic in `lib/gemini.ts`

---

## 📊 Database Schema

### `analysis_cache` Table (Supabase)
```sql
CREATE TABLE analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cache_key ON analysis_cache(cache_key);
CREATE INDEX idx_created_at ON analysis_cache(created_at);
```

---

## 🔄 Recent Changes

### 2025-11-03 (Major Enhancement: Advanced Analytics & UI Fixes)

**ADVANCED ANALYTICS FEATURE** - Complete implementation of 6 new analytics cards:
1. **Market Position Card**: Shows user's percentile ranking, national average, city premium
2. **Earning Projection Card**: 5-year salary projections with growth rates
3. **Skill Impact Card**: Top 3-5 skills that would boost salary with demand levels
4. **Location Comparison Card**: Compare salary across 3-4 cities with percentage differences
5. **Industry Benchmark Card**: Compare across industries with growth trends (rising/stable/declining)
6. **Time to Target Card**: Timeline to reach target salary with 3 scenarios (average/aggressive/with skills)

**Analytics Integration**:
- Updated Gemini prompt (`lib/gemini.ts`) to request all analytics data
- Increased maxOutputTokens from 2048 to 4096 for comprehensive responses
- Added analytics field transformation in API route (`app/api/analyze/route.ts`)
- Snake_case to camelCase conversion for all analytics interfaces
- Integrated 6 analytics cards into results dashboard with responsive grid layout
- Analytics section appears conditionally when data is available

**UI/UX IMPROVEMENTS**:
- **Fixed Header Alignment**: Changed from flex to CSS Grid (3 columns) in results page header
  - Back button (justify-self-start), Logo (center), Analyze Another (end)
  - Responsive text: "Back to Home" → "Back" on mobile
- **Loading Screen Redesign**: Complete overhaul with 4-stage system
  - Stage 1: Analyzing Your Profile (Search icon)
  - Stage 2: Comparing Market Data (BarChart3 icon)
  - Stage 3: AI Processing (Bot icon)
  - Stage 4: Finalizing Your Report (Sparkles icon)
  - Features: Progress bar with shimmer, stage indicators, fun facts, trust badges
  - Smooth transitions (6s per stage), terracotta gradient animations

**COLOR SYSTEM OVERHAUL**:
- **Critical Fix**: Replaced ALL hardcoded hex colors with CSS variable utility classes
- Created comprehensive Tailwind CSS 4 color system in `globals.css`
- Added `@theme inline` directive for custom colors (terra-*, sage-*, cream-*)
- Updated files: page.tsx, analyze/page.tsx, results/[id]/page.tsx, results-dashboard.tsx, salary-chart.tsx
- Pattern: `bg-[#B85042]` → `bg-terra-500`, `text-[#6b6b6b]` → `text-muted-foreground`
- Only exception: Recharts requires hex values (defined as constants)

**TYPESCRIPT UPDATES**:
- Added 6 new interfaces to `types/index.ts`:
  - MarketPosition, EarningProjection, SkillImpact
  - LocationComparison, IndustryBenchmark, TimeToTarget
- Updated AnalysisResult interface with optional analytics fields
- Updated GeminiAnalysisResponse with snake_case analytics fields
- Full type safety across analytics pipeline

**FILE STRUCTURE ADDITIONS**:
```
frontend/src/components/analytics/
├── market-position-card.tsx
├── earning-projection-card.tsx
├── skill-impact-card.tsx
├── location-comparison-card.tsx
├── industry-benchmark-card.tsx
└── time-to-target-card.tsx
```

**COMPONENT PATTERNS**:
- All analytics cards follow consistent structure:
  - Header with colored icon (12x12 rounded box)
  - Title + subtitle
  - Main content area
  - Optional footer with tips
- Color themes: Sage (market/location), Terra (industry/projection), Amber (skills), Mixed (timeline)
- Dark mode support throughout
- Hover effects and transitions
- Responsive design (grid: 1 col mobile, 2 col tablet, 3 col desktop)

### 2025-01-03 (Complete Redesign)
- **MAJOR DESIGN OVERHAUL**: New terracotta/sage/cream color theme
  - Replaced blue/purple theme with warm, professional terracotta (#B85042)
  - Added sage green (#A7BEAE) as secondary color
  - Cream background (#E7E8D1) for minimal, clean aesthetic
  - Updated all components with new color scheme

- **NEW LANDING PAGE**: Created dedicated homepage
  - Beautiful hero section with "Get Started" CTA
  - Feature showcase with 6 key benefits
  - How it works section (3 steps)
  - Form moved to `/analyze` route
  - Improved user flow: Landing → Analyze → Results

- **Color Updates Across All Components**:
  - Results dashboard: Sage for "fair" verdict, amber for "overpaid"
  - Salary chart: Terracotta bars for median, sage for percentiles
  - OG images: New color theme for social sharing
  - Results page: Cream background, updated navigation

- **UX IMPROVEMENTS**:
  - Fixed misleading percentage signs (-28.6% for underpaid vs +28.6%)
  - Cleaner, more spacious layouts
  - Better mobile responsiveness
  - Modernized navigation and CTAs

- **Technical Improvements**:
  - Fixed CSS gradient classes
  - Dynamic OG image generation with real data
  - Multi-currency OG image support
  - Created `/api/results/[id]/metadata` endpoint

### 2024-11-02
- Fixed ESLint issues in salary-form.tsx and validations.ts
- Made dashboard mobile-responsive
- Fixed shareable link generation

### 2024-11-01
- Implemented rate limiting (15 RPM, 200 RPD)
- Enhanced Gemini prompt with seniority guidance
- Added INR currency benchmarks
- Refined verdict logic with ±25% threshold

---

## 📝 Notes for AI Assistants

### When Making Changes
1. **Always read this file first** to understand context
2. **Update this file** if you make architectural changes
3. **Test verdict logic** with edge cases (min/max boundaries)
4. **Verify OG images** render correctly on social platforms
5. **Check mobile responsiveness** for UI changes
6. **Update TypeScript types** if modifying data structures

### Performance Considerations
- Cache results aggressively (7-day default is good)
- Use Edge Runtime for OG images (faster cold starts)
- Minimize Gemini API calls (expensive, rate-limited)
- Keep Zustand store lean (only last 10 results in history)

### Security Notes
- Never expose Gemini API key in client-side code
- Validate all user inputs server-side
- Sanitize form data before caching
- Rate limit to prevent abuse

---

**End of Context File**
