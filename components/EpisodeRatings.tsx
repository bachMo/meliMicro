"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Sparkle } from "lucide-react";

const CONFETTI = Array.from({ length: 8 }, (_, i) => {
  const angle = (360 / 8) * i + (Math.random() * 20 - 10);
  const distance = 26 + Math.random() * 18;
  const rad = (angle * Math.PI) / 180;
  return { id: i, x: Math.cos(rad) * distance, y: Math.sin(rad) * distance };
});

export default function EpisodeRatings({ slug }: { slug: string }) {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [myRating, setMyRating] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(`meli-rating-${slug}`);
    return stored ? Number(stored) : null;
  });
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [justRated, setJustRated] = useState(false);

  useEffect(() => {
    fetch(`/api/episodes/${slug}/ratings`)
      .then((r) => r.json())
      .then((d) => {
        setAverage(d.average || 0);
        setCount(d.count || 0);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const submitRating = async (value: number) => {
    if (myRating || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/episodes/${slug}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setAverage(data.average);
      setCount(data.count);
      setMyRating(value);
      setJustRated(true);
      setTimeout(() => setJustRated(false), 700);
      localStorage.setItem(`meli-rating-${slug}`, String(value));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-2xl border border-lav-200/70 bg-white/60 p-5 flex items-center justify-between flex-wrap gap-4 overflow-visible">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={18}
              className={i <= Math.round(average) ? "text-lav-500" : "text-lav-200"}
              fill={i <= Math.round(average) ? "currentColor" : "none"}
            />
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-sm text-ink-muted">
          {loading ? (
            "..."
          ) : count > 0 ? (
            <>
              {average.toFixed(1)}
              <span className="w-0.5 h-0.5 rounded-full bg-ink-muted inline-block" />
              {count} avis
            </>
          ) : (
            "Pas encore noté"
          )}
        </span>
      </div>

      <div className="relative flex items-center gap-1">
        <AnimatePresence mode="wait">
          {myRating ? (
            <motion.span
              key="thanks"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="text-xs text-lav-600 font-semibold"
            >
              Merci pour ta note !
            </motion.span>
          ) : (
            <motion.span
              key="stars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1"
            >
              <span className="text-xs text-ink-muted mr-1 hidden sm:inline">Noter :</span>
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => submitRating(i)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  disabled={submitting}
                  aria-label={`Noter ${i} étoile${i > 1 ? "s" : ""}`}
                  className="p-0.5"
                >
                  <Star
                    size={20}
                    className={i <= hover ? "text-lav-500" : "text-lav-200"}
                    fill={i <= hover ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </motion.span>
          )}
        </AnimatePresence>

        {justRated &&
          CONFETTI.map((c) => (
            <motion.span
              key={c.id}
              className="absolute top-1/2 left-1/2 text-lav-400 pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
              animate={{ x: c.x, y: c.y, opacity: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Sparkle size={10} fill="currentColor" />
            </motion.span>
          ))}
      </div>
    </div>
  );
}