"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Zap, Sparkles, CheckCircle, Users, Globe } from "lucide-react";

// ============================================
// LANDING PAGE
// ============================================

export default function LandingPage() {
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
            <Link
              href="/analyze"
              className="px-6 py-2.5 bg-terra-500 hover:bg-terra-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-8 shadow-sm border border-cream-300">
            <Sparkles className="h-4 w-4 text-terra-500" />
            <span className="text-sm font-medium text-foreground">AI-Powered Salary Insights</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight">
            Discover Your True
            <br />
            <span className="text-terra-500">Market Value</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Get AI-powered salary analysis in seconds. Know if you're being paid what you're worth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/analyze"
              className="px-8 py-4 bg-terra-500 hover:bg-terra-600 text-white rounded-xl font-bold text-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Analyze My Salary
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="px-8 py-4 bg-white hover:bg-cream-50 text-foreground rounded-xl font-semibold text-lg transition-all duration-200 border-2 border-cream-300 hover:border-sage-500 w-full sm:w-auto">
              See How It Works
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-sage-500" />
              <span className="text-muted-foreground"><strong className="text-foreground">10,000+</strong> Analyses</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-sage-500" />
              <span className="text-muted-foreground"><strong className="text-foreground">100%</strong> Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-sage-500" />
              <span className="text-muted-foreground"><strong className="text-foreground">Under 30s</strong> Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Why Choose SalaryIQ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI and real market data to give you accurate, actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-300 hover:shadow-lg transition-shadow duration-200">
              <div className="w-14 h-14 bg-terra-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-terra-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">AI-Powered Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI considers your experience, skills, location, and market trends for accurate insights
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-300 hover:shadow-lg transition-shadow duration-200">
              <div className="w-14 h-14 bg-sage-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-sage-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Global Market Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access salary data from hundreds of cities worldwide with multi-currency support
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-300 hover:shadow-lg transition-shadow duration-200">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get comprehensive analysis in under 30 seconds. No waiting, no complexity
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-300 hover:shadow-lg transition-shadow duration-200">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">100% Anonymous</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your data is never shared or stored with personal identifiers. Complete privacy guaranteed
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-300 hover:shadow-lg transition-shadow duration-200">
              <div className="w-14 h-14 bg-terra-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-terra-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Detailed Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get salary ranges, percentiles, and personalized recommendations to boost your earning potential
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-cream-300 hover:shadow-lg transition-shadow duration-200">
              <div className="w-14 h-14 bg-sage-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="h-7 w-7 text-sage-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Shareable Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share your results on social media with beautiful, dynamic preview cards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Get your salary analysis in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-terra-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-black text-terra-500">1</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Enter Your Details</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Share your job title, experience, location, skills, and current salary (optional)
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-sage-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI analyzes market data and compares your profile against thousands of data points
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Get Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive detailed analysis with salary ranges, verdict, and actionable recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-terra-500 to-terra-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Know Your Worth?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90">
            Join thousands of professionals who've discovered their true market value
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-terra-500 rounded-xl font-bold text-lg hover:bg-cream-50 transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            Start Your Free Analysis
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-6 text-sm text-white/70">No credit card required • Takes less than 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-cream-300 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-6 w-6 text-terra-500" />
                  <span className="text-xl font-black text-foreground">SalaryIQ</span>
                </div>
                <p className="text-muted-foreground">
                  AI-powered salary insights to help you discover your true market value.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-4">Product</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/analyze" className="hover:text-terra-500 transition-colors">Salary Analysis</Link></li>
                  <li><Link href="#features" className="hover:text-terra-500 transition-colors">Features</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-terra-500 transition-colors">How It Works</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-terra-500 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-terra-500 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-terra-500 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-cream-300 pt-8 text-center text-muted-foreground">
              <p>&copy; 2025 SalaryIQ. All rights reserved.</p>
              <p className="text-sm mt-2">Built with Next.js, Gemini AI, and Supabase</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
