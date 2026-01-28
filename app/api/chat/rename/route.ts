import { auth } from "@/app/(auth)/auth";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chat } from "@/lib/db/schema";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title } = await request.json();

    if (!id || !title) {
      return Response.json(
        { error: "معرف المحادثة والعنوان مطلوبان" },
        { status: 400 }
      );
    }

    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const client = postgres(connectionString);
    const db = drizzle(client);

    // Update the chat title
    await db
      .update(chat)
      .set({ title: title.trim() })
      .where(and(eq(chat.id, id), eq(chat.userId, session.user.id)));

    await client.end();

    return Response.json({
      success: true,
      message: "تم تحديث العنوان",
    });
  } catch (error) {
    console.error("Rename chat error:", error);
    return Response.json(
      { error: "فشل تحديث العنوان" },
      { status: 500 }
    );
  }
}
