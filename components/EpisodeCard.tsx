"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause, Mic, Star } from "lucide-react";
import { Episode } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EpisodeCard({
  episode,
  index,
}: {
  episode: Episode;
  index: number;
}) {
  const { current, isPlaying, play, toggle } = usePlayer();
  const isCurrent = current?.slug === episode.slug;
  const showPause = isCurrent && isPlaying;

  const [rating, setRating] = useState<{ average: number; count: number } | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/episodes/${episode.slug}/ratings`)
      .then((r) => r.json())
      .then((d) => {
        if (active && d.count > 0) setRating({ average: d.average, count: d.count });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [episode.slug]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrent) toggle();
    else play(episode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="group"
    >
      <Link
        href={`/episode/${episode.slug}`}
        className="block rounded-2xl bg-white/60 border border-lav-200/70 overflow-hidden hover:border-lav-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(107,95,181,0.35)]"
      >
        <div className="relative aspect-[4/3] bg-gradient-to-br from-lav-100 to-lav-200 overflow-hidden">
          {episode.coverUrl ? (
            <Image
              src={episode.coverUrl}
              alt={episode.title}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full grid place-items-center">
              <Mic size={40} strokeWidth={1.25} className="text-lav-400" />
            </div>
          )}

          {episode.audioUrl && (
            <button
              onClick={handlePlayClick}
              aria-label={showPause ? "Mettre en pause" : "Écouter l'épisode"}
              className="absolute bottom-3 right-3 grid place-items-center w-11 h-11 rounded-full bg-cream/95 text-ink shadow-md hover:scale-105 transition-transform"
            >
              {showPause ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-lav-600 font-semibold uppercase tracking-wide">
            <span>{episode.category}</span>
            {episode.duration && (
              <>
                <span className="text-lav-300">·</span>
                <span className="text-ink-muted normal-case tracking-normal font-medium">
                  {episode.duration}
                </span>
              </>
            )}
          </div>
          <h3 className="mt-2 font-display font-semibold text-lg text-ink leading-snug">
            {episode.title}
          </h3>
          <p className="mt-2 text-sm text-ink-muted line-clamp-2 leading-relaxed">
            {episode.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-ink-muted">{formatDate(episode.date)}</p>
            {rating && (
              <div className="flex items-center gap-1.5">
                <Star size={12} className="text-lav-500" fill="currentColor" />
                <span className="text-xs text-ink-muted flex items-center gap-1.5">
                  {rating.average.toFixed(1)}
                  <span className="w-1 h-1 rounded-full bg-ink-muted inline-block" />
                  {rating.count}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}