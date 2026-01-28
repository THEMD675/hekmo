import { auth } from "@/app/(auth)/auth";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
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
    const { customerId } = await request.json();

    if (!customerId) {
      return Response.json(
        { error: "Customer ID required" },
        { status: 400 }
      );
    }

    // Create Stripe billing portal session
    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/billing_portal/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          customer: customerId,
          return_url: `${APP_URL}/settings`,
        }),
      }
    );

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      console.error("Stripe portal error:", error);
      return Response.json(
        { error: "فشل فتح بوابة الفواتير" },
        { status: 500 }
      );
    }

    const portalSession = await stripeResponse.json();

    return Response.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);
    return Response.json(
      { error: "فشل فتح بوابة الفواتير" },
      { status: 500 }
    );
  }
}
