"use client";

import { NjogonalVideo } from "@/lib/types";
import VideoCard from "./VideoCard";

export default function VideoGrid({ videos }: { videos: NjogonalVideo[] }) {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display font-semibold text-3xl text-ink">Ndiogonal littéraire</h1>
        <p className="text-sm text-ink-muted mt-1">
          Le club de lecture filmé, à visage découvert.
        </p>
      </div>

      {videos.length === 0 ? (
        <p className="text-ink-muted text-sm py-16 text-center">Aucune vidéo pour le moment.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <VideoCard key={video.slug} video={video} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
