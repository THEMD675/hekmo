import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hekmo — مساعدك الذكي بالعربي",
    short_name: "Hekmo",
    description: "مساعدك الذكي بالعربي — برمجة، كتابة، بحث، وأكثر. مدعوم بالذكاء الاصطناعي المتقدم.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f0d",
    theme_color: "#0a0f0d",
    dir: "rtl",
    lang: "ar",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["productivity", "utilities", "education"],
    screenshots: [
      {
        src: "/images/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/images/screenshot-mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}
