"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JoinPageProps {
  params: Promise<{ token: string }>;
}

export default function JoinPage({ params }: JoinPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<{
    chatId: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    async function verifyToken() {
      try {
        const { token } = await params;
        
        // Decode token
        const decoded = atob(token.replace(/-/g, "+").replace(/_/g, "/"));
        const [sessionId, role] = decoded.split(":");

        if (!sessionId || !role) {
          setError("رابط غير صالح");
          setLoading(false);
          return;
        }

        setSessionInfo({ chatId: sessionId, role });
        setLoading(false);
      } catch {
        setError("رابط غير صالح أو منتهي الصلاحية");
        setLoading(false);
      }
    }

    verifyToken();
  }, [params]);

  const handleJoin = async () => {
    if (!session?.user || !sessionInfo) return;

    try {
      setLoading(true);

      // Join the collaborative session
      const response = await fetch("/api/chat/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionInfo.chatId,
          role: sessionInfo.role,
        }),
      });

      if (!response.ok) {
        throw new Error("فشل الانضمام");
      }

      // Redirect to chat
      router.push(`/chat/${sessionInfo.chatId}`);
    } catch {
      setError("فشل الانضمام للمحادثة");
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-5xl">❌</div>
          <h1 className="text-2xl font-bold">خطأ</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
        <div className="text-center space-y-4 max-w-md">
          <Users className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">انضم للمحادثة</h1>
          <p className="text-muted-foreground">
            تمت دعوتك للانضمام لمحادثة تعاونية. سجل الدخول للمتابعة.
          </p>
          <Button onClick={() => router.push("/login")}>تسجيل الدخول</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <div className="text-center space-y-6 max-w-md">
        <Users className="h-16 w-16 mx-auto text-primary" />
        <h1 className="text-2xl font-bold">انضم للمحادثة</h1>
        <p className="text-muted-foreground">
          تمت دعوتك للانضمام لمحادثة تعاونية كـ
          <span className="font-medium text-foreground mx-1">
            {sessionInfo?.role === "editor" ? "محرر" : "مشاهد"}
          </span>
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={handleJoin}>انضمام</Button>
          <Button onClick={() => router.push("/")} variant="outline">
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
}
