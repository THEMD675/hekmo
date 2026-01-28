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
            href="/" 
            className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            حكمو
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              الرئيسية
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              شروط الاستخدام
            </Link>
            <a href="mailto:support@hekmo.ai" className="hover:text-foreground transition-colors">
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
