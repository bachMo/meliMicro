"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Writing } from "@/lib/types";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function WritingCard({ writing, index }: { writing: Writing; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
    >
      <Link
        href={`/ecrits/${writing.slug}`}
        className="group block rounded-2xl bg-white/60 border border-lav-200/70 p-7 hover:border-lav-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(107,95,181,0.35)]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-lav-600 font-semibold uppercase tracking-wide">
            {writing.category}
          </span>
          <span className="text-xs text-ink-muted">{formatDate(writing.date)}</span>
        </div>
        <h3 className="mt-3 font-display font-semibold text-xl text-ink leading-snug group-hover:text-lav-700 transition-colors">
          {writing.title}
        </h3>
        <p className="mt-3 font-display italic text-ink-soft leading-relaxed line-clamp-3">
          {writing.excerpt}
        </p>
      </Link>
    </motion.div>
  );
}