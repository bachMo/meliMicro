"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Episode } from "@/lib/types";
import EpisodeCard from "./EpisodeCard";

export default function EpisodeGrid({ episodes }: { episodes: Episode[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Tous");

  const categories = useMemo(() => {
    const set = new Set(episodes.map((e) => e.category));
    return ["Tous", ...Array.from(set)];
  }, [episodes]);

  const filtered = useMemo(() => {
    return episodes.filter((e) => {
      const matchesCategory = category === "Tous" || e.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [episodes, query, category]);

  return (
    <section id="episodes" className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink">
          Épisodes précédents
        </h2>

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un épisode..."
            className="w-full rounded-full bg-white/70 border border-lav-200 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-lav-400 transition-shadow"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
              category === cat
                ? "bg-ink text-cream"
                : "bg-white/60 text-ink-soft border border-lav-200 hover:border-lav-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-muted text-sm py-16 text-center">
          Aucun épisode ne correspond à cette recherche.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((episode, i) => (
            <EpisodeCard key={episode.slug} episode={episode} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}