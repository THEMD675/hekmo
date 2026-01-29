"use client";

import { AlertTriangle, MessageSquare, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to reporting service
    console.error("Chat error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-8" dir="rtl">
      <div className="text-center space-y-6 max-w-md">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">حدث خطأ في المحادثة</h2>
        <p className="text-muted-foreground">
          نعتذر، حدث خطأ أثناء تحميل المحادثة. يرجى المحاولة مرة أخرى.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <MessageSquare className="h-4 w-4 ml-2" />
              محادثة جديدة
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
