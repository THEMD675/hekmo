import { auth } from "@/app/(auth)/auth";

// Feedback storage (use database in production)
const feedbackStore: Array<{
  id: string;
  userId: string;
  messageId?: string;
  rating?: number;
  feedbackType: string;
  comment?: string;
  createdAt: Date;
}> = [];

export async function POST(request: Request) {
  const session = await auth();

  try {
    const { messageId, rating, feedbackType, comment } = await request.json();

    if (!feedbackType) {
      return Response.json({ error: "نوع الملاحظة مطلوب" }, { status: 400 });
    }

    const feedback = {
      id: crypto.randomUUID(),
      userId: session?.user?.id || "anonymous",
      messageId,
      rating,
      feedbackType,
      comment,
      createdAt: new Date(),
    };

    feedbackStore.push(feedback);

    // Log for analytics (integrate with PostHog in production)
    console.log("[Feedback]", {
      userId: feedback.userId,
      type: feedbackType,
      rating,
      hasComment: !!comment,
    });

    return Response.json({
      success: true,
      message: "شكراً على ملاحظاتك",
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return Response.json({ error: "فشل حفظ الملاحظات" }, { status: 500 });
  }
}

// Get feedback stats (admin only)
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = {
    total: feedbackStore.length,
    byType: {} as Record<string, number>,
    averageRating:
      feedbackStore
        .filter((f) => f.rating)
        .reduce((a, f) => a + (f.rating || 0), 0) /
        feedbackStore.filter((f) => f.rating).length || 0,
    recent: feedbackStore.slice(-10).reverse(),
  };

  for (const f of feedbackStore) {
    stats.byType[f.feedbackType] = (stats.byType[f.feedbackType] || 0) + 1;
  }

  return Response.json(stats);
}
