import Link from "next/link";
import { Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background p-4"
      dir="rtl"
    >
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold text-muted-foreground/30">404</div>
        <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            href="/"
          >
            <Home className="h-5 w-5 ml-2" />
            الصفحة الرئيسية
          </Link>
          <Link
            className="inline-flex items-center justify-center px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
            href="/search"
          >
            <Search className="h-5 w-5 ml-2" />
            البحث
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          إذا كنت تعتقد أن هذا خطأ، يرجى{" "}
          <Link className="text-primary hover:underline" href="/contact">
            التواصل معنا
          </Link>
        </p>
      </div>
    </div>
  );
}
