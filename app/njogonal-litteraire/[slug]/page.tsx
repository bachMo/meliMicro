"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { NjogonalVideo } from "@/lib/types";
import { fetchNjogonalVideos } from "@/lib/njogonal";
import VideoEmbed from "@/components/VideoEmbed";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function NjogonalVideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [video, setVideo] = useState<NjogonalVideo | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetchNjogonalVideos().then(({ videos }) => {
      if (!active) return;
      setVideo(videos.find((v) => v.slug === slug) ?? null);
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
          Retour à Njogonal littéraire
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

      <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-lav-100 to-lav-200 mb-8">
        <VideoEmbed url={video.videoUrl} title={video.title} />
      </div>

      <span className="text-xs text-lav-600 font-semibold uppercase tracking-wide">
        {video.bookTitle} · {formatDate(video.date)}
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
