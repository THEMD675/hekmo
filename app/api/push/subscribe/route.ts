import { auth } from "@/app/(auth)/auth";

// Push notification subscription storage (use database in production)
const subscriptions = new Map<string, PushSubscriptionJSON>();

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await request.json();

    // Store subscription
    subscriptions.set(session.user.id, subscription);

    return Response.json({
      success: true,
      message: "تم تفعيل الإشعارات بنجاح",
    });
  } catch (error) {
    console.error("Push subscription error:", error);
    return Response.json({ error: "فشل تفعيل الإشعارات" }, { status: 500 });
  }
}

// Get subscription for a user (internal use)
export function getSubscription(userId: string): PushSubscriptionJSON | null {
  return subscriptions.get(userId) || null;
}
