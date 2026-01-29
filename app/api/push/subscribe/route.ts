import { z } from "zod";
import { auth } from "@/app/(auth)/auth";

// Push subscription validation schema
const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

// Push notification subscription storage (use database in production)
const subscriptions = new Map<string, PushSubscriptionJSON>();

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = pushSubscriptionSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          error: "بيانات الاشتراك غير صالحة",
        },
        { status: 400 }
      );
    }

    const subscription = validation.data as PushSubscriptionJSON;

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
