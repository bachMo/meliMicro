"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, BookOpen, ArrowRight } from "lucide-react";
import { NjogonalVideo, Review } from "@/lib/types";
import { fetchNjogonalVideos } from "@/lib/njogonal";
import { fetchReviews } from "@/lib/reviews";
import VideoEmbed from "@/components/VideoEmbed";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// Rapproche la vidéo d'une revue existante si le titre du livre correspond.
function findMatchingReview(bookTitle: string, reviews: Review[]): Review | null {
  const normalized = bookTitle.toLowerCase();
  return (
    reviews.find(
      (r) =>
        normalized.includes(r.bookTitle.toLowerCase()) ||
        r.bookTitle.toLowerCase().includes(normalized.split("—")[0].trim())
    ) ?? null
  );
}

export default function NjogonalVideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [video, setVideo] = useState<NjogonalVideo | null | undefined>(undefined);
  const [matchingReview, setMatchingReview] = useState<Review | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([fetchNjogonalVideos(), fetchReviews()]).then(([{ videos }, { reviews }]) => {
      if (!active) return;
      const found = videos.find((v) => v.slug === slug) ?? null;
      setVideo(found);
      if (found?.bookTitle) setMatchingReview(findMatchingReview(found.bookTitle, reviews));
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (video === undefined) {
    return <div className="py-32 text-center text-ink-muted text-sm">Chargement...</div>;
  }

  if (video === null) {
    return (
      <div className="py-32 text-center">
        <p className="text-ink-muted text-sm mb-4">Cette vidéo n&apos;existe pas ou plus.</p>
        <Link href="/njogonal-litteraire" className="text-lav-600 text-sm font-semibold">
          Retour à Ndiogonal littéraire
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
      <Link
        href="/njogonal-litteraire"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-lav-600 transition-colors mb-8"
      >
        <ArrowLeft size={15} /> Toutes les vidéos
      </Link>

      <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-lav-100 to-lav-200 mb-6">
        <VideoEmbed url={video.videoUrl} title={video.title} poster={video.coverUrl} />
      </div>

      {video.bookTitle && (
        <Link
          href={matchingReview ? `/revues/${matchingReview.slug}` : "#"}
          className={`group flex items-center gap-3 rounded-2xl border border-lav-200/70 bg-lav-50 px-4 py-3 mb-6 ${
            matchingReview ? "hover:border-lav-400 transition-colors" : "pointer-events-none"
          }`}
        >
          <span className="grid place-items-center w-9 h-9 rounded-full bg-cream text-lav-600 shrink-0">
            <BookOpen size={16} strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-lav-600">
              Livre discuté
            </p>
            <p className="text-sm font-semibold text-ink truncate">{video.bookTitle}</p>
          </div>
          {matchingReview && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-lav-600 shrink-0 group-hover:gap-1.5 transition-all">
              Voir la revue <ArrowRight size={13} />
            </span>
          )}
        </Link>
      )}

      <span className="text-xs text-lav-600 font-semibold uppercase tracking-wide">
        {formatDate(video.date)}
      </span>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-2 leading-tight">
        {video.title}
      </h1>
      <p className="mt-6 text-ink-soft leading-relaxed whitespace-pre-line">{video.description}</p>

      {video.links.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-lav-600 mb-3">
            Liens utiles
          </h2>
          <ul className="flex flex-col gap-2">
            {video.links.map((link, i) => (
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
    </article>
  );
}