import { auth } from "@/app/(auth)/auth";
import { joinSession, getSession } from "@/lib/collaborative-chat";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sessionId, role } = await request.json();

    if (!sessionId) {
      return Response.json({ error: "معرف الجلسة مطلوب" }, { status: 400 });
    }

    // Get the collaborative session
    const collabSession = getSession(sessionId);
    if (!collabSession) {
      return Response.json({ error: "الجلسة غير موجودة" }, { status: 404 });
    }

    // Join the session
    const success = joinSession(
      sessionId,
      session.user.id,
      session.user.name || session.user.email || "مستخدم",
      role === "editor" ? "editor" : "viewer"
    );

    if (!success) {
      return Response.json({ error: "فشل الانضمام للجلسة" }, { status: 400 });
    }

    return Response.json({
      success: true,
      chatId: collabSession.chatId,
      message: "تم الانضمام بنجاح",
    });
  } catch (error) {
    console.error("Join session error:", error);
    return Response.json({ error: "فشل الانضمام" }, { status: 500 });
  }
}
