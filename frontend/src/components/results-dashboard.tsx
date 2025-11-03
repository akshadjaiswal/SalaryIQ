"use client";

import type { AnalysisResult } from "@/types";
import { SalaryChart } from "./salary-chart";
import { ShareButtons } from "./share-buttons";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  Target,
  Brain,
} from "lucide-react";

// ============================================
// RESULTS DASHBOARD COMPONENT
// ============================================

interface ResultsDashboardProps {
  result: AnalysisResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { verdict, difference, salaryRange, recommendations, reasoning, confidence, currency } = result;

  // Verdict styling
  const verdictConfig = {
    underpaid: {
      icon: TrendingDown,
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-700 dark:text-red-400",
      badge: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
      title: "UNDERPAID",
      emoji: "📉",
    },
    fair: {
      icon: Minus,
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700 dark:text-green-400",
      badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
      title: "FAIRLY PAID",
      emoji: "✅",
    },
    overpaid: {
      icon: TrendingUp,
      bg: "bg-purple-50 dark:bg-purple-950/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-700 dark:text-purple-400",
      badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
      title: "ABOVE MARKET",
      emoji: "🎉",
    },
  };

  const config = verdictConfig[verdict];
  const Icon = config.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Main Verdict Card */}
      <div
        className={`${config.bg} ${config.border} border-2 rounded-2xl p-6 sm:p-8 text-center`}
        role="status"
        aria-live="polite"
      >
        <div className="flex justify-center mb-4">
          <Icon className={`h-16 w-16 ${config.text}`} />
        </div>

        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 ${config.text}`}
        >
          {config.emoji} You're {config.title}
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {formatPercentage(difference)}
        </p>

        <p className="text-slate-600 dark:text-slate-400">
          {verdict === "underpaid" && "below market median"}
          {verdict === "fair" && "within market range"}
          {verdict === "overpaid" && "above market median"}
        </p>

        {/* Market range summary */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Market Salary Range
          </p>
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            {formatCurrency(salaryRange.min, currency)} -{" "}
            {formatCurrency(salaryRange.max, currency)}
          </p>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
            Median: {formatCurrency(salaryRange.median, currency)}
          </p>
        </div>

        {/* Confidence score */}
        <div className="mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            <Target className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {confidence}% Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Salary Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="overflow-x-auto">
          <div className="min-w-[320px]">
            <SalaryChart
              salaryRange={salaryRange}
              currentSalary={result.currentSalary}
              currency={currency}
              verdict={verdict}
            />
          </div>
        </div>
      </div>

      {/* AI Reasoning */}
      {reasoning && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-50 mb-2">
                AI Analysis
              </h3>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                {reasoning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Recommendations
            </h3>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Section */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Share Your Results
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Help others discover their true market value
        </p>
        <ShareButtons result={result} />
      </div>
    </div>
  );
}
