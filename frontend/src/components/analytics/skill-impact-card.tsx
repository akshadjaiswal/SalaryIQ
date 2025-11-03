"use client";

import { Zap, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { SkillImpact } from "@/types";

interface SkillImpactCardProps {
  data: SkillImpact[];
  currency: string;
}

const demandColors = {
  high: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

export function SkillImpactCard({ data, currency }: SkillImpactCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-cream-300 dark:border-slate-800 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
          <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground dark:text-white">Skills Impact</h3>
          <p className="text-sm text-muted-foreground">Boost your salary</p>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {data.map((skill, index) => (
          <div
            key={index}
            className="p-4 bg-cream-50 dark:bg-slate-800 rounded-xl hover:bg-cream-100 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{skill.skill}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${demandColors[skill.demand]}`}>
                    {skill.demand}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Market demand</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{formatCurrency(skill.salaryIncrease, currency, true)}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  +{skill.percentageIncrease.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Progress bar showing potential */}
            <div className="w-full h-1.5 bg-cream-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                style={{ width: `${Math.min(skill.percentageIncrease, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Tip */}
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-300">
          <TrendingUp className="h-3 w-3 inline mr-1" />
          Learning these skills could significantly increase your earning potential
        </p>
      </div>
    </div>
  );
}
