import Papa from "papaparse";
import { Review } from "./types";
import { driveImageUrl } from "./drive";
import { REVIEWS_CSV_URL } from "./config";
import { slugify, parseLinks, pick } from "./sheet-utils";

function rowToReview(row: Record<string, string>): Review | null {
  const bookTitle = pick(row, "titre_livre", "titre", "book_title");
  if (!bookTitle) return null;
  const date = pick(row, "date");
  const coverRaw = pick(row, "cover_drive_url", "cover", "image");
  const ratingRaw = pick(row, "note", "rating");

  return {
    slug: slugify(bookTitle, date),
    bookTitle,
    author: pick(row, "auteur", "author"),
    coverUrl: coverRaw ? driveImageUrl(coverRaw) : "",
    rating: ratingRaw ? Math.max(0, Math.min(5, parseFloat(ratingRaw))) : 0,
    verdict: pick(row, "verdict", "resume"),
    content: pick(row, "avis", "content", "critique"),
    date,
    genre: pick(row, "genre") || "Lecture",
    links: parseLinks(pick(row, "liens", "links")),
  };
}

export async function fetchReviews(): Promise<{
  reviews: Review[];
  isDemo: boolean;
}> {
  if (!REVIEWS_CSV_URL) {
    return { reviews: DEMO_REVIEWS, isDemo: true };
  }

  try {
    const res = await fetch(REVIEWS_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Réponse Sheet non valide");
    const csvText = await res.text();
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    const reviews = parsed.data
      .map(rowToReview)
      .filter((r): r is Review => r !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    if (reviews.length === 0) return { reviews: DEMO_REVIEWS, isDemo: true };
    return { reviews, isDemo: false };
  } catch {
    return { reviews: DEMO_REVIEWS, isDemo: true };
  }
}

export const DEMO_REVIEWS: Review[] = [
  {
    slug: "une-si-longue-lettre-20260625",
    bookTitle: "Une si longue lettre",
    author: "Mariama Bâ",
    coverUrl: "",
    rating: 5,
    verdict: "Un classique qu'il faut lire au moins une fois dans sa vie.",
    content:
      "Ramatoulaye écrit à son amie Aïssatou après la mort de son mari, et ce qui devait être une lettre de deuil devient une réflexion bouleversante sur la polygamie, la solitude et la force des femmes sénégalaises. La plume est sobre, presque pudique, et c'est justement ce qui rend chaque phrase si lourde de sens. Un livre court qu'on referme en ayant l'impression d'avoir vécu une vie entière.",
    date: "2026-06-25",
    genre: "Roman épistolaire",
    links: [],
  },
  {
    slug: "la-tache-de-l-etudiant-20260610",
    bookTitle: "L'aventure ambiguë",
    author: "Cheikh Hamidou Kane",
    coverUrl: "",
    rating: 4,
    verdict: "Une tension magnifique entre deux mondes qui ne se parlent pas assez.",
    content:
      "Samba Diallo est déchiré entre l'école coranique de son enfance et l'école française qui promet l'avenir. Le roman pose une question qui reste actuelle : que garde-t-on de soi quand on change de monde ? Le style est dense, parfois exigeant, mais chaque page mérite qu'on s'y arrête.",
    date: "2026-06-10",
    genre: "Roman",
    links: [],
  },
];
