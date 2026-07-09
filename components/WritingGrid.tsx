"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Writing } from "@/lib/types";
import WritingCard from "./WritingCard";
import Pagination from "./Pagination";

const PAGE_SIZE = 10;

export default function WritingGrid({ writings }: { writings: Writing[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(writings.map((w) => w.category));
    return ["Tous", ...Array.from(set)];
  }, [writings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return writings.filter((w) => {
      const matchesCategory = category === "Tous" || w.category === category;
      const matchesQuery =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [writings, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink">Écrits</h1>
          <p className="text-sm text-ink-muted mt-1">
            Poèmes, textes, réflexions — ce qui me traverse et que j'ai mis en mots.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un texte..."
            className="w-full rounded-full bg-white/70 border border-lav-200 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-lav-400 transition-shadow"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
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
        <p className="text-ink-muted text-sm py-16 text-center">Rien ne correspond à cette recherche.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-5">
            {pageItems.map((writing, i) => (
              <WritingCard key={writing.slug} writing={writing} index={i} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </section>
  );
}