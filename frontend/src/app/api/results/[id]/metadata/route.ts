import { NextRequest, NextResponse } from "next/server";
import { getCachedAnalysis } from "@/lib/supabase";
import type { AnalysisResult } from "@/types";

// ============================================
// RESULT METADATA API ROUTE
// Returns minimal metadata for OG image generation
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing result ID" },
        { status: 400 }
      );
    }

    // Try to get the result from cache using the ID as the cache key
    const cachedResult = await getCachedAnalysis(id);

    if (!cachedResult) {
      return NextResponse.json(
        {
          success: false,
          error: "Result not found or expired",
        },
        { status: 404 }
      );
    }

    const result = cachedResult as AnalysisResult;

    // Return minimal metadata needed for OG image
    return NextResponse.json({
      success: true,
      data: {
        verdict: result.verdict,
        difference: Math.abs(result.difference),
        min: result.salaryRange.min,
        max: result.salaryRange.max,
        currency: result.currency || "USD",
      },
    });
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch result metadata",
      },
      { status: 500 }
    );
  }
}
