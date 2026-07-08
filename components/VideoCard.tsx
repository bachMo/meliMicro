"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Clapperboard } from "lucide-react";
import { NjogonalVideo } from "@/lib/types";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function VideoCard({ video, index }: { video: NjogonalVideo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
    >
      <Link
        href={`/njogonal-litteraire/${video.slug}`}
        className="group block rounded-2xl bg-white/60 border border-lav-200/70 overflow-hidden hover:border-lav-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(107,95,181,0.35)]"
      >
        <div className="relative aspect-video bg-gradient-to-br from-lav-100 to-lav-200 overflow-hidden">
          {video.coverUrl ? (
            <Image
              src={video.coverUrl}
              alt={video.title}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full grid place-items-center">
              <Clapperboard size={36} strokeWidth={1.25} className="text-lav-400" />
            </div>
          )}
          <span className="absolute bottom-3 right-3 grid place-items-center w-11 h-11 rounded-full bg-cream/95 text-ink shadow-md">
            <Play size={16} fill="currentColor" className="ml-0.5" />
          </span>
        </div>

        <div className="p-5">
          <span className="text-xs text-lav-600 font-semibold uppercase tracking-wide">
            {video.bookTitle}
          </span>
          <h3 className="mt-2 font-display font-semibold text-lg text-ink leading-snug">
            {video.title}
          </h3>
          <p className="mt-2 text-sm text-ink-muted line-clamp-2 leading-relaxed">
            {video.description}
          </p>
          <p className="mt-4 text-xs text-ink-muted">{formatDate(video.date)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
