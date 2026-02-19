import type { Metadata } from "next";
import {
  Cairo,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Inter,
  Tajawal,
} from "next/font/google";
import { Toaster } from "sonner";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CookieConsent } from "@/components/cookie-consent";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export const metadata: Metadata = {
  metadataBase: new URL("https://hekmo.ai"),
  title: {
    default: "Hekmo — مساعدك الذكي بالعربي",
    template: "%s | Hekmo",
  },
  description:
    "مساعدك الذكي بالعربي — برمجة، كتابة، بحث، وأكثر. مدعوم بالذكاء الاصطناعي المتقدم.",
  keywords: [
    "ذكاء اصطناعي",
    "مساعد ذكي",
    "ChatGPT عربي",
    "AI",
    "برمجة",
    "كتابة",
    "بحث",
    "السعودية",
    "Hekmo",
    "حكمو",
  ],
  authors: [{ name: "Hekmo", url: "https://hekmo.ai" }],
  creator: "Hekmo",
  publisher: "Hekmo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://hekmo.ai",
    siteName: "Hekmo",
    title: "Hekmo — مساعدك الذكي بالعربي",
    description:
      "مساعدك الذكي بالعربي — برمجة، كتابة، بحث، وأكثر. مدعوم بالذكاء الاصطناعي المتقدم.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hekmo — مساعدك الذكي بالعربي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hekmo — مساعدك الذكي بالعربي",
    description:
      "مساعدك الذكي بالعربي — برمجة، كتابة، بحث، وأكثر. مدعوم بالذكاء الاصطناعي المتقدم.",
    images: ["/images/og-image.png"],
    creator: "@hekmo_ai",
  },
  alternates: {
    canonical: "https://hekmo.ai",
    languages: {
      "ar-SA": "https://hekmo.ai",
    },
  },
  category: "technology",
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-arabic",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-tajawal",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(160deg 15% 4%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${ibmPlexArabic.variable} ${cairo.variable} ${tajawal.variable} ${inter.variable} ${geistMono.variable}`}
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      dir="rtl"
      lang="ar"
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required"
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Hekmo",
              alternateName: "حكمو",
              description:
                "مساعدك الذكي بالعربي — برمجة، كتابة، بحث، وأكثر. مدعوم بالذكاء الاصطناعي المتقدم.",
              url: "https://hekmo.ai",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "SAR",
              },
              author: {
                "@type": "Organization",
                name: "Hekmo",
                url: "https://hekmo.ai",
              },
              inLanguage: ["ar", "en"],
              isAccessibleForFree: true,
            }),
          }}
          type="application/ld+json"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
        >
          <Toaster position="top-center" />
          <SessionProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </SessionProvider>
          <CookieConsent />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
