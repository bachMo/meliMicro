"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share2, Link2, Check } from "lucide-react";

function shareTargets(url: string, title: string) {
  return [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
    },
    {
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];
}

export default function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* la personne a annulé le partage, rien à faire */
      }
      return;
    }
    setOpen((v) => !v);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-full border border-lav-300 text-ink-soft px-4 py-2 text-sm font-semibold hover:border-lav-500 hover:text-lav-700 transition-colors"
      >
        <Share2 size={15} /> Partager
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 z-50 w-52 rounded-2xl bg-cream border border-lav-200 shadow-xl overflow-hidden"
            >
              {shareTargets(
                typeof window !== "undefined" ? window.location.href : "",
                title
              ).map((t) => (
                <a
                  key={t.label}
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-lav-100 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lav-400 shrink-0" />
                  {t.label}
                </a>
              ))}
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-lav-100 transition-colors border-t border-lav-100"
              >
                {copied ? (
                  <Check size={14} className="text-lav-600" />
                ) : (
                  <Link2 size={14} />
                )}
                {copied ? "Copié !" : "Copier le lien"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}