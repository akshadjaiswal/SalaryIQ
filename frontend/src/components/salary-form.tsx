"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Sparkles } from "lucide-react";
import {
  salaryFormSchema,
  type SalaryFormValues,
  POPULAR_INDUSTRIES,
  POPULAR_SKILLS,
  CURRENCIES,
  sanitizeFormData,
} from "@/lib/validations";
import { useSalaryStore } from "@/stores/salary-store";
import { useSalaryAnalysis } from "@/hooks/use-salary-analysis";
import { cn } from "@/lib/utils";

// ============================================
// SALARY FORM COMPONENT
// ============================================

export function SalaryForm() {
  const router = useRouter();
  const { setFormData } = useSalaryStore();
  const { analyze, isAnalyzing } = useSalaryAnalysis({
    onSuccess: (result) => {
      // Navigate to results page
      router.push(`/results/${result.id}`);
    },
  });

  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SalaryFormValues>({
    resolver: zodResolver(salaryFormSchema),
    mode: "onChange",
    defaultValues: {
      skills: [],
      currency: "USD",
    },
  });

  const skills = watch("skills") || [];

  // Handle form submission
  const onSubmit = (data: SalaryFormValues) => {
    const sanitized = sanitizeFormData(data);
    setFormData(sanitized);
    analyze(sanitized);
  };

  // Handle skill addition
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 20) {
      setValue("skills", [...skills, trimmed], { shouldValidate: true });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  const addPopularSkill = (skill: string) => {
    if (!skills.includes(skill) && skills.length < 20) {
      setValue("skills", [...skills, skill], { shouldValidate: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      aria-label="Salary analysis form"
    >
      {/* Job Title */}
      <div>
        <label
          htmlFor="jobTitle"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Job Title *
        </label>
        <input
          id="jobTitle"
          type="text"
          placeholder="e.g., Senior Software Engineer"
          className={cn(
            "w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            errors.jobTitle
              ? "border-red-500"
              : "border-slate-300 dark:border-slate-600"
          )}
          {...register("jobTitle")}
        />
        {errors.jobTitle && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {errors.jobTitle.message}
          </p>
        )}
      </div>

      {/* Years of Experience */}
      <div>
        <label
          htmlFor="yearsExperience"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Years of Experience *
        </label>
        <input
          id="yearsExperience"
          type="number"
          min="0"
          max="50"
          placeholder="e.g., 5"
          inputMode="numeric"
          className={cn(
            "w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            errors.yearsExperience
              ? "border-red-500"
              : "border-slate-300 dark:border-slate-600"
          )}
          {...register("yearsExperience", { valueAsNumber: true })}
        />
        {errors.yearsExperience && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {errors.yearsExperience.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Location *
        </label>
        <input
          id="location"
          type="text"
          placeholder="e.g., San Francisco, CA or New York City"
          className={cn(
            "w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500",
            errors.location
              ? "border-red-500"
              : "border-slate-300 dark:border-slate-600"
          )}
          {...register("location")}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {errors.location.message}
          </p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Industry *
        </label>
        <select
          id="industry"
          className={cn(
            "w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
            errors.industry
              ? "border-red-500"
              : "border-slate-300 dark:border-slate-600"
          )}
          {...register("industry")}
        >
          <option value="">Select an industry</option>
          {POPULAR_INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {errors.industry.message}
          </p>
        )}
      </div>

      {/* Skills */}
      <div>
        <label
          htmlFor="skillInput"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Skills * (Add at least 1)
        </label>

        {/* Skill input */}
        <div className="flex flex-col gap-2 mb-3 sm:flex-row">
          <input
            id="skillInput"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="e.g., JavaScript, React, AWS"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            aria-label="Add skill"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Popular skills */}
        <div className="mb-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Popular skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.slice(0, 8).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addPopularSkill(skill)}
                disabled={skills.includes(skill)}
                className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-pressed={skills.includes(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Added skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-blue-900 dark:hover:text-blue-100"
                  aria-label={`Remove skill ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {errors.skills && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            {errors.skills.message}
          </p>
        )}
      </div>

      {/* Current Salary (Optional) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="sm:col-span-2">
          <label
            htmlFor="currentSalary"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Current Salary (Optional)
          </label>
          <input
            id="currentSalary"
            type="number"
            min="0"
            placeholder="e.g., 85000"
            inputMode="numeric"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("currentSalary", { valueAsNumber: true })}
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Currency
          </label>
          <select
            id="currency"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("currency")}
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isAnalyzing}
        className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Analyze My Salary
          </>
        )}
      </button>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400">
        Your data is processed securely and never shared with third parties
      </p>
    </form>
  );
}
