import { useMutation } from "@tanstack/react-query";
import { useSalaryStore } from "@/stores/salary-store";
import type { SalaryFormData, AnalysisResponse, AnalysisResult } from "@/types";
import { toast } from "sonner";

// ============================================
// SALARY ANALYSIS HOOK
// ============================================

interface AnalyzeOptions {
  onSuccess?: (result: AnalysisResult) => void;
  onError?: (error: Error) => void;
}

export function useSalaryAnalysis(options?: AnalyzeOptions) {
  const { setAnalysisResult, setIsAnalyzing } = useSalaryStore();

  const mutation = useMutation({
    mutationFn: async (formData: SalaryFormData): Promise<AnalysisResult> => {
      // Call the API route
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: "Failed to analyze salary",
        }));
        throw new Error(error.error || "Analysis failed");
      }

      const data: AnalysisResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Analysis failed");
      }

      return data.data;
    },

    onMutate: () => {
      setIsAnalyzing(true);
    },

    onSuccess: (result) => {
      setAnalysisResult(result);
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
      options?.onSuccess?.(result);
    },

    onError: (error: Error) => {
      setIsAnalyzing(false);
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze salary. Please try again.");
      options?.onError?.(error);
    },
  });

  return {
    analyze: mutation.mutate,
    analyzeAsync: mutation.mutateAsync,
    isAnalyzing: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

// ============================================
// STATISTICS HOOK (for homepage)
// ============================================

export function useSalaryStats() {
  // For now, return mock data
  // In production, you'd fetch this from Supabase
  return {
    totalAnalyses: 10247,
    averageSalary: 85000,
    topIndustry: "Technology",
  };
}
