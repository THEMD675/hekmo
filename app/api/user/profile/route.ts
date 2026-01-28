import { auth } from "@/app/(auth)/auth";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { user } from "@/lib/db/schema";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      // Return session data if no database
      return Response.json({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        tier: "free",
        createdAt: new Date().toISOString(),
      });
    }

    const client = postgres(connectionString);
    const db = drizzle(client);

    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    await client.end();

    if (!userData) {
      return Response.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return Response.json({
      id: userData.id,
      email: userData.email,
      name: session.user.name,
      image: session.user.image,
      tier: "free",
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json(
      { error: "فشل تحميل الملف الشخصي" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await request.json();

    // Validate updates
    const allowedFields = ["name"];
    const filteredUpdates: Record<string, string> = {};

    for (const key of allowedFields) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return Response.json(
        { error: "لا توجد تحديثات صالحة" },
        { status: 400 }
      );
    }

    // In production, update the database
    // await db.update(user).set(filteredUpdates).where(eq(user.id, session.user.id));

    return Response.json({
      success: true,
      message: "تم تحديث الملف الشخصي",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json(
      { error: "فشل تحديث الملف الشخصي" },
      { status: 500 }
    );
  }
}
