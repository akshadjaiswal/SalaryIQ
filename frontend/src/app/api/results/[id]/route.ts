import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

// ============================================
// GET ANALYSIS RESULT BY ID
// ============================================

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("analysis_cache")
      .select("ai_response, expires_at")
      .eq("ai_response->>id", id)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch analysis by id:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch analysis" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: data.ai_response });
  } catch (error) {
    console.error("Unexpected error fetching analysis by id:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load result" },
      { status: 500 }
    );
  }
}
