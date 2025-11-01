// ============================================
// RATE LIMITER FOR GEMINI API
// ============================================

// Gemini API Free Tier Limits:
// - 15 requests per minute (RPM)
// - 200 requests per day (RPD)
// - 1,000,000 tokens per minute (TPM)

interface RateLimitStore {
  requestsPerMinute: number[];
  requestsPerDay: number[];
  lastCleanup: number;
}

const rateLimitStore: RateLimitStore = {
  requestsPerMinute: [],
  requestsPerDay: [],
  lastCleanup: Date.now(),
};

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Gemini API limits for gemini-2.0-flash (free tier)
const LIMITS = {
  RPM: 15, // Requests per minute
  RPD: 200, // Requests per day
};

/**
 * Clean up old timestamps
 */
function cleanup() {
  const now = Date.now();

  // Clean up every minute
  if (now - rateLimitStore.lastCleanup > MINUTE_MS) {
    rateLimitStore.requestsPerMinute = rateLimitStore.requestsPerMinute.filter(
      (timestamp) => now - timestamp < MINUTE_MS
    );
    rateLimitStore.requestsPerDay = rateLimitStore.requestsPerDay.filter(
      (timestamp) => now - timestamp < DAY_MS
    );
    rateLimitStore.lastCleanup = now;
  }
}

/**
 * Check if request is allowed based on rate limits
 */
export function checkRateLimit(): {
  allowed: boolean;
  error?: string;
  retryAfter?: number;
} {
  cleanup();

  const now = Date.now();

  // Check RPM (requests per minute)
  const requestsInLastMinute = rateLimitStore.requestsPerMinute.filter(
    (timestamp) => now - timestamp < MINUTE_MS
  ).length;

  if (requestsInLastMinute >= LIMITS.RPM) {
    // Find oldest request in the current minute
    const oldestRequest = Math.min(...rateLimitStore.requestsPerMinute);
    const retryAfter = Math.ceil((MINUTE_MS - (now - oldestRequest)) / 1000);

    return {
      allowed: false,
      error: `Rate limit exceeded: ${LIMITS.RPM} requests per minute. Please try again in ${retryAfter} seconds.`,
      retryAfter,
    };
  }

  // Check RPD (requests per day)
  const requestsInLastDay = rateLimitStore.requestsPerDay.filter(
    (timestamp) => now - timestamp < DAY_MS
  ).length;

  if (requestsInLastDay >= LIMITS.RPD) {
    // Find oldest request in the current day
    const oldestRequest = Math.min(...rateLimitStore.requestsPerDay);
    const retryAfter = Math.ceil((DAY_MS - (now - oldestRequest)) / 1000);
    const retryAfterHours = Math.ceil(retryAfter / 3600);

    return {
      allowed: false,
      error: `Daily rate limit exceeded: ${LIMITS.RPD} requests per day. Please try again in ${retryAfterHours} hours.`,
      retryAfter,
    };
  }

  return { allowed: true };
}

/**
 * Record a successful API request
 */
export function recordRequest() {
  const now = Date.now();
  rateLimitStore.requestsPerMinute.push(now);
  rateLimitStore.requestsPerDay.push(now);
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus() {
  cleanup();

  const now = Date.now();

  const requestsInLastMinute = rateLimitStore.requestsPerMinute.filter(
    (timestamp) => now - timestamp < MINUTE_MS
  ).length;

  const requestsInLastDay = rateLimitStore.requestsPerDay.filter(
    (timestamp) => now - timestamp < DAY_MS
  ).length;

  return {
    rpm: {
      used: requestsInLastMinute,
      limit: LIMITS.RPM,
      remaining: LIMITS.RPM - requestsInLastMinute,
    },
    rpd: {
      used: requestsInLastDay,
      limit: LIMITS.RPD,
      remaining: LIMITS.RPD - requestsInLastDay,
    },
  };
}
