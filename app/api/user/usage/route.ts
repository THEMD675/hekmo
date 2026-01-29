import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { business, chat, message } from "@/lib/db/schema";
import { eq, count, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user's business if they have one
    const [userBusiness] = await db
      .select()
      .from(business)
      .where(eq(business.userId, session.user.id))
      .limit(1);

    // Get chat count for user
    const [chatStats] = await db
      .select({ count: count() })
      .from(chat)
      .where(eq(chat.userId, session.user.id));

    // Get message count for user's chats
    const [messageStats] = await db
      .select({ count: count() })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(eq(chat.userId, session.user.id));

    // Determine tier and limits based on subscription
    const tier = userBusiness?.subscriptionPlan || "free";
    const limits: Record<string, { messages: number; tokens: number }> = {
      free: { messages: 50, tokens: 25000 },
      starter: { messages: 1000, tokens: 100000 },
      business: { messages: 10000, tokens: 500000 },
      enterprise: { messages: -1, tokens: -1 }, // Unlimited
    };

    const limit = limits[tier] || limits.free;

    // Calculate period dates (current month)
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const usage = {
      messagesUsed: userBusiness 
        ? (typeof userBusiness.messagesThisMonth === 'number' ? userBusiness.messagesThisMonth : 0)
        : (messageStats?.count || 0),
      messagesLimit: limit.messages,
      tokensUsed: 0, // Would need to track tokens separately
      tokensLimit: limit.tokens,
      chatsCount: chatStats?.count || 0,
      tier,
      subscriptionStatus: userBusiness?.subscriptionStatus || "none",
      trialEndsAt: userBusiness?.trialEndsAt?.toISOString() || null,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
    };

    return Response.json(usage);

  } catch (error) {
    console.error("[Usage API] Error:", error);
    
    // Fallback to basic response
    return Response.json({
      messagesUsed: 0,
      messagesLimit: 50,
      tokensUsed: 0,
      tokensLimit: 25000,
      chatsCount: 0,
      tier: "free",
      subscriptionStatus: "none",
      trialEndsAt: null,
      periodStart: new Date().toISOString(),
      periodEnd: new Date().toISOString(),
    });
  }
}
