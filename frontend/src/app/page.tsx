"use client";

import { SalaryForm } from "@/components/salary-form";
import { LoadingScreen } from "@/components/loading-screen";
import { useSalaryStore, selectIsAnalyzing } from "@/stores/salary-store";
import { TrendingUp, Users, Sparkles, Shield, Zap, Globe } from "lucide-react";

// ============================================
// HOME PAGE
// ============================================

export default function Home() {
  const isAnalyzing = useSalaryStore(selectIsAnalyzing);

  if (isAnalyzing) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-linear-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="h-10 w-10 text-blue-600" />
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-50">
              SalaryIQ
            </h1>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Are You Being Paid{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
              What You're Worth?
            </span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Get AI-powered salary insights in seconds. Compare your compensation
            against real market data and discover your true earning potential.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong className="font-bold">10,000+</strong> Analyses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong className="font-bold">AI-Powered</strong> Insights
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong className="font-bold">100%</strong> Anonymous
              </span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-800">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Get Your Free Salary Analysis
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Takes less than 2 minutes
              </p>
            </div>

            <SalaryForm />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-slate-50 mb-12">
            How It Works
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  1
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Share Your Details
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Tell us about your role, experience, location, and skills
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                AI Analysis
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI analyzes market data and compares your profile
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Get Insights
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Receive detailed analysis and actionable recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">
              Why SalaryIQ?
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Zap className="h-6 w-6 text-yellow-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Lightning Fast</h4>
                  <p className="text-slate-300">
                    Get comprehensive salary analysis in under 30 seconds
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Globe className="h-6 w-6 text-blue-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Global Coverage</h4>
                  <p className="text-slate-300">
                    Market data from hundreds of cities worldwide
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-green-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">100% Anonymous</h4>
                  <p className="text-slate-300">
                    Your data is never shared or stored with identifiers
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Sparkles className="h-6 w-6 text-purple-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">AI-Powered</h4>
                  <p className="text-slate-300">
                    Advanced AI considers hundreds of factors for accuracy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2025 SalaryIQ. All rights reserved.</p>
          <p className="text-sm mt-2">
            Built with Next.js, Gemini AI, and Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
