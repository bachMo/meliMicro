"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";

type Comment = { id: string; name: string; text: string; createdAt: string };

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function EpisodeComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const load = () => {
    fetch(`/api/episodes/${slug}/comments`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/episodes/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Impossible d'envoyer le commentaire.");
        return;
      }
      const data = await res.json();
      setText("");
      setHighlightId(data.comment?.id ?? null);
      setTimeout(() => setHighlightId(null), 1600);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-lav-600 mb-4 flex items-center gap-2">
        <MessageCircle size={14} /> Commentaires{comments.length > 0 && ` (${comments.length})`}
      </h2>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-lav-200/70 bg-white/60 p-4 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ton prénom (facultatif)"
          maxLength={40}
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none mb-2"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ton avis sur cet épisode..."
          maxLength={500}
          rows={3}
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none resize-none border-t border-lav-100 pt-2"
        />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink text-cream px-4 py-2 text-xs font-semibold hover:bg-lav-700 transition-colors disabled:opacity-50"
          >
            <Send size={13} /> Publier
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-ink-muted">Chargement des commentaires...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-muted">Sois le premier à laisser un avis.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {comments.map((c) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  backgroundColor:
                    c.id === highlightId
                      ? ["var(--lav-100)", "var(--lav-100)", "rgba(255,255,255,0.6)"]
                      : "rgba(255,255,255,0.6)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-2xl border border-lav-200/70 p-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-ink">{c.name}</span>
                  <span className="text-xs text-ink-muted">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{c.text}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}