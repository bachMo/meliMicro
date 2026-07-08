import Papa from "papaparse";
import { NjogonalVideo } from "./types";
import { driveImageUrl } from "./drive";
import { NJOGONAL_CSV_URL } from "./config";
import { slugify, parseLinks, pick } from "./sheet-utils";

function rowToVideo(row: Record<string, string>): NjogonalVideo | null {
  const title = pick(row, "titre", "title");
  if (!title) return null;
  const date = pick(row, "date");
  const coverRaw = pick(row, "cover_drive_url", "cover", "image");

  return {
    slug: slugify(title, date),
    title,
    description: pick(row, "description", "resume"),
    bookTitle: pick(row, "titre_livre", "livre", "book_title"),
    videoUrl: pick(row, "video_url", "video", "lien_video"),
    coverUrl: coverRaw ? driveImageUrl(coverRaw) : "",
    date,
    links: parseLinks(pick(row, "liens", "links")),
  };
}

export async function fetchNjogonalVideos(): Promise<{
  videos: NjogonalVideo[];
  isDemo: boolean;
}> {
  if (!NJOGONAL_CSV_URL) {
    return { videos: DEMO_VIDEOS, isDemo: true };
  }

  try {
    const res = await fetch(NJOGONAL_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Réponse Sheet non valide");
    const csvText = await res.text();
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    const videos = parsed.data
      .map(rowToVideo)
      .filter((v): v is NjogonalVideo => v !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    if (videos.length === 0) return { videos: DEMO_VIDEOS, isDemo: true };
    return { videos, isDemo: false };
  } catch {
    return { videos: DEMO_VIDEOS, isDemo: true };
  }
}

export const DEMO_VIDEOS: NjogonalVideo[] = [
  {
    slug: "une-si-longue-lettre-le-debat-20260628",
    title: "On refait le procès de Modou Fall",
    description:
      "Épisode vidéo autour d'Une si longue lettre : on débat à visage découvert de la polygamie, de la loyauté, et de ce que le livre dit encore de nous aujourd'hui.",
    bookTitle: "Une si longue lettre — Mariama Bâ",
    videoUrl: "",
    coverUrl: "",
    date: "2026-06-28",
    links: [],
  },
  {
    slug: "aventure-ambigue-generation-20260615",
    title: "Peut-on appartenir à deux mondes à la fois ?",
    description:
      "Discussion filmée sur L'aventure ambiguë, avec des lecteurs qui ont vécu, comme Samba Diallo, l'entre-deux entre tradition et modernité.",
    bookTitle: "L'aventure ambiguë — Cheikh Hamidou Kane",
    videoUrl: "",
    coverUrl: "",
    date: "2026-06-15",
    links: [],
  },
];
