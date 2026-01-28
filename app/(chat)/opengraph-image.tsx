import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hekmo — مساعدك الذكي بالعربي";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#070f0b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "#10b981",
            letterSpacing: "-0.03em",
          }}
        >
          Hekmo
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#6b7280",
            marginTop: 16,
          }}
        >
          مساعدك الذكي بالعربي
        </div>
      </div>
    ),
    { ...size }
  );
}
