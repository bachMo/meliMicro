"use client";

import { useEffect, useState } from "react";
import FeaturedEpisode from "@/components/FeaturedEpisode";
import EpisodeGrid from "@/components/EpisodeGrid";
import { Episode } from "@/lib/types";
import { fetchEpisodes } from "@/lib/podcast";
import { REFRESH_INTERVAL_MS } from "@/lib/config";

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const { episodes, isDemo } = await fetchEpisodes();
      if (!active) return;
      setEpisodes(episodes);
      setIsDemo(isDemo);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-ink-muted text-sm"></div>;
  }

  const [latest, ...rest] = episodes;

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-12 pb-2">
        <h1 className="font-display font-semibold text-3xl text-ink">Épisodes</h1>
        <p className="text-sm text-ink-muted mt-1">Tout le podcast, du premier au dernier.</p>
      </div>

      {isDemo && (
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-4">
          <p className="text-xs text-lav-600 bg-lav-100 border border-lav-200 rounded-xl px-4 py-3">
            Mode démonstration : connecte ton Google Sheet dans{" "}
            <code className="font-mono">lib/config.ts</code>.
          </p>
        </div>
      )}

      <div className="pt-8">{latest && <FeaturedEpisode episode={latest} />}</div>
      <EpisodeGrid episodes={rest} />
    </>
  );
}