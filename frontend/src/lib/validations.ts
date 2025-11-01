import { z } from "zod";

// ============================================
// SALARY FORM VALIDATION SCHEMA
// ============================================

export const salaryFormSchema = z.object({
  jobTitle: z
    .string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-\/\.]+$/,
      "Job title contains invalid characters"
    ),

  yearsExperience: z
    .number({
      required_error: "Years of experience is required",
      invalid_type_error: "Must be a number",
    })
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(50, "Must be 50 years or less"),

  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),

  country: z.string().optional(),

  city: z.string().optional(),

  industry: z
    .string()
    .min(2, "Industry is required")
    .max(50, "Industry must be less than 50 characters"),

  skills: z
    .array(z.string())
    .min(1, "Add at least one skill")
    .max(20, "Maximum 20 skills allowed")
    .refine(
      (skills) => skills.every((s) => s.length >= 2 && s.length <= 50),
      "Each skill must be between 2 and 50 characters"
    ),

  currentSalary: z
    .number()
    .int()
    .positive("Salary must be positive")
    .max(10000000, "Salary seems unrealistic")
    .optional(),

  currency: z.string().length(3, "Invalid currency code").default("USD"),
});

export type SalaryFormValues = z.infer<typeof salaryFormSchema>;

// ============================================
// POPULAR OPTIONS (for dropdowns/autocomplete)
// ============================================

export const POPULAR_INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Marketing",
  "Legal",
  "Real Estate",
  "Government",
  "Non-Profit",
  "Entertainment",
  "Other",
] as const;

export const POPULAR_SKILLS = [
  // Tech
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "React",
  "Node.js",
  "AWS",
  "Docker",
  "Kubernetes",
  "SQL",
  "MongoDB",
  // Business
  "Project Management",
  "Data Analysis",
  "Excel",
  "Salesforce",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Critical Thinking",
] as const;

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
] as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validates and sanitizes form data before submission
 */
export function sanitizeFormData(
  data: SalaryFormValues
): SalaryFormValues {
  return {
    ...data,
    jobTitle: data.jobTitle.trim(),
    location: data.location.trim(),
    industry: data.industry.trim(),
    skills: data.skills.map((s) => s.trim()).filter(Boolean),
  };
}

/**
 * Generates a cache key from form data for deduplication
 */
export function generateCacheKey(data: SalaryFormValues): string {
  const normalized = {
    jobTitle: data.jobTitle.toLowerCase().trim(),
    yearsExperience: data.yearsExperience,
    location: data.location.toLowerCase().trim(),
    industry: data.industry.toLowerCase().trim(),
    skills: data.skills
      .map((s) => s.toLowerCase().trim())
      .sort()
      .join(","),
  };

  return Buffer.from(JSON.stringify(normalized)).toString("base64");
}
