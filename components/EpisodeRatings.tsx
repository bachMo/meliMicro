"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

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
      localStorage.setItem(`meli-rating-${slug}`, String(value));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-lav-200/70 bg-white/60 p-5 flex items-center justify-between flex-wrap gap-4">
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
        <span className="text-sm text-ink-muted">
          {loading
            ? "..."
            : count > 0
            ? `${average.toFixed(1)} · ${count} avis`
            : "Pas encore noté"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {myRating ? (
          <span className="text-xs text-lav-600 font-semibold">Merci pour ta note !</span>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}