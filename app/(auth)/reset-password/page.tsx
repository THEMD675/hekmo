"use client";

import { ArrowRight, Check, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [reset, setReset] = useState(false);

  // Request password reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("الرجاء إدخال البريد الإلكتروني");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error();

      setSent(true);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور");
    } catch {
      toast.error("فشل إرسال رابط إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    if (password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) throw new Error();

      setReset(true);
      toast.success("تم تغيير كلمة المرور بنجاح");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast.error("فشل تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  // Show reset form if token is present
  if (token) {
    if (reset) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          dir="rtl"
        >
          <div className="text-center space-y-4 max-w-md">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">تم تغيير كلمة المرور</h1>
            <p className="text-muted-foreground">
              يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة
            </p>
            <Button asChild className="w-full">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold">كلمة مرور جديدة</h1>
            <p className="text-muted-foreground mt-2">
              أدخل كلمة المرور الجديدة
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label className="text-sm font-medium">كلمة المرور الجديدة</label>
              <Input
                className="mt-1"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </div>
            <div>
              <label className="text-sm font-medium">تأكيد كلمة المرور</label>
              <Input
                className="mt-1"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={confirmPassword}
              />
            </div>
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "تغيير كلمة المرور"
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Request reset form
  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="text-center space-y-4 max-w-md">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">تحقق من بريدك</h1>
          <p className="text-muted-foreground">
            أرسلنا رابط إعادة تعيين كلمة المرور إلى{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            إذا لم تجد الرسالة، تحقق من مجلد البريد غير المرغوب فيه
          </p>
          <Button asChild variant="outline">
            <Link href="/login">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة لتسجيل الدخول
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-2xl font-bold">نسيت كلمة المرور؟</h1>
          <p className="text-muted-foreground mt-2">
            أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRequestReset}>
          <div>
            <label className="text-sm font-medium">البريد الإلكتروني</label>
            <Input
              className="mt-1"
              dir="ltr"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              type="email"
              value={email}
            />
          </div>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "إرسال رابط التعيين"
            )}
          </Button>
        </form>

        <div className="text-center">
          <Link
            className="text-sm text-muted-foreground hover:text-primary"
            href="/login"
          >
            <ArrowRight className="h-4 w-4 inline ml-1" />
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
