"use client";

import { SalaryForm } from "@/components/salary-form";
import { LoadingScreen } from "@/components/loading-screen";
import { useSalaryStore, selectIsAnalyzing } from "@/stores/salary-store";
import { TrendingUp, Users, Sparkles, Shield, Zap } from "lucide-react";

// ============================================
// ANALYZE PAGE
// ============================================

export default function AnalyzePage() {
  const isAnalyzing = useSalaryStore(selectIsAnalyzing);

  if (isAnalyzing) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Navigation */}
      <nav className="border-b border-cream-300 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-terra-500" />
              <span className="text-2xl font-black text-foreground">SalaryIQ</span>
            </div>
            <a
              href="/"
              className="text-muted-foreground hover:text-terra-500 font-medium transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 pt-12 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm border border-cream-300">
              <Sparkles className="h-4 w-4 text-terra-500" />
              <span className="text-sm font-medium text-foreground">AI-Powered Analysis</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Salary Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill in your details below to get your personalized salary insights
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-cream-300">
            <SalaryForm />
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-sage-500" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-sage-500" />
              <span>Results in 30 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sage-500" />
              <span>10,000+ Analyses</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
