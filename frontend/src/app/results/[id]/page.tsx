"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResultsDashboard } from "@/components/results-dashboard";
import { LoadingScreen } from "@/components/loading-screen";
import { useSalaryStore, selectAnalysisResult } from "@/stores/salary-store";
import { ArrowLeft, Home } from "lucide-react";
import type { AnalysisResult } from "@/types";

// ============================================
// RESULTS PAGE
// ============================================

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise (Next.js 15 requirement)
  const { id } = use(params);

  const router = useRouter();
  const storedResult = useSalaryStore(selectAnalysisResult);
  const setAnalysisResult = useSalaryStore((state) => state.setAnalysisResult);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateResult() {
      // Prefer client-side store when available
      if (storedResult && storedResult.id === id) {
        if (!isMounted) return;
        setResult(storedResult);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/results/${id}`, {
          method: "GET",
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !payload?.data) {
          const message =
            payload?.error ||
            (response.status === 404
              ? "This salary analysis has expired or was not found."
              : "We couldn't load that salary analysis.");

          if (!isMounted) {
            return;
          }

          console.warn(
            "Shared result missing, showing fallback message:",
            message
          );
          setError(message);
          setIsLoading(false);
          if (!redirectTimer.current) {
            redirectTimer.current = setTimeout(() => {
              router.push("/");
            }, 4000);
          }
          return;
        }

        if (!isMounted) {
          return;
        }

        setAnalysisResult(payload.data as AnalysisResult);
        setResult(payload.data as AnalysisResult);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load shared result:", err);
        if (!isMounted) return;
        const friendlyMessage =
          err instanceof Error && err.message
            ? err.message
            : "This salary analysis is no longer available.";
        // Log the error without rethrowing to avoid unhandled promise rejections
        console.warn("Displaying result fallback message:", friendlyMessage);
        setError(friendlyMessage);
        setIsLoading(false);

        if (!redirectTimer.current) {
          redirectTimer.current = setTimeout(() => {
            router.push("/");
          }, 4000);
        }
      }
    }

    hydrateResult();

    return () => {
      isMounted = false;
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, [storedResult, id, router, setAnalysisResult]);

  if (isLoading) {
    return <LoadingScreen message="Loading your results..." />;
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Results Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error || "Redirecting you to the homepage..."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-cream-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground dark:text-slate-400 hover:text-terra-500 dark:hover:text-slate-50 transition-colors justify-self-start"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium hidden sm:inline">Back to Home</span>
              <span className="font-medium sm:hidden">Back</span>
            </Link>

            <h1 className="text-xl font-bold text-foreground dark:text-slate-50 justify-self-center">
              SalaryIQ
            </h1>

            <Link
              href="/analyze"
              className="px-4 py-2 bg-terra-500 hover:bg-terra-600 text-white rounded-lg font-medium transition-colors text-sm justify-self-end truncate"
            >
              <span className="hidden sm:inline">Analyze Another</span>
              <span className="sm:hidden">Analyze</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Results Content */}
      <main className="container mx-auto px-4 py-12">
        <ResultsDashboard result={result} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2025 SalaryIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
