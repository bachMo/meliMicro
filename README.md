# Meli Micro — site du podcast

Site sans backend ni base de données. Les épisodes sont gérés dans un Google
Sheet, les fichiers audio/photos dans Google Drive, le tout hébergé
gratuitement sur Vercel.

## 1. Créer le Google Sheet (le "back-office" de ton amie)

Crée un Google Sheet avec exactement ces colonnes en première ligne :

| titre | description | date | categorie | audio_drive_url | cover_drive_url | duree | liens | photos |
|---|---|---|---|---|---|---|---|---|

- **titre** : titre de l'épisode
- **description** : texte libre, peut être long
- **date** : format `AAAA-MM-JJ` (ex: `2026-07-08`)
- **categorie** : ex: `Société`, `Argent`, `Parcours` — sert aux filtres
- **audio_drive_url** : lien de partage Google Drive du fichier audio
- **cover_drive_url** : lien de partage Google Drive de l'image de couverture
- **duree** : ex: `42 min` (facultatif)
- **liens** : plusieurs liens séparés par `;`, format `Label|https://...`
  (ex: `Instagram|https://instagram.com/x; Site|https://exemple.com`)
- **photos** : plusieurs liens Drive séparés par `;` (facultatif)

Chaque ligne = un épisode. Une nouvelle ligne = un nouvel épisode publié.

### Publier le Sheet en CSV
`Fichier` → `Partager` → `Publier sur le web` → onglet correspondant à ta
feuille → format **CSV** → Publier. Copie l'URL générée (elle ressemble à
`https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`).

Colle cette URL dans `lib/config.ts` :

```ts
export const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv";
```

Le site relit automatiquement le Sheet toutes les 5 minutes (et à chaque
visite) — aucune republication ni redéploiement nécessaire pour ajouter un
épisode.

## 2. Préparer le dossier Google Drive

1. Crée un dossier Drive dédié aux fichiers du podcast.
2. Dépose les audios (mp3/wav) et les images.
3. Pour chaque fichier : clic droit → `Partager` → `Accès général` →
   **"Tous les utilisateurs disposant du lien"** (rôle lecteur).
4. Copie le lien de partage et colle-le dans la colonne correspondante du
   Sheet. Le site convertit automatiquement ce lien en lien de streaming ou
   d'image — colle simplement le lien tel quel.

## 3. Développement local

```bash
npm install
npm run dev
```

Tant que `SHEET_CSV_URL` est vide, le site affiche des épisodes de
démonstration pour que le rendu soit toujours visible.

## 4. Déploiement sur Vercel (gratuit)

1. Pousse ce dossier sur un repo GitHub.
2. Sur [vercel.com](https://vercel.com), `New Project` → importe le repo.
3. Laisse les réglages par défaut (Next.js est détecté automatiquement) →
   `Deploy`.
4. À chaque `git push`, Vercel redéploie automatiquement. Mettre à jour le
   Google Sheet ne nécessite aucun déploiement.

## Structure du projet

- `lib/config.ts` — URL du Sheet, nom du site
- `lib/podcast.ts` — récupération et parsing du CSV
- `lib/drive.ts` — conversion des liens Google Drive
- `components/` — Hero, cartes d'épisodes, lecteur audio flottant
- `context/PlayerContext.tsx` — état global du lecteur audio
- `app/episode/[slug]/page.tsx` — page détail d'un épisode
