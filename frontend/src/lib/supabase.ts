import { createClient } from "@supabase/supabase-js";
import type { AnalysisCache, AnalysisResult } from "@/types";

// ============================================
// SUPABASE CLIENT SETUP
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client (for API routes)
export const getServerSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    // Fallback to anon key if service role not available
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// ============================================
// CACHE OPERATIONS
// ============================================

/**
 * Check if a cached analysis exists for the given cache key
 */
export async function getCachedAnalysis(
  cacheKey: string
): Promise<AnalysisResult | null> {
  try {
    const { data, error } = await supabase
      .from("analysis_cache")
      .select("*")
      .eq("cache_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error || !data) {
      return null;
    }

    return data.ai_response as AnalysisResult;
  } catch {
    return null;
  }
}

/**
 * Store analysis result in cache
 */
export async function cacheAnalysis(
  cacheKey: string,
  result: AnalysisResult,
  expiryDays: number = 7
): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const { error } = await supabase.from("analysis_cache").upsert(
      {
        cache_key: cacheKey,
        ai_response: result,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "cache_key",
      }
    );

    if (error) {
      console.error("Failed to cache analysis:", error);
    }
  } catch (error) {
    console.error("Cache error:", error);
  }
}

/**
 * Get total number of analyses performed (for homepage stats)
 */
export async function getTotalAnalysesCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("analysis_cache")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Failed to get count:", error);
      return 0;
    }

    return count || 0;
  } catch {
    return 0;
  }
}

/**
 * Clean up expired cache entries (can be called via cron job)
 */
export async function cleanExpiredCache(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("analysis_cache")
      .delete()
      .lt("expires_at", new Date().toISOString())
      .select();

    if (error) {
      console.error("Failed to clean cache:", error);
      return 0;
    }

    return data?.length || 0;
  } catch {
    return 0;
  }
}
