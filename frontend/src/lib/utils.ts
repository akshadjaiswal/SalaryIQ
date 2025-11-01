import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with proper symbol and formatting
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  compact: boolean = false
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...(compact && {
      notation: "compact",
      compactDisplay: "short",
    }),
  });

  return formatter.format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
