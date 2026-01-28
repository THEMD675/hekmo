import { auth } from "@/app/(auth)/auth";
import { getChatsByUserId } from "@/lib/db/queries";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const chats = await getChatsByUserId({
      id: session.user.id,
      limit,
      startingAfter: null,
      endingBefore: null,
    });

    return Response.json({
      chats: chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        updatedAt: chat.createdAt,
        model: "gpt-4o-mini",
      })),
      total: chats.length,
      hasMore: chats.length === limit,
    });
  } catch (error) {
    console.error("Chat history error:", error);
    return Response.json(
      { error: "فشل تحميل المحادثات" },
      { status: 500 }
    );
  }
}
