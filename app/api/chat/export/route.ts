import { auth } from "@/app/(auth)/auth";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("id");
  const format = searchParams.get("format") || "json";

  if (!chatId) {
    return Response.json({ error: "Chat ID required" }, { status: 400 });
  }

  try {
    const chat = await getChatById({ id: chatId });

    if (!chat || chat.userId !== session.user.id) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = await getMessagesByChatId({ id: chatId });

    const exportData = {
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.parts,
        createdAt: msg.createdAt,
      })),
      exportedAt: new Date().toISOString(),
    };

    if (format === "markdown") {
      let markdown = `# ${chat.title || "محادثة"}\n\n`;
      markdown += `تاريخ الإنشاء: ${new Date(chat.createdAt).toLocaleDateString("ar-SA")}\n\n`;
      markdown += "---\n\n";

      for (const msg of messages) {
        const role = msg.role === "user" ? "👤 أنت" : "🤖 حكمو";
        markdown += `## ${role}\n\n`;

        if (Array.isArray(msg.parts)) {
          for (const part of msg.parts) {
            if (typeof part === "object" && "text" in part) {
              markdown += `${part.text}\n\n`;
            } else if (typeof part === "string") {
              markdown += `${part}\n\n`;
            }
          }
        }

        markdown += "---\n\n";
      }

      return new Response(markdown, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="chat-${chatId}.md"`,
        },
      });
    }

    return Response.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="chat-${chatId}.json"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return Response.json({ error: "Export failed" }, { status: 500 });
  }
}
