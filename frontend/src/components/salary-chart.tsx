"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import type { SalaryRange, Verdict } from "@/types";
import { formatCurrency } from "@/lib/utils";

// ============================================
// SALARY CHART COMPONENT
// ============================================

interface SalaryChartProps {
  salaryRange: SalaryRange;
  currentSalary?: number;
  currency?: string;
  verdict: Verdict;
}

export function SalaryChart({
  salaryRange,
  currentSalary,
  currency = "USD",
  verdict,
}: SalaryChartProps) {
  // Prepare chart data
  const chartData = [
    {
      name: "Min",
      value: salaryRange.min,
      label: "Minimum",
    },
    {
      name: "25th",
      value: salaryRange.percentile25 || salaryRange.min * 1.15,
      label: "25th Percentile",
    },
    {
      name: "Median",
      value: salaryRange.median,
      label: "Market Median",
    },
    {
      name: "75th",
      value: salaryRange.percentile75 || salaryRange.max * 0.85,
      label: "75th Percentile",
    },
    {
      name: "Max",
      value: salaryRange.max,
      label: "Maximum",
    },
  ];

  // Color based on verdict - using new theme colors
  const getBarColor = (index: number) => {
    if (index === 2) return "#B85042"; // Terracotta for median
    return "#A7BEAE"; // Sage for others
  };

  return (
    <div className="w-full space-y-4">
      {/* Chart title */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Market Salary Range
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Based on current market data
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-72 sm:h-80 bg-transparent rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 12, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 12 }}
              angle={-30}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value, currency, true)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) => [
                formatCurrency(value, currency),
                "Salary",
              ]}
              labelFormatter={(label) => {
                const item = chartData.find((d) => d.name === label);
                return item?.label || label;
              }}
            />

            {/* Current salary reference line */}
            {currentSalary && (
              <ReferenceLine
                y={currentSalary}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Your Salary: ${formatCurrency(currentSalary, currency, true)}`,
                  position: "top",
                  fill: "#ef4444",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
            )}

            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#B85042]" />
          <span className="text-slate-600 dark:text-slate-400">
            Market Median
          </span>
        </div>
        {currentSalary && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-600 dark:text-slate-400">
              Your Current Salary
            </span>
          </div>
        )}
      </div>

      {/* Salary breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-[#e8ebe9] dark:bg-slate-800 p-4 rounded-lg">
          <p className="text-xs text-[#6b6b6b] dark:text-slate-400">Minimum</p>
          <p className="text-lg font-semibold text-[#2d2d2d] dark:text-slate-50">
            {formatCurrency(salaryRange.min, currency)}
          </p>
        </div>
        <div className="bg-[#fbe8e5] dark:bg-[#5c2620]/30 p-4 rounded-lg">
          <p className="text-xs text-[#B85042] dark:text-[#fbe8e5]">Median</p>
          <p className="text-lg font-semibold text-[#5c2620] dark:text-[#fbe8e5]">
            {formatCurrency(salaryRange.median, currency)}
          </p>
        </div>
        <div className="bg-[#e8ebe9] dark:bg-slate-800 p-4 rounded-lg col-span-2 md:col-span-1">
          <p className="text-xs text-[#6b6b6b] dark:text-slate-400">Maximum</p>
          <p className="text-lg font-semibold text-[#2d2d2d] dark:text-slate-50">
            {formatCurrency(salaryRange.max, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
