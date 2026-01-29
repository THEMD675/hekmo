import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { auth } from "@/app/(auth)/auth";
import { chat, message } from "@/lib/db/schema";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all user's chats
    const userChats = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, session.user.id))
      .orderBy(desc(chat.createdAt));

    // Get messages for each chat
    const chatsWithMessages = await Promise.all(
      userChats.map(async (c) => {
        const messages = await db
          .select()
          .from(message)
          .where(eq(message.chatId, c.id))
          .orderBy(message.createdAt);

        return {
          id: c.id,
          title: c.title,
          createdAt: c.createdAt,
          visibility: c.visibility,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.parts,
            createdAt: m.createdAt,
          })),
        };
      })
    );

    const exportData = {
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      exportedAt: new Date().toISOString(),
      totalChats: chatsWithMessages.length,
      chats: chatsWithMessages,
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="hekmo-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("User export error:", error);
    return Response.json({ error: "Export failed" }, { status: 500 });
  }
}
