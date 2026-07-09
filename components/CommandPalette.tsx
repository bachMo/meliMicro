"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, BookOpen, Feather, Clapperboard, X } from "lucide-react";
import { fetchEpisodes } from "@/lib/podcast";
import { fetchReviews } from "@/lib/reviews";
import { fetchWritings } from "@/lib/writings";
import { fetchNjogonalVideos } from "@/lib/njogonal";

type ItemType = "episode" | "revue" | "ecrit" | "njogonal";

type Item = {
  id: string;
  type: ItemType;
  title: string;
  subtitle: string;
  href: string;
};

const TYPE_META: Record<ItemType, { label: string; Icon: typeof Mic }> = {
  episode: { label: "Épisode", Icon: Mic },
  revue: { label: "Revue", Icon: BookOpen },
  ecrit: { label: "Écrit", Icon: Feather },
  njogonal: { label: "Njogonal littéraire", Icon: Clapperboard },
};

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[] | null>(null);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[] | null>(null);

  const loadItems = useCallback(async () => {
    if (itemsRef.current) return;
    const [{ episodes }, { reviews }, { writings }, { videos }] = await Promise.all([
      fetchEpisodes(),
      fetchReviews(),
      fetchWritings(),
      fetchNjogonalVideos(),
    ]);
    const combined: Item[] = [
      ...episodes.map((e) => ({
        id: e.slug,
        type: "episode" as const,
        title: e.title,
        subtitle: e.category,
        href: `/episode/${e.slug}`,
      })),
      ...reviews.map((r) => ({
        id: r.slug,
        type: "revue" as const,
        title: r.bookTitle,
        subtitle: r.author,
        href: `/revues/${r.slug}`,
      })),
      ...writings.map((w) => ({
        id: w.slug,
        type: "ecrit" as const,
        title: w.title,
        subtitle: w.category,
        href: `/ecrits/${w.slug}`,
      })),
      ...videos.map((v) => ({
        id: v.slug,
        type: "njogonal" as const,
        title: v.title,
        subtitle: v.bookTitle,
        href: `/njogonal-litteraire/${v.slug}`,
      })),
    ];
    itemsRef.current = combined;
    setItems(combined);
  }, []);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelected(0);
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpenEvent = () => openPalette();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [openPalette]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8);
    return items
      .filter(
        (it) =>
          it.title.toLowerCase().includes(q) || it.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [items, query]);

  const go = (item: Item) => {
    setOpen(false);
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      e.preventDefault();
      go(filtered[selected]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-center pt-24 px-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-lg h-fit rounded-2xl bg-cream border border-lav-200 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-lav-100">
          <Search size={16} className="text-ink-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un épisode, une revue, un écrit..."
            className="command-palette-input flex-1 bg-transparent py-3.5 text-sm text-ink placeholder:text-ink-muted outline-none"
            style={{ outline: "none", boxShadow: "none" }}
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="shrink-0 text-ink-muted hover:text-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {items === null ? (
            <p className="text-sm text-ink-muted text-center py-8">Chargement...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-ink-muted text-center py-8">Aucun résultat.</p>
          ) : (
            filtered.map((item, i) => {
              const { label, Icon } = TYPE_META[item.type];
              return (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => go(item)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? "bg-lav-100" : ""
                  }`}
                >
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-lav-100 text-lav-600 shrink-0">
                    <Icon size={14} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink truncate">
                      {item.title}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-ink-muted">
                      {label}
                      <span className="w-0.5 h-0.5 rounded-full bg-ink-muted inline-block shrink-0" />
                      <span className="truncate">{item.subtitle}</span>
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}