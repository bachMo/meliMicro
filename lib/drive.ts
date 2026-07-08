// Convertit n'importe quel format de lien Google Drive collé par l'amie
// (lien de partage classique) en ID de fichier exploitable.
export function extractDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // https://drive.google.com/open?id=FILE_ID
  // https://drive.google.com/uc?id=FILE_ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];

  // Lien déjà brut (juste l'ID)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;

  return null;
}

// Lien direct pour lecture audio en streaming (supporte les requêtes range).
// Renvoie le premier candidat, pour un usage simple (affichage, etc).
export function driveAudioUrl(shareUrl: string): string {
  const candidates = driveAudioCandidates(shareUrl);
  return candidates[0] || shareUrl;
}

// Google Drive force le téléchargement (Content-Disposition: attachment)
// sur ses liens directs, ce qu'une balise <audio> ne sait pas lire en
// flux. Le relais interne /api/audio/[id] contourne ça en resservant le
// fichier en "inline". On garde les liens directs Drive en secours, au
// cas où le relais serait indisponible (ex: en dehors de Vercel).
export function driveAudioCandidates(shareUrl: string): string[] {
  const id = extractDriveId(shareUrl);
  if (!id) return shareUrl ? [shareUrl] : [];
  return [
    `/api/audio/${id}`,
    `https://drive.usercontent.google.com/download?id=${id}&export=download`,
    `https://drive.google.com/uc?export=download&id=${id}`,
  ];
}

// Lien optimisé pour afficher une image (miniature redimensionnable).
export function driveImageUrl(shareUrl: string, width = 1000): string {
  const id = extractDriveId(shareUrl);
  if (!id) return shareUrl;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
}