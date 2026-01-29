import { eq } from "drizzle-orm";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { user } from "@/lib/db/schema";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userData) {
      return Response.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    return Response.json({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      image: userData.image,
      tier: "free",
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json({ error: "فشل تحميل الملف الشخصي" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await request.json();

    // Validate updates - only allow name and image
    const allowedFields = ["name", "image"];
    const filteredUpdates: Record<string, string> = {};

    for (const key of allowedFields) {
      if (key in updates && updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return Response.json({ error: "لا توجد تحديثات صالحة" }, { status: 400 });
    }

    // Update the database
    await db
      .update(user)
      .set(filteredUpdates)
      .where(eq(user.id, session.user.id));

    return Response.json({
      success: true,
      message: "تم تحديث الملف الشخصي",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json({ error: "فشل تحديث الملف الشخصي" }, { status: 500 });
  }
}
