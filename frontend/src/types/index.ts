// ============================================
// SALARY ANALYSIS TYPES
// ============================================

export type Verdict = "underpaid" | "fair" | "overpaid";

export interface SalaryFormData {
  jobTitle: string;
  yearsExperience: number;
  location: string;
  country?: string;
  city?: string;
  industry: string;
  skills: string[];
  currentSalary?: number;
  currency: string; // Always has a value (defaults to "USD")
}

export interface SalaryRange {
  min: number;
  median: number;
  max: number;
  percentile25?: number;
  percentile75?: number;
}

// ============================================
// ANALYTICS TYPES (New Feature)
// ============================================

export interface MarketPosition {
  percentile: number; // 0-100, where user ranks
  nationalAverage: number;
  cityPremiumPercentage: number; // how much higher/lower than national
}

export interface EarningProjection {
  currentYear: number;
  year3: number;
  year5: number;
  averageAnnualGrowthRate: number; // percentage
}

export interface SkillImpact {
  skill: string;
  salaryIncrease: number; // absolute amount
  percentageIncrease: number; // percentage
  demand: "high" | "medium" | "low";
}

export interface LocationComparison {
  city: string;
  averageSalary: number;
  percentageDifference: number; // vs user's current location
  costOfLivingAdjusted?: number;
}

export interface IndustryBenchmark {
  industry: string;
  averageSalary: number;
  percentageDifference: number; // vs user's current industry
  growthTrend: "rising" | "stable" | "declining";
}

export interface TimeToTarget {
  targetSalary: number; // typically the median
  yearsWithAvgGrowth: number;
  yearsWithAggressiveGrowth: number;
  yearsWithSkillUpgrades: number;
  avgGrowthRate: number;
  aggressiveGrowthRate: number;
}

export interface AnalysisResult {
  id: string;
  verdict: Verdict;
  salaryRange: SalaryRange;
  currentSalary?: number;
  difference: number; // percentage difference from median
  differenceAmount?: number; // absolute difference in currency
  confidence: number; // 0-100
  recommendations: string[];
  reasoning?: string;
  marketInsights?: string;
  currency: string;
  createdAt: Date;

  // New Analytics Fields
  marketPosition?: MarketPosition;
  earningProjection?: EarningProjection;
  topSkillImpacts?: SkillImpact[]; // top 3-5 skills
  locationComparisons?: LocationComparison[]; // top 3-4 cities
  industryBenchmarks?: IndustryBenchmark[]; // top 3-4 industries
  timeToTarget?: TimeToTarget;
}

export interface AnalysisRequest {
  formData: SalaryFormData;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  cached?: boolean;
}

// ============================================
// DATABASE TYPES (Supabase)
// ============================================

export interface SalarySubmission {
  id: string;
  job_title: string;
  years_experience: number;
  location: string;
  country?: string;
  city?: string;
  salary_annual: number;
  currency: string;
  skills?: string[];
  industry?: string;
  company_size?: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface AnalysisCache {
  id: string;
  cache_key: string;
  ai_response: AnalysisResult;
  created_at: string;
  expires_at: string;
  ip_address?: string;
  request_fingerprint?: string;
}

// ============================================
// AI API TYPES
// ============================================

export interface GeminiAnalysisResponse {
  min_salary: number;
  median_salary: number;
  max_salary: number;
  percentile_25?: number;
  percentile_75?: number;
  verdict: Verdict;
  difference_percentage: number;
  confidence: number;
  recommendations: string[];
  reasoning?: string;
  market_insights?: string;

  // New Analytics Fields
  market_position?: {
    percentile: number;
    national_average: number;
    city_premium_percentage: number;
  };
  earning_projection?: {
    current_year: number;
    year_3: number;
    year_5: number;
    average_annual_growth_rate: number;
  };
  top_skill_impacts?: Array<{
    skill: string;
    salary_increase: number;
    percentage_increase: number;
    demand: "high" | "medium" | "low";
  }>;
  location_comparisons?: Array<{
    city: string;
    average_salary: number;
    percentage_difference: number;
  }>;
  industry_benchmarks?: Array<{
    industry: string;
    average_salary: number;
    percentage_difference: number;
    growth_trend: "rising" | "stable" | "declining";
  }>;
  time_to_target?: {
    target_salary: number;
    years_with_avg_growth: number;
    years_with_aggressive_growth: number;
    years_with_skill_upgrades: number;
    avg_growth_rate: number;
    aggressive_growth_rate: number;
  };
}

// ============================================
// UI COMPONENT TYPES
// ============================================

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}
