import type { SalaryFormData, GeminiAnalysisResponse, Verdict } from "@/types";

// ============================================
// GEMINI AI CLIENT
// ============================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Model IDs to try (in order of preference)
const GEMINI_MODELS = [
  "gemini-2.0-flash-exp",      // Fastest, experimental (try first)
  "gemini-1.5-pro",            // Stable, production-ready (fallback)
  "gemini-1.5-flash",          // Alternative fallback
] as const;

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set");
}

/**
 * Constructs the AI prompt from user form data
 */
function buildPrompt(data: SalaryFormData): string {
  const currentYear = new Date().getFullYear();
  const skillsList = data.skills.join(", ");
  const currentSalaryInfo = data.currentSalary
    ? `Their current salary is ${data.currency || "USD"} ${data.currentSalary.toLocaleString()}.`
    : "";

  // Determine seniority level based on experience
  let seniorityLevel = "Junior";
  let seniorityGuidance = "";

  if (data.yearsExperience >= 0 && data.yearsExperience <= 2) {
    seniorityLevel = "Junior/Entry-level";
    seniorityGuidance = "Entry-level salaries, typically at lower end of market range";
  } else if (data.yearsExperience >= 3 && data.yearsExperience <= 5) {
    seniorityLevel = "Mid-level";
    seniorityGuidance = "Mid-career salaries, typically around median";
  } else if (data.yearsExperience >= 6 && data.yearsExperience <= 10) {
    seniorityLevel = "Senior";
    seniorityGuidance = "Senior-level salaries, typically above median (60th-80th percentile)";
  } else if (data.yearsExperience >= 11 && data.yearsExperience <= 15) {
    seniorityLevel = "Staff/Principal";
    seniorityGuidance = "Staff/Principal-level salaries, typically in 75th-90th percentile";
  } else {
    seniorityLevel = "Distinguished/Architect";
    seniorityGuidance = "Architect/Distinguished-level salaries, typically in 85th-95th percentile or higher";
  }

  // Detect if location is in India (common Indian cities or country mention)
  const isIndianLocation = /india|bangalore|bengaluru|mumbai|delhi|hyderabad|pune|chennai|kolkata|ahmedabad|gurgaon|noida/i.test(data.location);

  // Currency-specific guidance
  const currencyGuidance = data.currency === "INR" || isIndianLocation
    ? `
**IMPORTANT SALARY BENCHMARKS FOR INDIA (Annual, in Lakhs ₹):**
- Junior/Entry (0-2 YOE): ₹4-8 Lakhs (₹400,000 - ₹800,000)
- Mid-level (3-5 YOE): ₹10-18 Lakhs (₹1,000,000 - ₹1,800,000)
- Senior (6-10 YOE): ₹18-35 Lakhs (₹1,800,000 - ₹3,500,000)
- Staff/Principal (11-15 YOE): ₹30-60 Lakhs (₹3,000,000 - ₹6,000,000)
- Architect/Distinguished (16+ YOE): ₹40-80+ Lakhs (₹4,000,000 - ₹8,000,000+)

**MULTIPLIERS FOR INDIA:**
- Tier-1 cities (Bangalore, Mumbai, Delhi NCR): +30-50% above base
- High-value tech skills (Cloud, AI/ML, System Design, Leadership): +20-40%
- Startup/Tech industry: +20-30% compared to traditional sectors
- For ${data.yearsExperience} years experience, this is ${seniorityLevel} level.
`
    : `
**SALARY BENCHMARKS (USD, Annual):**
- Junior/Entry (0-2 YOE): $50k-$80k
- Mid-level (3-5 YOE): $80k-$130k
- Senior (6-10 YOE): $130k-$200k
- Staff/Principal (11-15 YOE): $180k-$300k
- Architect/Distinguished (16+ YOE): $250k-$500k+

**MULTIPLIERS:**
- High cost areas (SF, NYC, Seattle): +40-60%
- High-value skills: +20-30%
- Tech/FAANG companies: +30-50%
- For ${data.yearsExperience} years experience, this is ${seniorityLevel} level.
`;

  return `You are an expert salary analyst with access to comprehensive market data for ${currentYear}. Analyze this professional's salary and provide a detailed assessment.

**PROFILE:**
- Job Title: ${data.jobTitle}
- Years of Experience: ${data.yearsExperience} (${seniorityLevel})
- Location: ${data.location}
- Industry: ${data.industry}
- Skills: ${skillsList}
${currentSalaryInfo}

**CRITICAL INSTRUCTIONS:**
${currencyGuidance}

**SENIORITY CONTEXT:**
${seniorityGuidance}. With ${data.yearsExperience} years of experience, this person is at ${seniorityLevel} level and their salary MUST reflect this seniority.

**VALIDATION RULES - YOUR PREDICTIONS MUST SATISFY THESE:**
${data.currency === "INR" || isIndianLocation
  ? `- If YOE >= 10: min_salary MUST be >= ₹1,500,000 (₹15 Lakhs)
- If YOE >= 15: min_salary MUST be >= ₹2,500,000 (₹25 Lakhs)
- If YOE >= 15 and role contains "Architect" or "Principal": min_salary MUST be >= ₹3,500,000 (₹35 Lakhs)
- Median should be 50-80% higher than min_salary (not just 20-30%)
- Max salary should be 2-2.5x the min_salary for realistic range`
  : `- If YOE >= 10: min_salary MUST be >= $120,000
- If YOE >= 15: min_salary MUST be >= $200,000
- If YOE >= 15 and role contains "Architect" or "Principal": min_salary MUST be >= $250,000
- Median should be 50-80% higher than min_salary
- Max salary should be 2-2.5x the min_salary for realistic range`}

**TASK:**
Provide a comprehensive salary analysis based on current market conditions in ${currentYear}. Consider:
1. Geographic cost of living and local market rates
2. Industry-specific compensation trends
3. **CRITICAL**: Experience level (${seniorityLevel} for ${data.yearsExperience} YOE) - this is the PRIMARY factor
4. In-demand skills premium
5. Company size and type variations
6. **NEW**: Provide advanced analytics including market position, projections, skill impacts, location comparisons, industry benchmarks, and career timeline

**OUTPUT FORMAT (JSON only, no markdown):**
{
  "min_salary": <number>,
  "median_salary": <number>,
  "max_salary": <number>,
  "percentile_25": <number>,
  "percentile_75": <number>,
  "verdict": "<underpaid|fair|overpaid>",
  "difference_percentage": <number, positive if overpaid, negative if underpaid>,
  "confidence": <number 0-100>,
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ],
  "reasoning": "Brief explanation emphasizing the ${seniorityLevel} level and key salary factors",
  "market_insights": "Current market trends affecting ${seniorityLevel} professionals in this role",

  "market_position": {
    "percentile": <number 0-100, where user ranks compared to similar professionals>,
    "national_average": <number, national/regional average salary for this role>,
    "city_premium_percentage": <number, how much higher/lower than national average, can be negative>
  },

  "earning_projection": {
    "current_year": <number, their current or estimated salary>,
    "year_3": <number, projected salary in 3 years with average growth>,
    "year_5": <number, projected salary in 5 years with average growth>,
    "average_annual_growth_rate": <number, typical annual growth rate percentage for this role>
  },

  "top_skill_impacts": [
    {
      "skill": "<high-value skill name not currently listed>",
      "salary_increase": <number, absolute salary increase potential>,
      "percentage_increase": <number, percentage increase potential>,
      "demand": "<high|medium|low>"
    }
    // Include 3-5 skills that would significantly boost salary
  ],

  "location_comparisons": [
    {
      "city": "<city name>",
      "average_salary": <number, average salary in that city>,
      "percentage_difference": <number, vs user's current location, can be negative>
    }
    // Include 3-4 comparable or higher-paying cities
  ],

  "industry_benchmarks": [
    {
      "industry": "<industry name>",
      "average_salary": <number, average salary in that industry for this role>,
      "percentage_difference": <number, vs user's current industry, can be negative>,
      "growth_trend": "<rising|stable|declining>"
    }
    // Include 3-4 industries (including theirs and alternatives)
  ],

  "time_to_target": {
    "target_salary": <number, typically the median_salary>,
    "years_with_avg_growth": <number, years to reach target with average growth>,
    "years_with_aggressive_growth": <number, years with job changes and negotiations>,
    "years_with_skill_upgrades": <number, years if they learn high-value skills>,
    "avg_growth_rate": <number, average annual growth percentage>,
    "aggressive_growth_rate": <number, aggressive growth percentage (15-25%)>
  }
}

**FINAL CHECKLIST BEFORE RESPONDING:**
✓ Does min_salary reflect ${seniorityLevel} level (${data.yearsExperience} YOE)?
✓ Is the salary range realistic for ${data.location}?
✓ Does median fall appropriately within the range (not too close to min)?
✓ Do percentile_25 and percentile_75 make sense within min-max range?
✓ Are recommendations specific to ${seniorityLevel} career advancement?
✓ Are all analytics fields populated (market_position, earning_projection, top_skill_impacts, location_comparisons, industry_benchmarks, time_to_target)?
✓ Do skill impacts represent skills NOT already in their profile?
✓ Are location comparisons realistic for similar roles?
✓ Are earning projections based on realistic growth rates for ${seniorityLevel}?

Return ONLY the JSON object, no additional text or markdown formatting.`;
}

