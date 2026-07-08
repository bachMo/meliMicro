"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import FeaturedEpisode from "@/components/FeaturedEpisode";
import { Episode } from "@/lib/types";
import { fetchEpisodes } from "@/lib/podcast";

export default function Home() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchEpisodes().then(({ episodes, isDemo }) => {
      if (!active) return;
      setEpisodes(episodes);
      setIsDemo(isDemo);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const latest = episodes[0];

  return (
    <>
      <Hero />
      <AboutSection />

      {isDemo && !loading && (
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10">
          <p className="text-xs text-lav-600 bg-lav-100 border border-lav-200 rounded-xl px-4 py-3">
            Mode démonstration : connecte ton Google Sheet dans{" "}
            <code className="font-mono">lib/config.ts</code> pour afficher les
            vrais épisodes.
          </p>
        </div>
      )}

      {!loading && latest && (
        <section id="episodes" className="py-16 sm:py-20">
          <FeaturedEpisode episode={latest} />
          <div className="mx-auto max-w-6xl px-5 sm:px-8 mt-8 flex justify-center">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 text-sm font-semibold text-lav-700 hover:text-lav-600 transition-colors"
            >
              Voir tous les épisodes <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}