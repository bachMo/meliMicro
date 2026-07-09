import { extractDriveId } from "./drive";

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export type VideoSource =
  // fichier Drive : lu directement via notre propre lecteur <video>,
  // relayé par /api/audio/[id] (qui sert aussi bien l'audio que la vidéo).
  | { type: "file"; src: string }
  // YouTube : pas de fichier direct disponible, on reste sur un iframe,
  // mais nettoyé du plus de branding possible.
  | { type: "youtube"; src: string };

export function resolveVideoSource(url: string): VideoSource | null {
  if (!url) return null;

  const ytId = extractYoutubeId(url);
  if (ytId) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0&playsinline=1`,
    };
  }

  const driveId = extractDriveId(url);
  if (driveId) return { type: "file", src: `/api/audio/${driveId}` };

  return null;
}