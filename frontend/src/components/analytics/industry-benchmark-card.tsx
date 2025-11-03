"use client";

import { Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { IndustryBenchmark } from "@/types";

interface IndustryBenchmarkCardProps {
  data: IndustryBenchmark[];
  currency: string;
}

const trendIcons = {
  rising: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
};

const trendColors = {
  rising: "text-green-600 dark:text-green-400",
  stable: "text-amber-600 dark:text-amber-400",
  declining: "text-red-600 dark:text-red-400",
};

const trendBgColors = {
  rising: "bg-green-100 dark:bg-green-900/30",
  stable: "bg-amber-100 dark:bg-amber-900/30",
  declining: "bg-red-100 dark:bg-red-900/30",
};

export function IndustryBenchmarkCard({ data, currency }: IndustryBenchmarkCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-cream-300 dark:border-slate-800 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-terra-100 dark:bg-terra-900/30 rounded-xl flex items-center justify-center">
          <Building2 className="h-6 w-6 text-terra-600 dark:text-terra-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground dark:text-white">Industry Insights</h3>
          <p className="text-sm text-muted-foreground">Top paying sectors</p>
        </div>
      </div>

      {/* Industries List */}
      <div className="space-y-3">
        {data.map((industry, index) => {
          const TrendIcon = trendIcons[industry.growthTrend];

          return (
            <div
              key={index}
              className="p-4 bg-cream-50 dark:bg-slate-800 rounded-xl hover:bg-cream-100 dark:hover:bg-slate-750 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-terra-500" />
                    <span className="font-semibold text-foreground">{industry.industry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${trendBgColors[industry.growthTrend]} ${trendColors[industry.growthTrend]}`}>
                      <TrendIcon className="h-3 w-3" />
                      {industry.growthTrend}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {formatCurrency(industry.averageSalary, currency)}
                  </div>
                  <div className={`text-xs font-semibold ${
                    industry.percentageDifference >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {industry.percentageDifference >= 0 ? "+" : ""}{industry.percentageDifference.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Progress bar showing comparison */}
              <div className="w-full h-1.5 bg-cream-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    industry.percentageDifference >= 0
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                  style={{ width: `${Math.min(Math.abs(industry.percentageDifference), 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Tip */}
      <div className="mt-4 p-3 bg-terra-50 dark:bg-terra-900/10 rounded-lg border border-terra-200 dark:border-terra-800">
        <p className="text-xs text-terra-700 dark:text-terra-300">
          <Building2 className="h-3 w-3 inline mr-1" />
          Consider industries with rising trends for better long-term growth
        </p>
      </div>
    </div>
  );
}
