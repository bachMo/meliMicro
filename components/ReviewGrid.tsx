"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Review } from "@/lib/types";
import ReviewCard from "./ReviewCard";

export default function ReviewGrid({ reviews }: { reviews: Review[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.bookTitle.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.verdict.toLowerCase().includes(q)
    );
  }, [reviews, query]);

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink">Revues</h1>
          <p className="text-sm text-ink-muted mt-1">
            Ce qu&apos;elle a lu, ce qu&apos;elle en a pensé, sans détour.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un livre..."
            className="w-full rounded-full bg-white/70 border border-lav-200 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-lav-400 transition-shadow"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-muted text-sm py-16 text-center">Aucune revue ne correspond à cette recherche.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((review, i) => (
            <ReviewCard key={review.slug} review={review} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
