import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user } from "@/lib/db/schema";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    // In production, verify the webhook signature using Stripe SDK:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

    // For now, parse the body directly (NOT SAFE for production)
    const event = JSON.parse(body);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const customerId = session.customer;

        if (userId) {
          // Update user with Stripe customer ID and subscription status
          console.log(`[Stripe] User ${userId} subscribed, customer: ${customerId}`);
          // await db.update(user).set({ stripeCustomerId: customerId, plan: 'pro' }).where(eq(user.id, userId));
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;

        console.log(`[Stripe] Subscription updated for ${customerId}: ${status}`);
        
        // Update user's subscription status
        // const users = await db.select().from(user).where(eq(user.stripeCustomerId, customerId));
        // if (users.length > 0) {
        //   await db.update(user).set({ subscriptionStatus: status }).where(eq(user.id, users[0].id));
        // }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log(`[Stripe] Subscription cancelled for ${customerId}`);
        
        // Downgrade user to free plan
        // await db.update(user).set({ plan: 'free' }).where(eq(user.stripeCustomerId, customerId));
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        console.log(`[Stripe] Payment failed for ${customerId}`);
        
        // Handle failed payment (send email, etc.)
        break;
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
