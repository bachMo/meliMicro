export type EpisodeLink = {
  label: string;
  url: string;
};

export type Episode = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  audioUrl: string;
  coverUrl: string;
  links: EpisodeLink[];
  duration?: string;
  photos: string[];
};

export type Review = {
  slug: string;
  bookTitle: string;
  author: string;
  coverUrl: string;
  rating: number; // 0 to 5
  verdict: string;
  content: string;
  date: string;
  genre: string;
  links: EpisodeLink[];
};

export type NjogonalVideo = {
  slug: string;
  title: string;
  description: string;
  bookTitle: string;
  videoUrl: string;
  coverUrl: string;
  date: string;
  links: EpisodeLink[];
};
