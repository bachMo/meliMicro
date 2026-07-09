"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Writing } from "@/lib/types";
import { fetchWritings } from "@/lib/writings";
import ShareButton from "@/components/ShareButton";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-10 text-lav-300">
      <span className="w-10 h-px bg-lav-200" />
      <span className="w-1.5 h-1.5 rounded-full bg-lav-300" />
      <span className="w-10 h-px bg-lav-200" />
    </div>
  );
}

export default function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [writing, setWriting] = useState<Writing | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetchWritings().then(({ writings }) => {
      if (!active) return;
      setWriting(writings.find((w) => w.slug === slug) ?? null);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (writing === undefined) {
    return <div className="py-32 text-center text-ink-muted text-sm">Chargement...</div>;
  }

  if (writing === null) {
    return (
      <div className="py-32 text-center">
        <p className="text-ink-muted text-sm mb-4">Ce texte n&apos;existe pas ou plus.</p>
        <Link href="/ecrits" className="text-lav-600 text-sm font-semibold">
          Retour aux écrits
        </Link>
      </div>
    );
  }

  const isPoem = writing.category.toLowerCase().includes("poème");

  return (
    <div className={isPoem ? "relative overflow-hidden" : ""}>
      {isPoem && (
        <>
          <div className="pointer-events-none absolute inset-0 grain" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-lav-100/60 blur-3xl" />
        </>
      )}

      <article className="relative mx-auto max-w-2xl px-5 sm:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/ecrits"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-lav-600 transition-colors"
          >
            <ArrowLeft size={15} /> Tous les écrits
          </Link>
          <ShareButton title={writing.title} />
        </div>

        <div className={isPoem ? "text-center" : ""}>
          <span
            className={`flex items-center gap-1.5 text-xs text-lav-600 font-semibold uppercase tracking-wide ${
              isPoem ? "justify-center" : ""
            }`}
          >
            {writing.category}
            <span className="w-0.5 h-0.5 rounded-full bg-lav-600 inline-block" />
            {formatDate(writing.date)}
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink mt-3 leading-tight">
            {writing.title}
          </h1>
        </div>

        {isPoem && <Ornament />}

        <div
          className={
            isPoem
              ? "font-display italic text-xl text-ink-soft leading-loose whitespace-pre-line text-center"
              : "mt-10 text-ink-soft leading-relaxed whitespace-pre-line"
          }
        >
          {writing.content}
        </div>

        {isPoem && <Ornament />}

        {writing.links.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-lav-600 mb-3">
              Liens utiles
            </h2>
            <ul className="flex flex-col gap-2">
              {writing.links.map((link, i) => (
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
    </div>
  );
}