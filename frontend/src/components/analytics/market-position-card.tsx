"use client";

import { TrendingUp, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { MarketPosition } from "@/types";

interface MarketPositionCardProps {
  data: MarketPosition;
  currency: string;
}

export function MarketPositionCard({ data, currency }: MarketPositionCardProps) {
  const { percentile, nationalAverage, cityPremiumPercentage } = data;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-cream-300 dark:border-slate-800 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-sage-100 dark:bg-sage-900/30 rounded-xl flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-sage-600 dark:text-sage-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground dark:text-white">Market Position</h3>
          <p className="text-sm text-muted-foreground">Where you rank</p>
        </div>
      </div>

      {/* Percentile - Main Stat */}
      <div className="mb-4 p-4 bg-sage-50 dark:bg-sage-900/20 rounded-xl border border-sage-200 dark:border-sage-800">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-black text-sage-600 dark:text-sage-400">{percentile}th</span>
          <span className="text-lg font-semibold text-sage-700 dark:text-sage-300">Percentile</span>
        </div>
        <p className="text-sm text-sage-700 dark:text-sage-300">
          You earn more than <strong>{percentile}%</strong> of similar professionals
        </p>
      </div>

      {/* Additional Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-cream-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">National Average</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{formatCurrency(nationalAverage, currency)}</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">City Premium</span>
          <span className={`text-sm font-semibold ${
            cityPremiumPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}>
            {cityPremiumPercentage >= 0 ? "+" : ""}{cityPremiumPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
