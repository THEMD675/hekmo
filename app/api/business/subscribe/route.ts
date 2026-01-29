import { eq } from "drizzle-orm";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { business } from "@/lib/db/schema";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hekmo.ai";

// Business plan prices (SAR)
const PLANS = {
  starter: {
    name: "Starter",
    price: 499, // SAR/month
    messages: 1000,
    whatsappNumbers: 1,
    priceId: process.env.STRIPE_PRICE_STARTER,
  },
  business: {
    name: "Business",
    price: 1499, // SAR/month
    messages: 10_000,
    whatsappNumbers: 3,
    priceId: process.env.STRIPE_PRICE_BUSINESS,
  },
  enterprise: {
    name: "Enterprise",
    price: -1, // Custom
    messages: -1,
    whatsappNumbers: -1,
    priceId: null,
  },
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!STRIPE_SECRET_KEY) {
    return Response.json(
      {
        error: "Stripe not configured",
        configUrl: "https://dashboard.stripe.com/apikeys",
      },
      { status: 503 }
    );
  }

  try {
    const { planId, businessId } = await request.json();

    if (!planId || !businessId) {
      return Response.json(
        { error: "planId and businessId required" },
        { status: 400 }
      );
    }

    // Verify user owns the business
    const [userBusiness] = await db
      .select()
      .from(business)
      .where(eq(business.id, businessId))
      .limit(1);

    if (!userBusiness || userBusiness.userId !== session.user.id) {
      return Response.json({ error: "Business not found" }, { status: 404 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (planId === "enterprise") {
      // Enterprise requires contact
      return Response.json({
        type: "contact",
        email: "enterprise@hekmo.ai",
        message: "للاشتراك في باقة المؤسسات، يرجى التواصل معنا",
      });
    }

    if (!plan.priceId) {
      return Response.json(
        { error: "Plan price not configured in Stripe" },
        { status: 503 }
      );
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          mode: "subscription",
          "line_items[0][price]": plan.priceId,
          "line_items[0][quantity]": "1",
          success_url: `${APP_URL}/dashboard?subscription=success&plan=${planId}`,
          cancel_url: `${APP_URL}/dashboard?subscription=canceled`,
          customer_email: session.user.email || "",
          "metadata[userId]": session.user.id,
          "metadata[businessId]": businessId,
          "metadata[planId]": planId,
          locale: "ar",
          allow_promotion_codes: "true",
        }),
      }
    );

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      console.error("[Business Subscribe] Stripe error:", error);
      return Response.json({ error: "فشل إنشاء جلسة الدفع" }, { status: 500 });
    }

    const checkoutSession = await stripeResponse.json();

    return Response.json({
      url: checkoutSession.url,
      plan: planId,
    });
  } catch (error) {
    console.error("[Business Subscribe] Error:", error);
    return Response.json({ error: "فشل إنشاء جلسة الدفع" }, { status: 500 });
  }
}

// Get current subscription status
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return Response.json({ error: "businessId required" }, { status: 400 });
  }

  const [userBusiness] = await db
    .select()
    .from(business)
    .where(eq(business.id, businessId))
    .limit(1);

  if (!userBusiness || userBusiness.userId !== session.user.id) {
    return Response.json({ error: "Business not found" }, { status: 404 });
  }

  return Response.json({
    plan: userBusiness.subscriptionPlan,
    status: userBusiness.subscriptionStatus,
    trialEndsAt: userBusiness.trialEndsAt,
    messagesUsed: userBusiness.messagesThisMonth,
    messagesLimit: userBusiness.messagesLimit,
  });
}
