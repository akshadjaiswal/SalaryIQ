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
  currency?: string;
}

export interface SalaryRange {
  min: number;
  median: number;
  max: number;
  percentile25?: number;
  percentile75?: number;
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
