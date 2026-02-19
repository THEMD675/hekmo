import { auth } from "@/app/(auth)/auth";
import {
  checkRateLimit,
  getClientIp,
  RateLimits,
  rateLimitResponse,
} from "@/lib/rate-limiter";
import { createPortalSession } from "@/lib/stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hekmo.ai";

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, RateLimits.api);
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit);
    }

    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = await request.json();

    if (!customerId) {
      return Response.json({ error: "Customer ID required" }, { status: 400 });
    }

    const portalSession = await createPortalSession({
      customerId,
      returnUrl: `${APP_URL}/settings`,
    });

    return Response.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);
    return Response.json({ error: "فشل فتح بوابة الفواتير" }, { status: 500 });
  }
}
