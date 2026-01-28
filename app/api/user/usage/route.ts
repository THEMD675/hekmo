import { auth } from "@/app/(auth)/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In production, fetch from database
  // For now, return mock data based on user tier
  const tier = "free"; // Get from user profile

  const limits = {
    free: { messages: 50, tokens: 25000 },
    pro: { messages: 500, tokens: 100000 },
    enterprise: { messages: -1, tokens: -1 }, // Unlimited
  };

  const limit = limits[tier as keyof typeof limits] || limits.free;

  // Mock usage data
  const usage = {
    messagesUsed: Math.floor(Math.random() * (limit.messages * 0.7)),
    messagesLimit: limit.messages,
    tokensUsed: Math.floor(Math.random() * (limit.tokens * 0.6)),
    tokensLimit: limit.tokens,
    toolCalls: Math.floor(Math.random() * 30),
    avgResponseTime: Math.round((Math.random() * 2 + 0.5) * 10) / 10,
    streak: Math.floor(Math.random() * 10) + 1,
    periodStart: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDate() + 1)
    ).toISOString(),
    periodEnd: new Date(
      new Date().setMonth(new Date().getMonth() + 1, 0)
    ).toISOString(),
  };

  return Response.json(usage);
}
