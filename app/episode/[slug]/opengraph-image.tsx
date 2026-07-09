import { ImageResponse } from "next/og";
import { fetchEpisodes } from "@/lib/podcast";
import { SITE } from "@/lib/config";

export const alt = "Épisode";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { episodes } = await fetchEpisodes();
  const episode = episodes.find((e) => e.slug === slug);

  const title = episode?.title || SITE.name;
  const category = episode?.category || "Épisode";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F5F1E8",
          position: "relative",
          padding: 80,
        }}
      >
        {episode?.coverUrl && (
          <img
            src={episode.coverUrl}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, objectFit: "cover", opacity: 0.16 }}
          />
        )}

        <div
          style={{
            position: "absolute",
            bottom: -160,
            right: -140,
            width: 480,
            height: 480,
            borderRadius: "50%",
            backgroundColor: "rgba(217,211,236,0.5)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #A094D1, #6B5FB5)",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 700, color: "#322A58", display: "flex" }}>
            {SITE.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            flexDirection: "column",
            maxWidth: 900,
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#EDE9F7",
              color: "#564B93",
              fontSize: 22,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 999,
              width: "fit-content",
              marginBottom: 24,
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 62,
              fontWeight: 700,
              color: "#322A58",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}