import { auth } from "@/app/(auth)/auth";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY;
const STRIPE_PRICE_PRO_YEARLY = process.env.STRIPE_PRICE_PRO_YEARLY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hekmo.ai";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!STRIPE_SECRET_KEY) {
    return Response.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  try {
    const { priceId, billingInterval } = await request.json();

    // Get the correct price ID
    const stripePriceId =
      billingInterval === "yearly"
        ? STRIPE_PRICE_PRO_YEARLY
        : STRIPE_PRICE_PRO_MONTHLY;

    if (!stripePriceId) {
      return Response.json(
        { error: "Price not configured" },
        { status: 500 }
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
          "line_items[0][price]": stripePriceId,
          "line_items[0][quantity]": "1",
          success_url: `${APP_URL}/settings?success=true`,
          cancel_url: `${APP_URL}/pricing?canceled=true`,
          customer_email: session.user.email || "",
          "metadata[userId]": session.user.id,
          locale: "ar",
          allow_promotion_codes: "true",
        }),
      }
    );

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      console.error("Stripe error:", error);
      return Response.json(
        { error: "فشل إنشاء جلسة الدفع" },
        { status: 500 }
      );
    }

    const checkoutSession = await stripeResponse.json();

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json(
      { error: "فشل إنشاء جلسة الدفع" },
      { status: 500 }
    );
  }
}
