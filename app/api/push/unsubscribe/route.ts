import { auth } from "@/app/(auth)/auth";

// Push notification unsubscription
const subscriptions = new Map<string, unknown>();

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { endpoint } = await request.json();

    // Remove subscription
    subscriptions.delete(session.user.id);

    return Response.json({
      success: true,
      message: "تم إلغاء الإشعارات",
    });
  } catch (error) {
    console.error("Push unsubscription error:", error);
    return Response.json({ error: "فشل إلغاء الإشعارات" }, { status: 500 });
  }
}
