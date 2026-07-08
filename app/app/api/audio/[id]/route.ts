import { NextRequest } from "next/server";

// Le téléchargement peut prendre un peu de temps sur les gros épisodes ;
// on laisse jusqu'à 60s à la fonction pour transférer le flux.
export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new Response("Identifiant manquant", { status: 400 });

  const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;
  const range = req.headers.get("range");

  const upstream = await fetch(driveUrl, {
    headers: range ? { Range: range } : {},
    redirect: "follow",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(
      "Impossible de récupérer ce fichier depuis Google Drive. Vérifie qu'il est bien partagé publiquement.",
      { status: upstream.status }
    );
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "audio/mpeg");
  // "inline" (et non "attachment") : c'est ce qui permet à <audio> de lire
  // le flux au lieu de forcer un téléchargement.
  headers.set("Content-Disposition", "inline");
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=3600");

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  return new Response(upstream.body, {
    status: upstream.status === 206 ? 206 : 200,
    headers,
  });
}
