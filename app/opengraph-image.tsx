import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F1E8",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            left: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            backgroundColor: "rgba(217,211,236,0.55)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            backgroundColor: "rgba(237,233,247,0.7)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            backgroundColor: "#EDE9F7",
            padding: "10px 24px",
            borderRadius: 999,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#8A7FCB",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 22, color: "#564B93", fontWeight: 600, display: "flex" }}>
            Le podcast
          </div>
        </div>

        <div
          style={{
            fontSize: 104,
            fontWeight: 700,
            color: "#322A58",
            display: "flex",
          }}
        >
          {SITE.name}
        </div>

        <div
          style={{
            fontSize: 34,
            color: "#4A3F7A",
            marginTop: 20,
            display: "flex",
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          {SITE.tagline}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            right: 64,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #A094D1, #6B5FB5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "18px solid transparent",
              borderBottom: "18px solid transparent",
              borderLeft: "26px solid #F5F1E8",
              marginLeft: 6,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}