"use client";

import { useMemo, useState } from "react";
import { Writing } from "@/lib/types";
import WritingCard from "./WritingCard";

export default function WritingGrid({ writings }: { writings: Writing[] }) {
  const [category, setCategory] = useState("Tous");

  const categories = useMemo(() => {
    const set = new Set(writings.map((w) => w.category));
    return ["Tous", ...Array.from(set)];
  }, [writings]);

  const filtered = useMemo(
    () => writings.filter((w) => category === "Tous" || w.category === category),
    [writings, category]
  );

  return (
    <section className="mx-auto max-w-4xl px-5 sm:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display font-semibold text-3xl text-ink">Écrits</h1>
        <p className="text-sm text-ink-muted mt-1">
          Poèmes, textes, réflexions — ce qui la traverse et qu&apos;elle a mis en mots.
        </p>
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
        <p className="text-ink-muted text-sm py-16 text-center">Rien dans cette catégorie pour l&apos;instant.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((writing, i) => (
            <WritingCard key={writing.slug} writing={writing} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}