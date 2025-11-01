"use client";

import { use, useEffect, useState } from "react";
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

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise (Next.js 15 requirement)
  const { id } = use(params);

  const router = useRouter();
  const storedResult = useSalaryStore(selectAnalysisResult);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a result in store
    if (storedResult && storedResult.id === id) {
      setResult(storedResult);
      setIsLoading(false);
    } else {
      // No result found, redirect to home
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [storedResult, id, router]);

  if (isLoading) {
    return <LoadingScreen message="Loading your results..." />;
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Results Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Redirecting you to the homepage...
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>

            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              SalaryIQ
            </h1>

            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Analyze Another
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
