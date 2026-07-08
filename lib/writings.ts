import Papa from "papaparse";
import { Writing } from "./types";
import { WRITINGS_CSV_URL } from "./config";
import { slugify, parseLinks, pick } from "./sheet-utils";

function rowToWriting(row: Record<string, string>): Writing | null {
  const title = pick(row, "titre", "title");
  if (!title) return null;
  const date = pick(row, "date");

  return {
    slug: slugify(title, date),
    title,
    category: pick(row, "categorie", "category") || "Texte",
    excerpt: pick(row, "extrait", "excerpt"),
    content: pick(row, "texte", "contenu", "content"),
    date,
    links: parseLinks(pick(row, "liens", "links")),
  };
}

export async function fetchWritings(): Promise<{
  writings: Writing[];
  isDemo: boolean;
}> {
  if (!WRITINGS_CSV_URL) {
    return { writings: DEMO_WRITINGS, isDemo: true };
  }

  try {
    const res = await fetch(WRITINGS_CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Réponse Sheet non valide");
    const csvText = await res.text();
    const parsed = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    const writings = parsed.data
      .map(rowToWriting)
      .filter((w): w is Writing => w !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    if (writings.length === 0) return { writings: DEMO_WRITINGS, isDemo: true };
    return { writings, isDemo: false };
  } catch {
    return { writings: DEMO_WRITINGS, isDemo: true };
  }
}

export const DEMO_WRITINGS: Writing[] = [
  {
    slug: "ce-que-le-sable-garde-20260702",
    title: "Ce que le sable garde",
    category: "Poème",
    excerpt: "Un texte sur ce qu'on laisse derrière soi, et ce qui reste malgré tout.",
    content:
      "Le vent efface les pas\nmais jamais le poids du passage.\n\nJe suis restée si longtemps immobile\nque la mer a cru pouvoir me reprendre.\n\nElle ne sait pas\nque j'ai déjà donné à la terre\nce que je ne pouvais plus porter.\n\nCe que le sable garde\nn'appartient plus à personne —\nni à moi, ni à lui,\nni à ce que nous aurions pu être.",
    date: "2026-07-02",
    links: [],
  },
  {
    slug: "parler-de-politique-sans-se-dechirer-20260622",
    title: "Parler de politique sans se déchirer",
    category: "Politique",
    excerpt:
      "Pourquoi on évite le sujet à table, et ce qu'on perd à force de se taire.",
    content:
      "On m'a souvent dit d'éviter la politique en famille, comme si le silence protégeait plus qu'il n'abîmait. Mais je crois que ce qu'on tait finit toujours par revenir, en plus dur, en plus amer.\n\nCe texte n'est pas là pour convaincre. Il est là pour dire qu'on peut ne pas être d'accord et rester à la même table. Que la sincérité n'est pas une agression. Et que le vrai danger, ce n'est pas le désaccord — c'est de ne plus se parler du tout.",
    date: "2026-06-22",
    links: [],
  },
  {
    slug: "ce-que-m-apprend-un-tableau-que-je-ne-comprends-pas-20260608",
    title: "Ce que m'apprend un tableau que je ne comprends pas",
    category: "Art",
    excerpt:
      "Une réflexion sur l'art qui résiste, et sur le besoin de tout expliquer.",
    content:
      "Je suis restée vingt minutes devant une toile que je n'ai pas comprise. Pas de personnages, pas d'histoire évidente, juste des couches de couleur qui semblaient se disputer l'espace.\n\nJ'ai eu envie de partir. Puis j'ai eu envie de rester, justement parce que je ne comprenais pas. On m'a appris à tout expliquer, à tout ranger dans une case. Ce tableau refusait de rentrer où que ce soit, et c'est peut-être ça, la vraie fonction de l'art : nous rappeler qu'on n'a pas besoin de tout comprendre pour être touché.",
    date: "2026-06-08",
    links: [],
  },
];