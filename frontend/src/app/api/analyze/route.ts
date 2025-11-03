import { NextRequest, NextResponse } from "next/server";
import { analyzeSalaryWithRetry } from "@/lib/gemini";
import { getCachedAnalysis, cacheAnalysis } from "@/lib/supabase";
import { generateCacheKey, salaryFormSchema } from "@/lib/validations";
import { checkRateLimit, recordRequest } from "@/lib/rate-limiter";
import type { AnalysisResponse, AnalysisResult, SalaryFormData, Verdict } from "@/types";
import { randomUUID } from "crypto";

// ============================================
// SALARY ANALYSIS API ROUTE
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { formData } = body;

    // Validate form data
    const validationResult = salaryFormSchema.safeParse(formData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data",
        } as AnalysisResponse,
        { status: 400 }
      );
    }

    const validatedData: SalaryFormData = validationResult.data;

    // Generate cache key
    const cacheKey = generateCacheKey(validatedData);

    // Check cache first
    const cachedResult = await getCachedAnalysis(cacheKey);
    if (cachedResult) {
      console.log("✅ Cache hit for analysis");
      return NextResponse.json({
        success: true,
        data: cachedResult,
        cached: true,
      } as AnalysisResponse);
    }

    console.log("❌ Cache miss, calling Gemini API");

    // Check rate limit before calling API
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      console.error("🚫 Rate limit exceeded");
      return NextResponse.json(
        {
          success: false,
          error: rateLimitCheck.error,
        } as AnalysisResponse,
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitCheck.retryAfter?.toString() || '60',
          },
        }
      );
    }

    // Call Gemini AI for analysis
    const aiResponse = await analyzeSalaryWithRetry(validatedData);

    // Record successful API request for rate limiting
    recordRequest();

    // Calculate difference percentage if current salary provided
    let differencePercentage = aiResponse.difference_percentage;
    if (validatedData.currentSalary) {
      differencePercentage =
        ((validatedData.currentSalary - aiResponse.median_salary) /
          aiResponse.median_salary) *
        100;
    }

    // Determine verdict based on difference with realistic thresholds
    let verdict: Verdict;

    if (validatedData.currentSalary) {
      const salary = validatedData.currentSalary;
      const median = aiResponse.median_salary;

      // Calculate realistic percentiles from the range
      const range = aiResponse.max_salary - aiResponse.min_salary;
      const p25 = aiResponse.min_salary + (range * 0.25);
      const p75 = aiResponse.min_salary + (range * 0.75);

      // Check if salary is within the reasonable market range
      // If within min-max range, consider position relative to median
      if (salary >= aiResponse.min_salary && salary <= aiResponse.max_salary) {
        // Within range - check how far from median
        const percentFromMedian = Math.abs((salary - median) / median) * 100;

        if (percentFromMedian <= 25) {
          verdict = "fair";  // Within ±25% of median is fair
        } else if (salary < median) {
          verdict = "underpaid";  // More than 25% below median
        } else {
          verdict = "overpaid";  // More than 25% above median
        }
      } else if (salary < aiResponse.min_salary) {
        verdict = "underpaid";  // Below minimum
      } else {
        verdict = "overpaid";  // Above maximum
      }
    } else {
      // Fallback to percentage-based logic if no current salary
      if (differencePercentage < -20) {
        verdict = "underpaid";
      } else if (differencePercentage > 20) {
        verdict = "overpaid";
      } else {
        verdict = "fair";
      }
    }

    // Construct analysis result
    const result: AnalysisResult = {
      id: randomUUID(),
      verdict,
      salaryRange: {
        min: aiResponse.min_salary,
        median: aiResponse.median_salary,
        max: aiResponse.max_salary,
        percentile25: aiResponse.percentile_25,
        percentile75: aiResponse.percentile_75,
      },
      currentSalary: validatedData.currentSalary,
      difference: differencePercentage,
      differenceAmount: validatedData.currentSalary
        ? validatedData.currentSalary - aiResponse.median_salary
        : undefined,
      confidence: aiResponse.confidence,
      recommendations: aiResponse.recommendations || [],
      reasoning: aiResponse.reasoning,
      marketInsights: aiResponse.market_insights,
      currency: validatedData.currency || "USD",
      createdAt: new Date(),

      // Transform analytics data from snake_case to camelCase
      marketPosition: aiResponse.market_position ? {
        percentile: aiResponse.market_position.percentile,
        nationalAverage: aiResponse.market_position.national_average,
        cityPremiumPercentage: aiResponse.market_position.city_premium_percentage,
      } : undefined,

      earningProjection: aiResponse.earning_projection ? {
        currentYear: aiResponse.earning_projection.current_year,
        year3: aiResponse.earning_projection.year_3,
        year5: aiResponse.earning_projection.year_5,
        averageAnnualGrowthRate: aiResponse.earning_projection.average_annual_growth_rate,
      } : undefined,

      topSkillImpacts: aiResponse.top_skill_impacts?.map(skill => ({
        skill: skill.skill,
        salaryIncrease: skill.salary_increase,
        percentageIncrease: skill.percentage_increase,
        demand: skill.demand,
      })),

      locationComparisons: aiResponse.location_comparisons?.map(loc => ({
        city: loc.city,
        averageSalary: loc.average_salary,
        percentageDifference: loc.percentage_difference,
      })),

      industryBenchmarks: aiResponse.industry_benchmarks?.map(ind => ({
        industry: ind.industry,
        averageSalary: ind.average_salary,
        percentageDifference: ind.percentage_difference,
        growthTrend: ind.growth_trend,
      })),

      timeToTarget: aiResponse.time_to_target ? {
        targetSalary: aiResponse.time_to_target.target_salary,
        yearsWithAvgGrowth: aiResponse.time_to_target.years_with_avg_growth,
        yearsWithAggressiveGrowth: aiResponse.time_to_target.years_with_aggressive_growth,
        yearsWithSkillUpgrades: aiResponse.time_to_target.years_with_skill_upgrades,
        avgGrowthRate: aiResponse.time_to_target.avg_growth_rate,
        aggressiveGrowthRate: aiResponse.time_to_target.aggressive_growth_rate,
      } : undefined,
    };

    // Cache the result
    await cacheAnalysis(cacheKey, result, 7); // Cache for 7 days

    // Return success response
    return NextResponse.json({
      success: true,
      data: result,
      cached: false,
    } as AnalysisResponse);
  } catch (error) {
    console.error("Analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze salary. Please try again.",
      } as AnalysisResponse,
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
