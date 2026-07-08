import Link from "next/link";
import { Mic, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-[70vh] grid place-items-center px-5 py-20">
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-lav-100/70 blur-3xl" />

      <div className="relative text-center max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-lav-400 via-lav-500 to-lav-700 shadow-[0_20px_40px_-15px_rgba(107,95,181,0.45)] grid place-items-center">
          <Mic size={30} strokeWidth={1.25} className="text-cream/95" />
        </div>

        <p className="mt-8 text-xs font-semibold tracking-[0.25em] uppercase text-lav-600">
          Erreur 404
        </p>
        <h1 className="mt-3 font-display font-bold text-3xl sm:text-4xl text-ink leading-tight">
          Ce micro-là n&apos;a jamais enregistré
        </h1>
        <p className="mt-4 text-ink-muted leading-relaxed">
          La page que tu cherches n&apos;existe pas, ou plus. Retourne
          écouter ce qui existe vraiment.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink text-cream px-6 py-3 text-sm font-semibold hover:bg-lav-700 transition-colors"
        >
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}