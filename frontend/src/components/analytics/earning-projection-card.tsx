"use client";

import { Calendar, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { EarningProjection } from "@/types";

interface EarningProjectionCardProps {
  data: EarningProjection;
  currency: string;
}

export function EarningProjectionCard({ data, currency }: EarningProjectionCardProps) {
  const { currentYear, year3, year5, averageAnnualGrowthRate } = data;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-cream-300 dark:border-slate-800 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-terra-100 dark:bg-terra-900/30 rounded-xl flex items-center justify-center">
          <Calendar className="h-6 w-6 text-terra-600 dark:text-terra-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground dark:text-white">5-Year Projection</h3>
          <p className="text-sm text-muted-foreground">Earning potential</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 bg-cream-50 dark:bg-slate-800 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Current</span>
          <span className="text-lg font-bold text-foreground">{formatCurrency(currentYear, currency)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-cream-50 dark:bg-slate-800 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Year 3</span>
          <span className="text-lg font-bold text-terra-600 dark:text-terra-400">{formatCurrency(year3, currency)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-terra-50 dark:bg-terra-900/20 rounded-lg border border-terra-200 dark:border-terra-800">
          <span className="text-sm font-medium text-terra-700 dark:text-terra-300">Year 5</span>
          <span className="text-xl font-black text-terra-600 dark:text-terra-400">{formatCurrency(year5, currency)}</span>
        </div>
      </div>

      {/* Growth Rate */}
      <div className="flex items-center justify-between pt-3 border-t border-cream-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm text-muted-foreground">Avg. Annual Growth</span>
        </div>
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">+{averageAnnualGrowthRate.toFixed(1)}%</span>
      </div>
    </div>
  );
}
