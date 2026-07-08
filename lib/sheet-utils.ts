import { EpisodeLink } from "./types";
import { driveImageUrl } from "./drive";

export function slugify(title: string, date: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const d = date ? date.replace(/[^0-9]/g, "").slice(0, 8) : "";
  return d ? `${base}-${d}` : base;
}

export function parseLinks(raw: string): EpisodeLink[] {
  if (!raw) return [];
  return raw
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [label, url] = chunk.split("|").map((s) => s.trim());
      return { label: label || "Lien", url: url || label };
    })
    .filter((l) => !!l.url);
}

export function parsePhotos(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => driveImageUrl(s));
}

// Gère le cas où un saut de ligne a été collé comme texte littéral "\n"
// (deux caractères) au lieu d'un vrai retour à la ligne dans la cellule.
function normalizeLineBreaks(value: string): string {
  return value.replace(/\\n/g, "\n").replace(/\\r/g, "");
}

export function pick(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    for (const rowKey of Object.keys(row)) {
      if (rowKey.trim().toLowerCase() === k) {
        return normalizeLineBreaks((row[rowKey] || "").trim());
      }
    }
  }
  return "";
}