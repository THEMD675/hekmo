import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { chat, message } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { chatId } = await request.json();

    if (!chatId) {
      return Response.json({ error: "معرف المحادثة مطلوب" }, { status: 400 });
    }

    // Fetch original chat
    const [originalChat] = await db
      .select()
      .from(chat)
      .where(eq(chat.id, chatId))
      .limit(1);

    if (!originalChat) {
      return Response.json({ error: "المحادثة غير موجودة" }, { status: 404 });
    }

    // Verify ownership
    if (originalChat.userId !== session.user.id) {
      return Response.json({ error: "غير مصرح" }, { status: 403 });
    }

    // Create new chat ID
    const newChatId = generateUUID();

    // Duplicate the chat record
    await db.insert(chat).values({
      id: newChatId,
      userId: session.user.id,
      title: `نسخة: ${originalChat.title}`,
      createdAt: new Date(),
      visibility: originalChat.visibility,
    });

    // Duplicate all messages
    const originalMessages = await db
      .select()
      .from(message)
      .where(eq(message.chatId, chatId));

    for (const msg of originalMessages) {
      await db.insert(message).values({
        id: generateUUID(),
        chatId: newChatId,
        role: msg.role,
        parts: msg.parts,
        attachments: msg.attachments,
        createdAt: msg.createdAt,
      });
    }

    return Response.json({
      success: true,
      id: newChatId,
      message: "تم نسخ المحادثة",
    });
  } catch (error) {
    console.error("Duplicate chat error:", error);
    return Response.json({ error: "فشل نسخ المحادثة" }, { status: 500 });
  }
}
