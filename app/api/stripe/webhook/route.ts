import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib/db/queries";
import { business } from "@/lib/db/schema";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Plan limits
const PLAN_LIMITS: Record<string, number> = {
  starter: 1000,
  business: 10_000,
  enterprise: -1, // unlimited
};

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    console.warn("[Stripe Webhook] Missing signature or secret");
    // Still process in dev mode
    if (process.env.NODE_ENV === "production") {
      return Response.json({ error: "Missing signature" }, { status: 400 });
    }
  }

  try {
    // Parse the event
    const event = JSON.parse(body);
    console.log(`[Stripe Webhook] Event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const userId = metadata.userId;
        const businessId = metadata.businessId;
        const planId = metadata.planId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        console.log(
          `[Stripe] Checkout completed - userId: ${userId}, businessId: ${businessId}, plan: ${planId}`
        );

        if (businessId && planId) {
          // Update business subscription
          await db
            .update(business)
            .set({
              subscriptionPlan: planId,
              subscriptionStatus: "active",
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              messagesLimit: PLAN_LIMITS[planId] || 1000,
              messagesThisMonth: 0,
              updatedAt: new Date(),
            })
            .where(eq(business.id, businessId));

          console.log(
            `[Stripe] Business ${businessId} subscribed to ${planId}`
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;

        console.log(
          `[Stripe] Subscription updated for ${customerId}: ${status}`
        );

        // Find and update the business
        const [userBusiness] = await db
          .select()
          .from(business)
          .where(eq(business.stripeCustomerId, customerId))
          .limit(1);

        if (userBusiness) {
          const newStatus =
            status === "active"
              ? "active"
              : status === "past_due"
                ? "past_due"
                : status === "canceled"
                  ? "cancelled"
                  : status;

          await db
            .update(business)
            .set({
              subscriptionStatus: newStatus,
              updatedAt: new Date(),
            })
            .where(eq(business.id, userBusiness.id));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log(`[Stripe] Subscription cancelled for ${customerId}`);

        // Downgrade business to free/starter
        const [userBusiness] = await db
          .select()
          .from(business)
          .where(eq(business.stripeCustomerId, customerId))
          .limit(1);

        if (userBusiness) {
          await db
            .update(business)
            .set({
              subscriptionPlan: "starter",
              subscriptionStatus: "cancelled",
              messagesLimit: 1000,
              stripeSubscriptionId: null,
              updatedAt: new Date(),
            })
            .where(eq(business.id, userBusiness.id));
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        console.log(`[Stripe] Payment succeeded for ${customerId}`);

        // Reset monthly message count on successful payment
        const [userBusiness] = await db
          .select()
          .from(business)
          .where(eq(business.stripeCustomerId, customerId))
          .limit(1);

        if (userBusiness) {
          await db
            .update(business)
            .set({
              messagesThisMonth: 0,
              subscriptionStatus: "active",
              updatedAt: new Date(),
            })
            .where(eq(business.id, userBusiness.id));
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        console.log(`[Stripe] Payment failed for ${customerId}`);

        // Mark subscription as past due
        const [userBusiness] = await db
          .select()
          .from(business)
          .where(eq(business.stripeCustomerId, customerId))
          .limit(1);

        if (userBusiness) {
          await db
            .update(business)
            .set({
              subscriptionStatus: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(business.id, userBusiness.id));
        }
        break;
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
