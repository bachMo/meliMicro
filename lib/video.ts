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

// Renvoie une URL utilisable dans une balise <iframe>, que la vidéo
// vienne de YouTube (non répertoriée conseillé) ou d'un fichier Drive.
export function videoEmbedUrl(url: string): { src: string; type: "youtube" | "drive" } | null {
  if (!url) return null;

  const ytId = extractYoutubeId(url);
  if (ytId) return { src: `https://www.youtube.com/embed/${ytId}`, type: "youtube" };

  const driveId = extractDriveId(url);
  if (driveId) return { src: `https://drive.google.com/file/d/${driveId}/preview`, type: "drive" };

  return null;
}
