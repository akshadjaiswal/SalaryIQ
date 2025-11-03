"use client";

import { useEffect, useState } from "react";
import { Search, BarChart3, Bot, Sparkles } from "lucide-react";

// ============================================
// ENHANCED LOADING SCREEN WITH STAGES
// ============================================

interface LoadingStage {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: [number, number]; // [start%, end%]
}

const LOADING_STAGES: LoadingStage[] = [
  {
    id: 1,
    title: "Analyzing Your Profile",
    description: "Processing your job title, experience, skills, and location...",
    icon: Search,
    progress: [0, 25],
  },
  {
    id: 2,
    title: "Comparing Market Data",
    description: "Accessing salary data from thousands of similar roles...",
    icon: BarChart3,
    progress: [25, 50],
  },
  {
    id: 3,
    title: "AI Processing",
    description: "Our AI is analyzing market trends and benchmarks...",
    icon: Bot,
    progress: [50, 75],
  },
  {
    id: 4,
    title: "Finalizing Your Report",
    description: "Generating personalized insights and recommendations...",
    icon: Sparkles,
    progress: [75, 100],
  },
];

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage progression: ~6 seconds per stage = 24 seconds total
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < LOADING_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 6000);

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Cap at 95% until actual completion
        return prev + 0.5; // Slower, more realistic progress
      });
    }, 100);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const stage = LOADING_STAGES[currentStage];
  const StageIcon = stage.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100 dark:bg-slate-950">
      <div className="max-w-2xl w-full px-6">
        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-cream-300 dark:border-slate-800">
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer pulse ring */}
              <div className="absolute inset-0 bg-terra-500/20 dark:bg-terra-500/30 rounded-full animate-ping" />

              {/* Inner circle with icon */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-terra-500 to-terra-600 rounded-full flex items-center justify-center shadow-lg">
                <StageIcon className="h-12 w-12 text-white animate-pulse" strokeWidth={2.5} />
              </div>

              {/* Secondary pulse */}
              <div className="absolute inset-2 bg-terra-500/10 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Stage Title */}
          <h2 className="text-3xl md:text-4xl font-black text-foreground dark:text-white text-center mb-3">
            {stage.title}
          </h2>

          {/* Stage Description */}
          <p className="text-muted-foreground dark:text-slate-400 text-center mb-8 text-lg">
            {stage.description}
          </p>

          {/* Progress Bar */}
          <div className="relative">
            {/* Background track */}
            <div className="w-full h-3 bg-cream-200 dark:bg-slate-800 rounded-full overflow-hidden">
              {/* Animated progress */}
              <div
                className="h-full bg-gradient-to-r from-terra-500 via-terra-600 to-terra-500 transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>

            {/* Progress percentage */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm font-semibold text-muted-foreground dark:text-slate-400">
                {Math.round(progress)}% Complete
              </span>
              <span className="text-sm font-medium text-terra-500 dark:text-terra-400">
                Stage {currentStage + 1} of {LOADING_STAGES.length}
              </span>
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {LOADING_STAGES.map((s, index) => (
              <div
                key={s.id}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index <= currentStage
                    ? "w-12 bg-terra-500"
                    : "w-8 bg-cream-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Fun Fact */}
          <div className="mt-10 p-5 bg-sage-50 dark:bg-sage-900/20 rounded-xl border border-sage-200 dark:border-sage-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">💡</span>
              <div>
                <p className="font-semibold text-sage-900 dark:text-sage-100 mb-1">Did you know?</p>
                <p className="text-sm text-sage-700 dark:text-sage-300">
                  The average person changes jobs 10-15 times in their career. Knowing your market value helps you negotiate better at each step.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators Below Card */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Secure & Anonymous</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-terra-500 animate-pulse" />
            <span>AI-Powered Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
            <span>Real Market Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
