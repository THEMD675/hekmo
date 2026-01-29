// Stripe configuration for Hekmo
// Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Price IDs (set these in Stripe Dashboard)
export const PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly",
  PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY || "price_pro_yearly",
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE || "price_enterprise",
};

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "مجاني",
    nameEn: "Free",
    price: 0,
    messagesPerDay: 100,
    features: [
      "100 رسالة يومياً",
      "النموذج الأساسي",
      "أدوات محدودة",
      "دعم عبر البريد",
    ],
    featuresEn: [
      "100 messages/day",
      "Basic model",
      "Limited tools",
      "Email support",
    ],
  },
  pro: {
    name: "احترافي",
    nameEn: "Pro",
    price: 49, // SAR
    messagesPerDay: -1, // Unlimited
    features: [
      "رسائل غير محدودة",
      "جميع النماذج",
      "جميع الأدوات",
      "أولوية الرد",
      "تصدير المحادثات",
      "دعم متميز",
    ],
    featuresEn: [
      "Unlimited messages",
      "All models",
      "All tools",
      "Priority response",
      "Export chats",
      "Premium support",
    ],
  },
  enterprise: {
    name: "مؤسسات",
    nameEn: "Enterprise",
    price: -1, // Custom
    messagesPerDay: -1,
    features: [
      "كل مميزات الاحترافي",
      "API مخصص",
      "تكامل مخصص",
      "SLA مضمون",
      "مدير حساب مخصص",
      "تدريب الفريق",
    ],
    featuresEn: [
      "All Pro features",
      "Custom API",
      "Custom integrations",
      "Guaranteed SLA",
      "Dedicated account manager",
      "Team training",
    ],
  },
};

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// Create Stripe checkout session
export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ id: string; url: string }> {
  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe not configured");
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      "metadata[userId]": userId,
      locale: "ar",
      allow_promotion_codes: "true",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stripe error: ${error}`);
  }

  const session = await response.json();
  return { id: session.id, url: session.url };
}

// Create Stripe customer portal session
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe not configured");
  }

  const response = await fetch(
    "https://api.stripe.com/v1/billing_portal/sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        customer: customerId,
        return_url: returnUrl,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stripe portal error: ${error}`);
  }

  const session = await response.json();
  return { url: session.url };
}

// Get subscription tier by user ID
export async function getUserSubscriptionTier(
  userId: string
): Promise<SubscriptionTier> {
  try {
    // Check if user has a business with an active subscription
    const { db } = await import("@/lib/db/queries");
    const { business } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const [userBusiness] = await db
      .select()
      .from(business)
      .where(eq(business.userId, userId))
      .limit(1);

    if (!userBusiness) {
      return "free";
    }

    // Map business subscription to user tier
    if (userBusiness.subscriptionStatus === "active") {
      if (userBusiness.subscriptionPlan === "enterprise") {
        return "enterprise";
      }
      if (
        userBusiness.subscriptionPlan === "business" ||
        userBusiness.subscriptionPlan === "starter"
      ) {
        return "pro";
      }
    }

    // Trial users get pro features
    if (userBusiness.subscriptionStatus === "trial") {
      return "pro";
    }

    return "free";
  } catch (error) {
    console.error("[Stripe] Failed to get subscription tier:", error);
    return "free";
  }
}

// Check if user has access to a feature
export function hasFeatureAccess(
  tier: SubscriptionTier,
  feature: string
): boolean {
  // Map features to tiers
  const featureAccess: Record<string, SubscriptionTier[]> = {
    unlimited_messages: ["pro", "enterprise"],
    all_models: ["pro", "enterprise"],
    all_tools: ["pro", "enterprise"],
    export: ["pro", "enterprise"],
    api_access: ["enterprise"],
  };

  const allowedTiers = featureAccess[feature];
  return allowedTiers ? allowedTiers.includes(tier) : true;
}
