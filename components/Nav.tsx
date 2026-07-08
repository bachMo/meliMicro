"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Menu, X } from "lucide-react";
import { SITE } from "@/lib/config";

const LINKS = [
  { href: "/#episodes", label: "Épisodes" },
  { href: "/revues", label: "Revues" },
  { href: "/ecrits", label: "Écrits" },
  { href: "/njogonal-litteraire", label: "Njogonal littéraire" },
  { href: "/#a-propos", label: "À propos" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-lav-200/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <span className="grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-lav-400 to-lav-600 text-cream group-hover:scale-105 transition-transform">
            <Mic size={16} strokeWidth={2.25} />
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-ink">
            {SITE.name}
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-ink-soft">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-lav-600 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bouton hamburger mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="sm:hidden grid place-items-center w-9 h-9 rounded-full text-ink-soft hover:bg-lav-100 transition-colors"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Panneau mobile */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="sm:hidden overflow-hidden border-t border-lav-200/60 bg-cream"
          >
            <div className="flex flex-col px-5 py-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-base font-medium border-b border-lav-100 last:border-none transition-colors ${
                    pathname === link.href ? "text-lav-600" : "text-ink-soft"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}