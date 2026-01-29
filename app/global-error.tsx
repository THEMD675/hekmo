"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html dir="rtl" lang="ar">
      <body className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-6 max-w-md">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">حدث خطأ غير متوقع</h1>
          <p className="text-muted-foreground">
            نعتذر عن هذا الخطأ. فريقنا تم إبلاغه ويعمل على حله.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="p-4 bg-muted rounded-lg text-xs text-right overflow-auto max-h-40">
              {error.message}
            </pre>
          )}
          <div className="flex gap-3 justify-center">
            <button
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              onClick={reset}
              type="button"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </button>
            <a
              className="inline-flex items-center px-4 py-2 border rounded-lg hover:bg-muted"
              href="/"
            >
              <Home className="h-4 w-4 ml-2" />
              الرئيسية
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
