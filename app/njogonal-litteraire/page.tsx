"use client";

import { useEffect, useState } from "react";
import VideoGrid from "@/components/VideoGrid";
import { NjogonalVideo } from "@/lib/types";
import { fetchNjogonalVideos } from "@/lib/njogonal";

export default function NjogonalPage() {
  const [videos, setVideos] = useState<NjogonalVideo[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNjogonalVideos().then(({ videos, isDemo }) => {
      setVideos(videos);
      setIsDemo(isDemo);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-ink-muted text-sm">Chargement...</div>;
  }

  return (
    <>
      {isDemo && (
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10">
          <p className="text-xs text-lav-600 bg-lav-100 border border-lav-200 rounded-xl px-4 py-3">
            Mode démonstration : connecte le Google Sheet Njogonal dans{" "}
            <code className="font-mono">lib/config.ts</code>.
          </p>
        </div>
      )}
      <VideoGrid videos={videos} />
    </>
  );
}