/**
 * Calls Gemini API to analyze salary data with model fallback
 */
async function callGeminiAPI(
  modelId: string,
  prompt: string
): Promise<any> {
  const url = `${GEMINI_API_BASE}/${modelId}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096, // Increased for analytics data
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model ${modelId} failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Main function to analyze salary with automatic model fallback
 */
export async function analyzeSalary(
  data: SalaryFormData
): Promise<GeminiAnalysisResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const prompt = buildPrompt(data);
  let lastError: Error | null = null;

  // Try each model in order
  for (const modelId of GEMINI_MODELS) {
    try {
      console.log(`🔄 Trying Gemini model: ${modelId}`);
      const result = await callGeminiAPI(modelId, prompt);

      // Extract text from Gemini response
      const textContent =
        result.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!textContent) {
        throw new Error("Empty response from Gemini");
      }

      // Clean up response (remove markdown code blocks if present)
      let cleanedText = textContent.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/```$/, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "").replace(/```$/, "");
      }

      // Parse JSON response
      const analysisData: GeminiAnalysisResponse = JSON.parse(cleanedText);

      // Validate response structure
      if (
        !analysisData.min_salary ||
        !analysisData.median_salary ||
        !analysisData.max_salary ||
        !analysisData.verdict
      ) {
        throw new Error("Invalid response structure from Gemini");
      }

      // Validate verdict
      if (!["underpaid", "fair", "overpaid"].includes(analysisData.verdict)) {
        analysisData.verdict = "fair" as Verdict;
      }

      // Ensure confidence is between 0-100
      analysisData.confidence = Math.max(
        0,
        Math.min(100, analysisData.confidence || 75)
      );

      console.log(`✅ Successfully used model: ${modelId}`);
      return analysisData;

    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Model ${modelId} failed:`, error);
      // Continue to next model
      continue;
    }
  }

  // All models failed
  console.error("All Gemini models failed:", lastError);

  if (lastError instanceof SyntaxError) {
    throw new Error("Failed to parse AI response. Please try again.");
  }

  throw lastError || new Error("All Gemini models failed. Please try again later.");
}

/**
 * Retry wrapper for API calls with exponential backoff
 */
export async function analyzeSalaryWithRetry(
  data: SalaryFormData,
  maxRetries: number = 3
): Promise<GeminiAnalysisResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await analyzeSalary(data);
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      // Don't retry on certain errors
      if (
        error instanceof Error &&
        error.message.includes("API key not configured")
      ) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Analysis failed after multiple retries");
}
