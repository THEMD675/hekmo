import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hekmo — Wellness AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
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
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          Hekmo
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            marginTop: 16,
          }}
        >
          Your wellness AI coach
        </div>
      </div>
    ),
    { ...size }
  );
}
