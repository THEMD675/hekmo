import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            href="/"
          >
            حكمو
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link className="hover:text-foreground transition-colors" href="/">
              الرئيسية
            </Link>
            <Link
              className="hover:text-foreground transition-colors"
              href="/privacy"
            >
              سياسة الخصوصية
            </Link>
            <Link
              className="hover:text-foreground transition-colors"
              href="/terms"
            >
              شروط الاستخدام
            </Link>
            <a
              className="hover:text-foreground transition-colors"
              href="mailto:support@hekmo.ai"
            >
              تواصل معنا
            </a>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            © {new Date().getFullYear()} حكمو. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
