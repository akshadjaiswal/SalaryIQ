import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SalaryFormData, AnalysisResult } from "@/types";

// ============================================
// SALARY STORE - Global State Management
// ============================================

interface SalaryStore {
  // Form data
  formData: SalaryFormData | null;
  setFormData: (data: SalaryFormData) => void;
  clearFormData: () => void;

  // Analysis result
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult) => void;
  clearAnalysisResult: () => void;

  // UI state
  isAnalyzing: boolean;
  setIsAnalyzing: (status: boolean) => void;

  // History (for "analyze another" feature)
  analysisHistory: AnalysisResult[];
  addToHistory: (result: AnalysisResult) => void;
  clearHistory: () => void;

  // Reset all
  reset: () => void;
}

const initialState = {
  formData: null,
  analysisResult: null,
  isAnalyzing: false,
  analysisHistory: [],
};

export const useSalaryStore = create<SalaryStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Form data actions
        setFormData: (data) => set({ formData: data }),
        clearFormData: () => set({ formData: null }),

        // Analysis result actions
        setAnalysisResult: (result) =>
          set((state) => ({
            analysisResult: result,
            analysisHistory: [result, ...state.analysisHistory].slice(0, 10), // Keep last 10
          })),
        clearAnalysisResult: () => set({ analysisResult: null }),

        // UI state actions
        setIsAnalyzing: (status) => set({ isAnalyzing: status }),

        // History actions
        addToHistory: (result) =>
          set((state) => ({
            analysisHistory: [result, ...state.analysisHistory].slice(0, 10),
          })),
        clearHistory: () => set({ analysisHistory: [] }),

        // Reset all state
        reset: () => set(initialState),
      }),
      {
        name: "salary-store",
        // Only persist certain fields, not loading states
        partialize: (state) => ({
          formData: state.formData,
          analysisResult: state.analysisResult,
          analysisHistory: state.analysisHistory,
        }),
      }
    ),
    { name: "SalaryStore" }
  )
);

// ============================================
// SELECTORS (for optimized re-renders)
// ============================================

export const selectFormData = (state: SalaryStore) => state.formData;
export const selectAnalysisResult = (state: SalaryStore) =>
  state.analysisResult;
export const selectIsAnalyzing = (state: SalaryStore) => state.isAnalyzing;
export const selectAnalysisHistory = (state: SalaryStore) =>
  state.analysisHistory;
