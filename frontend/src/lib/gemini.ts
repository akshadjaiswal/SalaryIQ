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

  return `You are an expert salary analyst with access to comprehensive market data for ${currentYear}. Analyze this professional's salary and provide a detailed assessment.

**PROFILE:**
- Job Title: ${data.jobTitle}
- Years of Experience: ${data.yearsExperience}
- Location: ${data.location}
- Industry: ${data.industry}
- Skills: ${skillsList}
${currentSalaryInfo}

**TASK:**
Provide a realistic salary analysis based on current market conditions in ${currentYear}. Consider:
1. Geographic cost of living and local market rates
2. Industry-specific compensation trends
3. Experience level benchmarks
4. In-demand skills premium
5. Company size and type variations

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
  "reasoning": "Brief explanation of salary determination factors",
  "market_insights": "Current market trends affecting this role"
}

**GUIDELINES:**
- Be realistic and data-driven
- Consider ${data.location} cost of living
- Account for ${data.yearsExperience} years experience level
- Factor in high-value skills: ${skillsList}
- Confidence should reflect data certainty (higher for common roles, lower for niche)
- Provide 3-5 actionable recommendations
- Keep reasoning concise (2-3 sentences)
- Market insights should mention ${currentYear} trends

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
          maxOutputTokens: 2048,
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
