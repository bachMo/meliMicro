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

// Épisodes audio du podcast
export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-0d2b0-eh_bW3mw75YLm1l0ptttt4LsJVOvKPCVkrXiESt3n7oGpgNWiSbzujQA/pub?gid=1885952281&single=true&output=csv";
export const REVIEWS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-0d2b0-eh_bW3mw75YLm1l0ptttt4LsJVOvKPCVkrXiESt3n7oGpgNWiSbzujQA/pub?gid=52687466&single=true&output=csv";
export const NJOGONAL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-0d2b0-eh_bW3mw75YLm1l0ptttt4LsJVOvKPCVkrXiESt3n7oGpgNWiSbzujQA/pub?gid=1999648487&single=true&output=csv";

// Écrits (poèmes, textes, réflexions)
export const WRITINGS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-0d2b0-eh_bW3mw75YLm1l0ptttt4LsJVOvKPCVkrXiESt3n7oGpgNWiSbzujQA/pub?gid=1541268699&single=true&output=csv";

// Réseaux sociaux — laisse vide ce qui n'existe pas encore,
// le lien correspondant n'apparaîtra simplement pas sur le site.
export const SOCIAL = {
  instagram: "https://www.instagram.com/datgyaldada/",
  tiktok: "https://www.tiktok.com/",
  email: "aidadiao1411@gmail.com",
};

// La page "À propos" présente Aida, pas juste le concept du podcast.
// photoUrl : colle un lien de partage Google Drive si tu as une photo,
// sinon laisse vide — un avatar par défaut s'affichera.
export const AIDA = {
  name: "Aida Diao",
  role: "La voix derrière Meli Micro",
  photoUrl: "https://drive.google.com/file/d/1YwtxpxChCI-kEQ3HTeZQWrWWBCml2Gxs/view?usp=drive_link",
  bio: "J'ai toujours eu trois amours : les livres qu'on referme différent qu'on les a ouverts, l'art qui pose plus de questions qu'il n'apporte de réponses, et les conversations qui vont plus loin que la politesse. Meli Micro est né de cette envie simple : créer un espace où on peut tout se dire, sans avoir à choisir entre légèreté et profondeur.",
  passions: ["Lecture", "Art", "Réflexion", "Conversations vraies"],
};

// Toutes les 5 minutes, le site revérifie s'il y a de nouveaux épisodes.
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000;