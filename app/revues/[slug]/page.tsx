"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, BookOpen, ExternalLink } from "lucide-react";
import { Review } from "@/lib/types";
import { fetchReviews } from "@/lib/reviews";
import ShareButton from "@/components/ShareButton";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-1 bg-cream rounded-full px-2.5 py-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={18}
          className={i <= Math.round(rating) ? "text-lav-500" : "text-lav-200"}
          fill={i <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [review, setReview] = useState<Review | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetchReviews().then(({ reviews }) => {
      if (!active) return;
      setReview(reviews.find((r) => r.slug === slug) ?? null);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (review === undefined) {
    return <div className="py-32 text-center text-ink-muted text-sm">Chargement...</div>;
  }

  if (review === null) {
    return (
      <div className="py-32 text-center">
        <p className="text-ink-muted text-sm mb-4">Cette revue n&apos;existe pas ou plus.</p>
        <Link href="/revues" className="text-lav-600 text-sm font-semibold">
          Retour aux revues
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/revues"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-lav-600 transition-colors"
        >
          <ArrowLeft size={15} /> Toutes les revues
        </Link>
        <ShareButton title={review.bookTitle} />
      </div>

      <div className="rounded-3xl bg-lav-50 border border-lav-200/60 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="relative w-40 aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-lav-100 to-lav-200 shrink-0">
            {review.coverUrl ? (
              <Image src={review.coverUrl} alt={review.bookTitle} fill unoptimized className="object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center">
                <BookOpen size={32} strokeWidth={1.25} className="text-lav-400" />
              </div>
            )}
          </div>

          <div>
            <span className="flex items-center gap-1.5 text-xs text-lav-600 font-semibold uppercase tracking-wide">
              {review.genre}
              <span className="w-0.5 h-0.5 rounded-full bg-lav-600 inline-block" />
              {formatDate(review.date)}
            </span>
            <h1 className="font-display font-bold text-3xl text-ink mt-2 leading-tight">
              {review.bookTitle}
            </h1>
            <p className="text-ink-muted mt-1">{review.author}</p>
            <div className="mt-5">
              <Stars rating={review.rating} />
            </div>
            <p className="mt-5 font-display italic text-lg text-ink-soft">{review.verdict}</p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-ink-soft leading-relaxed whitespace-pre-line">{review.content}</p>

      {review.links.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-lav-600 mb-3">
            Liens utiles
          </h2>
          <ul className="flex flex-col gap-2">
            {review.links.map((link, i) => (
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