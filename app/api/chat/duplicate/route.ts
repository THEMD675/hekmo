import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { chatId } = await request.json();

    if (!chatId) {
      return Response.json(
        { error: "معرف المحادثة مطلوب" },
        { status: 400 }
      );
    }

    // In production, fetch original chat from database
    // const originalChat = await db.query.chats.findFirst({
    //   where: eq(chats.id, chatId),
    // });

    // For now, just create a new chat ID
    const newChatId = generateUUID();

    // In production:
    // 1. Duplicate the chat record
    // await db.insert(chats).values({
    //   id: newChatId,
    //   userId: session.user.id,
    //   title: `نسخة من: ${originalChat.title}`,
    //   createdAt: new Date(),
    // });

    // 2. Duplicate all messages
    // const messages = await db.query.messages.findMany({
    //   where: eq(messages.chatId, chatId),
    // });
    // for (const msg of messages) {
    //   await db.insert(messages).values({
    //     ...msg,
    //     id: generateUUID(),
    //     chatId: newChatId,
    //   });
    // }

    return Response.json({
      success: true,
      id: newChatId,
      message: "تم نسخ المحادثة",
    });
  } catch (error) {
    console.error("Duplicate chat error:", error);
    return Response.json(
      { error: "فشل نسخ المحادثة" },
      { status: 500 }
    );
  }
}
