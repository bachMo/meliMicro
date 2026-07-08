"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause, Mic } from "lucide-react";
import { Episode } from "@/lib/types";
import { usePlayer } from "@/context/PlayerContext";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function FeaturedEpisode({ episode }: { episode: Episode }) {
  const { current, isPlaying, play, toggle } = usePlayer();
  const isCurrent = current?.slug === episode.slug;
  const showPause = isCurrent && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrent) toggle();
    else play(episode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-6xl px-5 sm:px-8"
    >
      <p className="text-xs font-semibold tracking-[0.25em] uppercase text-lav-600 mb-4">
        Dernier épisode
      </p>
      <Link
        href={`/episode/${episode.slug}`}
        className="group grid sm:grid-cols-[1.1fr_1fr] gap-0 rounded-3xl bg-white/60 border border-lav-200/70 overflow-hidden hover:border-lav-400 transition-colors duration-300 hover:shadow-[0_30px_60px_-25px_rgba(107,95,181,0.4)]"
      >
        <div className="relative aspect-[16/10] sm:aspect-auto bg-gradient-to-br from-lav-100 to-lav-200 overflow-hidden">
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
              <Mic size={52} strokeWidth={1.25} className="text-lav-400" />
            </div>
          )}

          {episode.audioUrl && (
            <button
              onClick={handlePlayClick}
              aria-label={showPause ? "Mettre en pause" : "Écouter l'épisode"}
              className="absolute bottom-4 right-4 grid place-items-center w-14 h-14 rounded-full bg-cream/95 text-ink shadow-md hover:scale-105 transition-transform"
            >
              {showPause ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          )}
        </div>

        <div className="p-7 sm:p-10 flex flex-col justify-center">
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
          <h3 className="mt-3 font-display font-semibold text-2xl sm:text-3xl text-ink leading-snug">
            {episode.title}
          </h3>
          <p className="mt-3 text-ink-muted leading-relaxed line-clamp-3">
            {episode.description}
          </p>
          <p className="mt-5 text-xs text-ink-muted">{formatDate(episode.date)}</p>
        </div>
      </Link>
    </motion.div>
  );
}