import { auth } from "@/app/(auth)/auth";

// Simple in-memory rate limit store (use Redis in production)
const rateLimits = new Map<
  string,
  { count: number; resetTime: number }
>();

const LIMITS = {
  free: { requests: 50, windowMs: 24 * 60 * 60 * 1000 }, // 50 per day
  pro: { requests: 500, windowMs: 24 * 60 * 60 * 1000 }, // 500 per day
  enterprise: { requests: -1, windowMs: 0 }, // Unlimited
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const tier = "free"; // Get from user profile

  const limit = LIMITS[tier as keyof typeof LIMITS] || LIMITS.free;

  // Check if unlimited
  if (limit.requests === -1) {
    return Response.json({
      remaining: -1,
      limit: -1,
      reset: 0,
      unlimited: true,
    });
  }

  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  // Initialize or reset if window expired
  if (!userLimit || userLimit.resetTime < now) {
    const resetTime = now + limit.windowMs;
    rateLimits.set(userId, { count: 0, resetTime });
    return Response.json({
      remaining: limit.requests,
      limit: limit.requests,
      reset: Math.floor(resetTime / 1000),
    });
  }

  const remaining = Math.max(0, limit.requests - userLimit.count);

  return Response.json({
    remaining,
    limit: limit.requests,
    reset: Math.floor(userLimit.resetTime / 1000),
  });
}

// Increment rate limit count (called after each request)
export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const tier = "free";

  const limit = LIMITS[tier as keyof typeof LIMITS] || LIMITS.free;

  if (limit.requests === -1) {
    return Response.json({ success: true });
  }

  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit || userLimit.resetTime < now) {
    rateLimits.set(userId, {
      count: 1,
      resetTime: now + limit.windowMs,
    });
  } else {
    userLimit.count += 1;
  }

  return Response.json({ success: true });
}

// Check if rate limited (middleware helper)
export function isRateLimited(userId: string, tier = "free"): boolean {
  const limit = LIMITS[tier as keyof typeof LIMITS] || LIMITS.free;

  if (limit.requests === -1) return false;

  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit || userLimit.resetTime < now) {
    return false;
  }

  return userLimit.count >= limit.requests;
}
