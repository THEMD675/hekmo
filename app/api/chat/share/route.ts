import { auth } from "@/app/(auth)/auth";
import {
  createCollaborativeSession,
  generateInviteLink,
  getSessionByChatId,
} from "@/lib/collaborative-chat";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { chatId, role = "viewer" } = await request.json();

    if (!chatId) {
      return Response.json({ error: "معرف المحادثة مطلوب" }, { status: 400 });
    }

    // Get or create collaborative session
    let collabSession = getSessionByChatId(chatId);

    if (!collabSession) {
      collabSession = createCollaborativeSession(
        chatId,
        session.user.id,
        session.user.name || session.user.email || "مستخدم"
      );
    }

    // Generate invite link
    const inviteLink = generateInviteLink(
      collabSession.id,
      role === "editor" ? "editor" : "viewer"
    );

    return Response.json({
      success: true,
      inviteLink,
      sessionId: collabSession.id,
      participants: collabSession.participants.length,
    });
  } catch (error) {
    console.error("Share chat error:", error);
    return Response.json({ error: "فشل مشاركة المحادثة" }, { status: 500 });
  }
}
