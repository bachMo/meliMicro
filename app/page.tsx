"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import FeaturedEpisode from "@/components/FeaturedEpisode";
import EpisodeGrid from "@/components/EpisodeGrid";
import { Episode } from "@/lib/types";
import { fetchEpisodes } from "@/lib/podcast";
import { REFRESH_INTERVAL_MS } from "@/lib/config";

export default function Home() {
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

  const [latest, ...rest] = episodes;

  return (
    <>
      <Hero />
      <AboutSection />
      {isDemo && !loading && (
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs text-lav-600 bg-lav-100 border border-lav-200 rounded-xl px-4 py-3">
            Mode démonstration : connecte ton Google Sheet dans{" "}
            <code className="font-mono">lib/config.ts</code> pour afficher les
            vrais épisodes.
          </p>
        </div>
      )}
      {loading ? (
        <div className="py-24 text-center text-ink-muted text-sm">
          Chargement des épisodes...
        </div>
      ) : (
        <>
          {latest && <FeaturedEpisode episode={latest} />}
          <EpisodeGrid episodes={rest} />
        </>
      )}
    </>
  );
}