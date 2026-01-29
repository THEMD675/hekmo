// Simple in-memory rate limiter for API routes
// For production, use Redis via Vercel KV

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const cache = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.resetAt < now) {
      cache.delete(key);
    }
  }
}, 60000); // Every minute

export interface RateLimitConfig {
  limit: number;        // Max requests
  windowMs: number;     // Time window in ms
  keyPrefix?: string;   // Prefix for the key
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given key
 * @param key - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns RateLimitResult
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const { limit, windowMs, keyPrefix = 'rl' } = config;
  const cacheKey = `${keyPrefix}:${key}`;
  const now = Date.now();

  const entry = cache.get(cacheKey);

  if (!entry || entry.resetAt < now) {
    // Create new entry
    const resetAt = now + windowMs;
    cache.set(cacheKey, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetAt,
    };
  }

  if (entry.count >= limit) {
    // Rate limited
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  // Check common headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback
  return 'unknown';
}

/**
 * Create rate limit response
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'تم تجاوز الحد المسموح من الطلبات',
      errorEn: 'Rate limit exceeded',
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
        'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
      },
    }
  );
}

// Pre-configured rate limiters
export const RateLimits = {
  // Business chat - 60 requests per minute per IP
  businessChat: { limit: 60, windowMs: 60_000, keyPrefix: 'bc' },
  
  // Auth endpoints - 5 requests per minute per IP
  auth: { limit: 5, windowMs: 60_000, keyPrefix: 'auth' },
  
  // General API - 100 requests per minute per IP
  api: { limit: 100, windowMs: 60_000, keyPrefix: 'api' },
  
  // Webhook - 1000 requests per minute per IP
  webhook: { limit: 1000, windowMs: 60_000, keyPrefix: 'wh' },
} as const;
