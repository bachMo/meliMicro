"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play, Pause, ExternalLink, Mic } from "lucide-react";
import { Episode } from "@/lib/types";
import { fetchEpisodes } from "@/lib/podcast";
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

export default function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [episode, setEpisode] = useState<Episode | null | undefined>(
    undefined
  );
  const { current, isPlaying, play, toggle } = usePlayer();

  useEffect(() => {
    let active = true;
    fetchEpisodes().then(({ episodes }) => {
      if (!active) return;
      setEpisode(episodes.find((e) => e.slug === slug) ?? null);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (episode === undefined) {
    return (
      <div className="py-32 text-center text-ink-muted text-sm">
        Chargement...
      </div>
    );
  }

  if (episode === null) {
    return (
      <div className="py-32 text-center">
        <p className="text-ink-muted text-sm mb-4">
          Cet épisode n&apos;existe pas ou plus.
        </p>
        <Link href="/" className="text-lav-600 text-sm font-semibold">
          Retour aux épisodes
        </Link>
      </div>
    );
  }

  const isCurrent = current?.slug === episode.slug;
  const showPause = isCurrent && isPlaying;

  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
      <Link
        href="/#episodes"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-lav-600 transition-colors mb-8"
      >
        <ArrowLeft size={15} /> Tous les épisodes
      </Link>

      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-lav-100 to-lav-200 mb-8">
        {episode.coverUrl ? (
          <Image
            src={episode.coverUrl}
            alt={episode.title}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <Mic size={56} strokeWidth={1.25} className="text-lav-400" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-lav-600 font-semibold uppercase tracking-wide">
        <span>{episode.category}</span>
        <span className="text-lav-300">·</span>
        <span className="text-ink-muted normal-case tracking-normal font-medium">
          {formatDate(episode.date)}
        </span>
        {episode.duration && (
          <>
            <span className="text-lav-300">·</span>
            <span className="text-ink-muted normal-case tracking-normal font-medium">
              {episode.duration}
            </span>
          </>
        )}
      </div>

      <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-3 leading-tight">
        {episode.title}
      </h1>

      {episode.audioUrl && (
        <button
          onClick={() => (isCurrent ? toggle() : play(episode))}
          className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-ink text-cream pl-4 pr-6 py-3 text-sm font-semibold hover:bg-lav-700 transition-colors"
        >
          <span className="grid place-items-center w-7 h-7 rounded-full bg-lav-500">
            {showPause ? (
              <Pause size={13} fill="currentColor" />
            ) : (
              <Play size={13} fill="currentColor" className="ml-0.5" />
            )}
          </span>
          {showPause ? "En cours de lecture" : "Écouter cet épisode"}
        </button>
      )}

      <p className="mt-8 text-ink-soft leading-relaxed whitespace-pre-line">
        {episode.description}
      </p>

      {episode.links.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-lav-600 mb-3">
            Liens utiles
          </h2>
          <ul className="flex flex-col gap-2">
            {episode.links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-lav-600 transition-colors"
                >
                  <ExternalLink size={13} /> {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {episode.photos.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-lav-600 mb-3">
            Photos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {episode.photos.map((photo, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden bg-lav-100"
              >
                <Image
                  src={photo}
                  alt={`${episode.title} photo ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
