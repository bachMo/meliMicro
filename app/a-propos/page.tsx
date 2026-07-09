import Image from "next/image";
import Link from "next/link";
import { BookOpen, Mic } from "lucide-react";
import { AIDA } from "@/lib/config";
import { driveImageUrl } from "@/lib/drive";

export default function AProposPage() {
  const photoUrl = AIDA.photoUrl ? driveImageUrl(AIDA.photoUrl, 400) : "";

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-lav-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24 text-center">
        <div className="mx-auto relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-lav-400 via-lav-500 to-lav-700 shadow-[0_30px_60px_-15px_rgba(107,95,181,0.45)] grid place-items-center overflow-hidden">
          {photoUrl ? (
            <Image src={photoUrl} alt={AIDA.name} fill unoptimized className="object-contain" />
          ) : (
            <span className="font-display text-5xl font-semibold text-cream/95">
              {AIDA.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          )}
        </div>

        <p className="mt-8 text-xs font-semibold tracking-[0.25em] uppercase text-lav-600">
          {AIDA.role}
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink mt-3 leading-tight">
          {AIDA.name}
        </h1>

        <p className="mt-8 text-lg text-ink-soft leading-relaxed max-w-xl mx-auto">
          {AIDA.bio}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {AIDA.passions.map((word) => (
            <span
              key={word}
              className="px-4 py-1.5 rounded-full bg-lav-100 text-lav-700 text-xs font-semibold"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <Link
            href="/episodes"
            className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-6 py-3 text-sm font-semibold hover:bg-lav-700 transition-colors"
          >
            <Mic size={16} /> Écouter Meli Micro
          </Link>
          <Link
            href="/revues"
            className="inline-flex items-center gap-2 rounded-full border border-lav-300 text-ink-soft px-6 py-3 text-sm font-semibold hover:border-lav-500 hover:text-lav-700 transition-colors"
          >
            <BookOpen size={16} /> Lire mes revues
          </Link>
        </div>
      </div>
    </div>
  );
}