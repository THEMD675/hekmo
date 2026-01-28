import Link from "next/link";

const LINKS = {
  product: [
    { label: "الميزات", href: "/features" },
    { label: "الأسعار", href: "/pricing" },
    { label: "API", href: "/docs" },
  ],
  company: [
    { label: "عنا", href: "/about" },
    { label: "المدونة", href: "/blog" },
    { label: "تواصل معنا", href: "/contact" },
  ],
  legal: [
    { label: "الخصوصية", href: "/privacy" },
    { label: "الشروط", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link className="flex items-center gap-2 font-bold text-lg" href="/">
              <span className="text-2xl">🧠</span>
              حكمو
            </Link>
            <p className="text-sm text-muted-foreground">
              مساعدك الذكي للصحة باللغة العربية
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-medium mb-4">المنتج</h3>
            <ul className="space-y-2">
              {LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-medium mb-4">الشركة</h3>
            <ul className="space-y-2">
              {LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-medium mb-4">قانوني</h3>
            <ul className="space-y-2">
              {LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} حكمو. جميع الحقوق محفوظة.</p>
          <p className="mt-1">صنع بـ ❤️ في السعودية 🇸🇦</p>
        </div>
      </div>
    </footer>
  );
}
