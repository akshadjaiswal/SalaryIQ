import { NextRequest, NextResponse } from "next/server";
import { analyzeSalaryWithRetry } from "@/lib/gemini";
import { getCachedAnalysis, cacheAnalysis } from "@/lib/supabase";
import { generateCacheKey, salaryFormSchema } from "@/lib/validations";
import type { AnalysisResponse, AnalysisResult, SalaryFormData } from "@/types";
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

    // Call Gemini AI for analysis
    const aiResponse = await analyzeSalaryWithRetry(validatedData);

    // Calculate difference percentage if current salary provided
    let differencePercentage = aiResponse.difference_percentage;
    if (validatedData.currentSalary) {
      differencePercentage =
        ((validatedData.currentSalary - aiResponse.median_salary) /
          aiResponse.median_salary) *
        100;
    }

    // Determine verdict based on difference
    let verdict = aiResponse.verdict;
    if (!verdict) {
      if (differencePercentage < -10) {
        verdict = "underpaid";
      } else if (differencePercentage > 10) {
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
