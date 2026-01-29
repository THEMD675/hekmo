import { hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/queries";
import { user } from "@/lib/db/schema";

// Token storage (in production, use Redis or database table)
const resetTokens = new Map<string, { email: string; expires: Date }>();

// Request password reset
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { error: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    // Don't reveal if user exists or not (security)
    if (!existingUser) {
      // Still return success to prevent email enumeration
      return Response.json({
        success: true,
        message: "تم إرسال رابط إعادة التعيين",
      });
    }

    // Generate token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token
    resetTokens.set(token, { email, expires });

    // Build reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://hekmo.ai"}/reset-password?token=${token}`;

    console.log("[Password Reset] Email:", email);
    console.log("[Password Reset] URL:", resetUrl);

    // Send email using Resend (if configured)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Hekmo <noreply@hekmo.ai>",
            to: email,
            subject: "إعادة تعيين كلمة المرور - حكمو",
            html: `
              <div dir="rtl" style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #10b981;">حكمو - Hekmo</h1>
                <p>مرحباً،</p>
                <p>تلقينا طلب لإعادة تعيين كلمة المرور الخاصة بك.</p>
                <p>اضغط على الزر أدناه لإعادة تعيين كلمة المرور:</p>
                <a href="${resetUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">إعادة تعيين كلمة المرور</a>
                <p style="color: #666;">هذا الرابط صالح لمدة ساعة واحدة.</p>
                <p style="color: #666;">إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد.</p>
              </div>
            `,
          }),
        });
        console.log("[Password Reset] Email sent successfully");
      } catch (emailError) {
        console.error("[Password Reset] Email send failed:", emailError);
        // Don't fail the request - token is still valid
      }
    }

    return Response.json({
      success: true,
      message: "تم إرسال رابط إعادة التعيين",
    });
  } catch (error) {
    console.error("[Password Reset] Error:", error);
    return Response.json({ error: "فشل إرسال رابط التعيين" }, { status: 500 });
  }
}

// Reset password with token
export async function PUT(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json({ error: "البيانات غير مكتملة" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json(
        { error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // Verify token
    const tokenData = resetTokens.get(token);

    if (!tokenData) {
      return Response.json({ error: "الرابط غير صالح" }, { status: 400 });
    }

    if (tokenData.expires < new Date()) {
      resetTokens.delete(token);
      return Response.json({ error: "انتهت صلاحية الرابط" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await hash(password, 10);

    // Update password in database
    const [updatedUser] = await db
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.email, tokenData.email))
      .returning();

    if (!updatedUser) {
      return Response.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    console.log("[Password Reset] Password changed for:", tokenData.email);

    // Remove used token
    resetTokens.delete(token);

    return Response.json({
      success: true,
      message: "تم تغيير كلمة المرور",
    });
  } catch (error) {
    console.error("[Password Reset] Error:", error);
    return Response.json({ error: "فشل تغيير كلمة المرور" }, { status: 500 });
  }
}
