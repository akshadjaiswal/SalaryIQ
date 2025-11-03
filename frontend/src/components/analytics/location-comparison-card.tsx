"use client";

import { MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { LocationComparison } from "@/types";

interface LocationComparisonCardProps {
  data: LocationComparison[];
  currency: string;
  userLocation: string;
}

export function LocationComparisonCard({ data, currency, userLocation }: LocationComparisonCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-cream-300 dark:border-slate-800 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-sage-100 dark:bg-sage-900/30 rounded-xl flex items-center justify-center">
          <MapPin className="h-6 w-6 text-sage-600 dark:text-sage-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground dark:text-white">Location Insights</h3>
          <p className="text-sm text-muted-foreground">vs {userLocation}</p>
        </div>
      </div>

      {/* Cities List */}
      <div className="space-y-3">
        {data.map((location, index) => (
          <div
            key={index}
            className="p-4 bg-cream-50 dark:bg-slate-800 rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sage-500" />
                <span className="font-semibold text-foreground">{location.city}</span>
              </div>
              <div className="flex items-center gap-1">
                {location.percentageDifference >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-semibold ${
                  location.percentageDifference >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {location.percentageDifference >= 0 ? "+" : ""}{location.percentageDifference.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Salary</span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(location.averageSalary, currency)}
              </span>
            </div>

            {/* Visual bar */}
            <div className="mt-2 w-full h-1 bg-cream-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  location.percentageDifference >= 0
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
                style={{ width: `${Math.min(Math.abs(location.percentageDifference), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
