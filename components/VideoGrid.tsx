"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { NjogonalVideo } from "@/lib/types";
import VideoCard from "./VideoCard";
import Pagination from "./Pagination";

const PAGE_SIZE = 10;

export default function VideoGrid({ videos }: { videos: NjogonalVideo[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.bookTitle.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    );
  }, [videos, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink">Ndiogonal littéraire</h1>
          <p className="text-sm text-ink-muted mt-1">
            Le club de lecture filmé, à visage découvert.
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
            placeholder="Rechercher une vidéo..."
            className="w-full rounded-full bg-white/70 border border-lav-200 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-lav-400 transition-shadow"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-muted text-sm py-16 text-center">Aucune vidéo ne correspond à cette recherche.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageItems.map((video, i) => (
              <VideoCard key={video.slug} video={video} index={i} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </section>
  );
}