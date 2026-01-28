import { put } from "@vercel/blob";
import { auth } from "@/app/(auth)/auth";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "لم يتم تحديد ملف" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "يرجى رفع صورة" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "حجم الصورة كبير جداً (الحد الأقصى 5 ميجا)" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const extension = file.name.split(".").pop();
    const filename = `avatars/${session.user.id}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    // Update user avatar in database
    // TODO: Update database
    // await db.update(user).set({ image: blob.url }).where(eq(user.id, session.user.id));

    return Response.json({
      url: blob.url,
      message: "تم تحديث الصورة",
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return Response.json(
      { error: "فشل رفع الصورة" },
      { status: 500 }
    );
  }
}
