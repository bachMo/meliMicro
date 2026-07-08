"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Play, Pause, ExternalLink, Mic } from "lucide-react";
import { Episode } from "@/lib/types";
import { fetchEpisodes } from "@/lib/podcast";
import { usePlayer } from "@/context/PlayerContext";
import EpisodeRatings from "@/components/EpisodeRatings";
import EpisodeComments from "@/components/EpisodeComments";

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
  const [episode, setEpisode] = useState<Episode | null | undefined>(undefined);
  const [neighbours, setNeighbours] = useState<{ prev: Episode | null; next: Episode | null }>({
    prev: null,
    next: null,
  });
  const { current, isPlaying, play, toggle } = usePlayer();

  useEffect(() => {
    let active = true;
    fetchEpisodes().then(({ episodes }) => {
      if (!active) return;
      const index = episodes.findIndex((e) => e.slug === slug);
      setEpisode(index >= 0 ? episodes[index] : null);
      setNeighbours({
        prev: index >= 0 ? episodes[index + 1] ?? null : null,
        next: index > 0 ? episodes[index - 1] : null,
      });
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
        <Link href="/episodes" className="text-lav-600 text-sm font-semibold">
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
        href="/episodes"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-lav-600 transition-colors mb-8"
      >
        <ArrowLeft size={15} /> Tous les épisodes
      </Link>

      {/* Cover + titre fusionnés dans un même bloc */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-lav-100 to-lav-200 border border-lav-200/70">
        <div className="relative aspect-[16/9]">
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

        <div className="bg-cream p-6 sm:p-8">
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
              {showPause ? "Lecture en cours — voir le lecteur en bas" : "Écouter cet épisode"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-8 text-ink-soft leading-relaxed whitespace-pre-line">
        {episode.description}
      </p>

      <div className="mt-8">
        <EpisodeRatings slug={episode.slug} />
      </div>

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

      <EpisodeComments slug={episode.slug} />

      {(neighbours.prev || neighbours.next) && (
        <div className="mt-14 pt-8 border-t border-lav-200/60 grid grid-cols-2 gap-4">
          {neighbours.prev ? (
            <Link
              href={`/episode/${neighbours.prev.slug}`}
              className="group flex flex-col rounded-2xl border border-lav-200/70 p-4 hover:border-lav-400 transition-colors"
            >
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted mb-1">
                <ArrowLeft size={13} /> Précédent
              </span>
              <span className="text-sm font-semibold text-ink group-hover:text-lav-700 transition-colors line-clamp-2">
                {neighbours.prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {neighbours.next ? (
            <Link
              href={`/episode/${neighbours.next.slug}`}
              className="group flex flex-col rounded-2xl border border-lav-200/70 p-4 text-right hover:border-lav-400 transition-colors"
            >
              <span className="inline-flex items-center justify-end gap-1.5 text-xs text-ink-muted mb-1">
                Suivant <ArrowRight size={13} />
              </span>
              <span className="text-sm font-semibold text-ink group-hover:text-lav-700 transition-colors line-clamp-2">
                {neighbours.next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </article>
  );
}