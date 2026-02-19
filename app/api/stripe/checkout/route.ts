import { auth } from "@/app/(auth)/auth";
import {
  checkRateLimit,
  getClientIp,
  RateLimits,
  rateLimitResponse,
} from "@/lib/rate-limiter";
import { createCheckoutSession } from "@/lib/stripe";

const STRIPE_PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY;
const STRIPE_PRICE_PRO_YEARLY = process.env.STRIPE_PRICE_PRO_YEARLY;
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

    const { billingInterval } = await request.json();

    // Get the correct price ID
    const priceId =
      billingInterval === "yearly"
        ? STRIPE_PRICE_PRO_YEARLY
        : STRIPE_PRICE_PRO_MONTHLY;

    if (!priceId) {
      return Response.json({ error: "Price not configured" }, { status: 500 });
    }

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email || "",
      priceId,
      successUrl: `${APP_URL}/settings?success=true`,
      cancelUrl: `${APP_URL}/pricing?canceled=true`,
    });

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "فشل إنشاء جلسة الدفع" }, { status: 500 });
  }
}
