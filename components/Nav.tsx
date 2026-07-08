"use client";

import Link from "next/link";
import { Mic } from "lucide-react";
import { SITE } from "@/lib/config";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-lav-200/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-lav-400 to-lav-600 text-cream group-hover:scale-105 transition-transform">
            <Mic size={16} strokeWidth={2.25} />
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-ink">
            {SITE.name}
          </span>
        </Link>
        <nav className="flex items-center gap-5 sm:gap-6 text-sm font-medium text-ink-soft">
          <Link href="/#episodes" className="hover:text-lav-600 transition-colors hidden sm:inline">
            Épisodes
          </Link>
          <Link href="/revues" className="hover:text-lav-600 transition-colors">
            Revues
          </Link>
          <Link href="/njogonal-litteraire" className="hover:text-lav-600 transition-colors">
            Njogonal littéraire
          </Link>
          <Link href="/#a-propos" className="hover:text-lav-600 transition-colors hidden sm:inline">
            À propos
          </Link>
        </nav>
      </div>
    </header>
  );
}
