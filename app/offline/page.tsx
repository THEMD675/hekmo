"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl">📡</div>
        <h1 className="text-3xl font-bold">أنت غير متصل</h1>
        <p className="text-muted-foreground text-lg">
          يبدو أنك فقدت الاتصال بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.
        </p>
        <button
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          onClick={() => window.location.reload()}
          type="button"
        >
          إعادة المحاولة
        </button>
        <p className="text-sm text-muted-foreground">
          يمكنك الوصول إلى المحادثات المحفوظة عند استعادة الاتصال.
        </p>
      </div>
    </div>
  );
}
