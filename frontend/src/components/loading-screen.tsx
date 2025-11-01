"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// ============================================
// LOADING SCREEN COMPONENT
// ============================================

const SALARY_FACTS = [
  "Analyzing salary data from 100,000+ professionals...",
  "Comparing your profile against industry benchmarks...",
  "Evaluating cost of living adjustments...",
  "Calculating experience-level premiums...",
  "Assessing in-demand skills impact...",
  "Processing market trend data...",
  "Consulting AI salary expert...",
  "Almost there! Finalizing your report...",
];

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const [currentFact, setCurrentFact] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Rotate through facts every 3 seconds
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % SALARY_FACTS.length);
    }, 3000);

    // Simulate progress (reach 90% in 25 seconds, leave last 10% for actual completion)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 1;
      });
    }, 280); // 25 seconds to reach 90%

    return () => {
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-md w-full px-6 text-center">
        {/* Animated spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/50 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main message */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          {message || "Analyzing Your Salary"}
        </h2>

        {/* Rotating facts */}
        <p className="text-slate-600 dark:text-slate-400 mb-8 h-6 transition-all duration-500">
          {SALARY_FACTS[currentFact]}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-linear-gradient-to-br from-blue-500 to-purple-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {progress}% Complete
        </p>

        {/* Fun stat */}
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            💡 <strong>Did you know?</strong> The average person changes jobs
            10-15 times in their career
          </p>
        </div>
      </div>
    </div>
  );
}
