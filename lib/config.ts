// ─────────────────────────────────────────────────────────────
// CONFIGURATION DU SITE MELI MICRO
// ─────────────────────────────────────────────────────────────
// 1. Crée un Google Sheet avec les colonnes exactes listées dans
//    le README (titre, description, date, categorie, audio_drive_url,
//    cover_drive_url, liens, duree).
// 2. Fichier > Partager > Publier sur le web > format CSV.
// 3. Colle l'URL générée ci-dessous dans SHEET_CSV_URL.
// 4. Partage le dossier Drive contenant les fichiers en
//    "Tous les utilisateurs disposant du lien" (lecteur).
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: "Meli Micro",
  tagline: "on parle de tout. vraiment tout.",
  description:
    "Une safe place pour parler de tout, en toute simplicité et en toute intimité.",
  about:
    "Meli Micro, c'est une fenêtre sur la vie comme elle est, et une bouchée d'air frais dans les journées trop pleines. Ici, aucun sujet n'est tabou : on reçoit des gens fidèles à eux-mêmes et à leurs passions, on prend le temps de bien se renseigner avant d'en parler, et on garde toujours la même règle — la douceur avant tout.",
};

// Chaque section a son propre Google Sheet publié en CSV.
// Remplace ces valeurs par tes URLs "Publier sur le web".

export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-0d2b0-eh_bW3mw75YLm1l0ptttt4LsJVOvKPCVkrXiESt3n7oGpgNWiSbzujQA/pub?gid=1885952281&single=true&output=csv";
export const REVIEWS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-0d2b0-eh_bW3mw75YLm1l0ptttt4LsJVOvKPCVkrXiESt3n7oGpgNWiSbzujQA/pub?gid=52687466&single=true&output=csv";
export const NJOGONAL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-0d2b0-eh_bW3mw75YLm1l0ptttt4LsJVOvKPCVkrXiESt3n7oGpgNWiSbzujQA/pub?gid=1999648487&single=true&output=csv";

// Écrits (poèmes, textes, réflexions)
export const WRITINGS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-0d2b0-eh_bW3mw75YLm1l0ptttt4LsJVOvKPCVkrXiESt3n7oGpgNWiSbzujQA/pub?gid=1541268699&single=true&output=csv";

// Réseaux sociaux — laisse vide ce qui n'existe pas encore,
// le lien correspondant n'apparaîtra simplement pas sur le site.
export const SOCIAL = {
  instagram: "",
  tiktok: "",
  email: "",
};

// Toutes les 5 minutes, le site revérifie s'il y a de nouveaux épisodes.
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000;