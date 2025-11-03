"use client";

import { Target, Clock, Zap, TrendingUp, GraduationCap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { TimeToTarget } from "@/types";

interface TimeToTargetCardProps {
  data: TimeToTarget;
  currency: string;
}

export function TimeToTargetCard({ data, currency }: TimeToTargetCardProps) {
  const {
    targetSalary,
    yearsWithAvgGrowth,
    yearsWithAggressiveGrowth,
    yearsWithSkillUpgrades,
    avgGrowthRate,
    aggressiveGrowthRate,
  } = data;

  const scenarios = [
    {
      title: "Average Growth",
      years: yearsWithAvgGrowth,
      rate: avgGrowthRate,
      icon: Clock,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-100 dark:bg-slate-800",
      description: "Industry standard progression",
    },
    {
      title: "Aggressive Growth",
      years: yearsWithAggressiveGrowth,
      rate: aggressiveGrowthRate,
      icon: Zap,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      description: "Active job changes & negotiations",
    },
    {
      title: "With Skill Upgrades",
      years: yearsWithSkillUpgrades,
      rate: aggressiveGrowthRate * 1.2, // Assuming 20% better
      icon: GraduationCap,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      description: "Learning high-demand skills",
    },
  ];

  // Find the fastest scenario
  const fastestYears = Math.min(yearsWithAvgGrowth, yearsWithAggressiveGrowth, yearsWithSkillUpgrades);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-cream-300 dark:border-slate-800 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-sage-100 dark:bg-sage-900/30 rounded-xl flex items-center justify-center">
          <Target className="h-6 w-6 text-sage-600 dark:text-sage-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground dark:text-white">Time to Target</h3>
          <p className="text-sm text-muted-foreground">Reach {formatCurrency(targetSalary, currency)}</p>
        </div>
      </div>

      {/* Target Salary Card */}
      <div className="mb-4 p-4 bg-sage-50 dark:bg-sage-900/20 rounded-xl border border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-sage-700 dark:text-sage-300 mb-1">Target Salary</p>
            <p className="text-2xl font-black text-sage-600 dark:text-sage-400">
              {formatCurrency(targetSalary, currency)}
            </p>
          </div>
          <Target className="h-8 w-8 text-sage-500" />
        </div>
      </div>

      {/* Scenarios */}
      <div className="space-y-3">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          const isFastest = scenario.years === fastestYears;

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                isFastest
                  ? "bg-gradient-to-br from-sage-50 to-terra-50 dark:from-sage-900/20 dark:to-terra-900/20 border-sage-300 dark:border-sage-700 shadow-sm"
                  : "bg-cream-50 dark:bg-slate-800 border-transparent"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1">
                  <div className={`p-2 rounded-lg ${scenario.bgColor}`}>
                    <Icon className={`h-4 w-4 ${scenario.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{scenario.title}</span>
                      {isFastest && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                          Fastest
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{scenario.description}</p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <div className="text-2xl font-bold text-foreground">
                    {scenario.years}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {scenario.years === 1 ? "year" : "years"}
                    </span>
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    +{scenario.rate.toFixed(1)}% annually
                  </div>
                </div>
              </div>

              {/* Timeline bar */}
              <div className="w-full h-1.5 bg-cream-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isFastest
                      ? "bg-gradient-to-r from-sage-500 to-terra-500"
                      : "bg-gradient-to-r from-slate-400 to-slate-500"
                  }`}
                  style={{
                    width: `${Math.min((scenario.years / Math.max(...scenarios.map(s => s.years))) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Tip */}
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-xs text-green-700 dark:text-green-300">
          <TrendingUp className="h-3 w-3 inline mr-1" />
          Combining aggressive growth with skill upgrades can accelerate your timeline significantly
        </p>
      </div>
    </div>
  );
}
