import { hash } from "bcrypt-ts";

// Token storage (use Redis or database in production)
const resetTokens = new Map<
  string,
  { email: string; expires: Date }
>();

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

    // Generate token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token
    resetTokens.set(token, { email, expires });

    // In production, send email with reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    console.log("[Password Reset] Email:", email);
    console.log("[Password Reset] URL:", resetUrl);

    // TODO: Send email with nodemailer or email service
    // await sendEmail({
    //   to: email,
    //   subject: "إعادة تعيين كلمة المرور - حكمو",
    //   html: `<p>اضغط على الرابط لإعادة تعيين كلمة المرور: <a href="${resetUrl}">${resetUrl}</a></p>`,
    // });

    return Response.json({
      success: true,
      message: "تم إرسال رابط إعادة التعيين",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return Response.json(
      { error: "فشل إرسال رابط التعيين" },
      { status: 500 }
    );
  }
}

// Reset password with token
export async function PUT(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        { error: "البيانات غير مكتملة" },
        { status: 400 }
      );
    }

    // Verify token
    const tokenData = resetTokens.get(token);

    if (!tokenData) {
      return Response.json(
        { error: "الرابط غير صالح" },
        { status: 400 }
      );
    }

    if (tokenData.expires < new Date()) {
      resetTokens.delete(token);
      return Response.json(
        { error: "انتهت صلاحية الرابط" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(password, 10);

    // Update password in database
    // TODO: Implement database update
    // await db.update(users)
    //   .set({ password: hashedPassword })
    //   .where(eq(users.email, tokenData.email));

    console.log("[Password Reset] Password changed for:", tokenData.email);

    // Remove used token
    resetTokens.delete(token);

    return Response.json({
      success: true,
      message: "تم تغيير كلمة المرور",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json(
      { error: "فشل تغيير كلمة المرور" },
      { status: 500 }
    );
  }
}
