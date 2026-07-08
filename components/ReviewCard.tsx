"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, BookOpen } from "lucide-react";
import { Review } from "@/lib/types";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= Math.round(rating) ? "text-lav-500" : "text-lav-200"}
          fill={i <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
    >
      <Link
        href={`/revues/${review.slug}`}
        className="group block rounded-2xl bg-white/60 border border-lav-200/70 overflow-hidden hover:border-lav-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(107,95,181,0.35)]"
      >
        <div className="relative aspect-[3/4] bg-gradient-to-br from-lav-100 to-lav-200 overflow-hidden">
          {review.coverUrl ? (
            <Image
              src={review.coverUrl}
              alt={review.bookTitle}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full grid place-items-center">
              <BookOpen size={36} strokeWidth={1.25} className="text-lav-400" />
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-lav-600 font-semibold uppercase tracking-wide">
              {review.genre}
            </span>
            <Stars rating={review.rating} />
          </div>
          <h3 className="mt-2 font-display font-semibold text-lg text-ink leading-snug">
            {review.bookTitle}
          </h3>
          <p className="text-sm text-ink-muted">{review.author}</p>
          <p className="mt-2 text-sm text-ink-muted line-clamp-2 leading-relaxed">
            {review.verdict}
          </p>
          <p className="mt-4 text-xs text-ink-muted">{formatDate(review.date)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
