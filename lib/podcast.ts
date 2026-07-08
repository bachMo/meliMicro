import Papa from "papaparse";
import { Episode } from "./types";
import { driveImageUrl } from "./drive";
import { SHEET_CSV_URL } from "./config";
import { slugify, parseLinks, parsePhotos, pick } from "./sheet-utils";

function rowToEpisode(row: Record<string, string>): Episode | null {
  const title = pick(row, "titre", "title");
  if (!title) return null;
  const date = pick(row, "date");
  const audioRaw = pick(row, "audio_drive_url", "audio", "lien_audio");
  const coverRaw = pick(row, "cover_drive_url", "cover", "image", "photo");

  return {
    slug: slugify(title, date),
    title,
    description: pick(row, "description", "resume"),
    date,
    category: pick(row, "categorie", "category") || "Épisode",
    audioUrl: audioRaw,
    coverUrl: coverRaw ? driveImageUrl(coverRaw) : "",
    duration: pick(row, "duree", "duration"),
    links: parseLinks(pick(row, "liens", "links")),
    photos: parsePhotos(pick(row, "photos", "galerie")),
  };
}

export async function fetchEpisodes(): Promise<{
  episodes: Episode[];
  isDemo: boolean;
}> {
  if (!SHEET_CSV_URL) {
    return { episodes: DEMO_EPISODES, isDemo: true };
  }

  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Réponse Sheet non valide");
    const csvText = await res.text();
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    const episodes = parsed.data
      .map(rowToEpisode)
      .filter((e): e is Episode => e !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    if (episodes.length === 0) return { episodes: DEMO_EPISODES, isDemo: true };
    return { episodes, isDemo: false };
  } catch {
    return { episodes: DEMO_EPISODES, isDemo: true };
  }
}

// Données affichées tant que le Google Sheet n'est pas configuré,
// pour que le site soit toujours présentable dès aujourd'hui.
export const DEMO_EPISODES: Episode[] = [
  {
    slug: "l-amitie-a-l-age-adulte-20260701",
    title: "L'amitié à l'âge adulte",
    description:
      "Pourquoi se faire des amis devient si dur après 25 ans, et comment on garde les liens qui comptent vraiment quand la vie s'accélère.",
    date: "2026-07-01",
    category: "Société",
    audioUrl: "",
    coverUrl: "",
    duration: "42 min",
    links: [{ label: "Instagram de l'invitée", url: "https://instagram.com" }],
    photos: [],
  },
  {
    slug: "argent-et-tabous-20260620",
    title: "Argent et tabous",
    description:
      "On parle cash de ce qu'on gagne, ce qu'on dépense, et pourquoi c'est encore si difficile d'en discuter entre amis.",
    date: "2026-06-20",
    category: "Argent",
    audioUrl: "",
    coverUrl: "",
    duration: "38 min",
    links: [],
    photos: [],
  },
  {
    slug: "recommencer-a-zero-20260605",
    title: "Recommencer à zéro",
    description:
      "Trois histoires de reconversion complète, avec les doutes, les peurs, et ce qui a fait basculer la décision.",
    date: "2026-06-05",
    category: "Parcours",
    audioUrl: "",
    coverUrl: "",
    duration: "51 min",
    links: [],
    photos: [],
  },
];