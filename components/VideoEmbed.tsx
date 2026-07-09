"use client";

import { Clapperboard } from "lucide-react";
import { resolveVideoSource } from "@/lib/video";
import VideoPlayer from "./VideoPlayer";

export default function VideoEmbed({
  url,
  title,
  poster,
}: {
  url: string;
  title: string;
  poster?: string;
}) {
  const source = resolveVideoSource(url);

  if (!source) {
    return (
      <div className="w-full h-full grid place-items-center bg-gradient-to-br from-lav-100 to-lav-200">
        <Clapperboard size={40} strokeWidth={1.25} className="text-lav-400" />
      </div>
    );
  }

  if (source.type === "file") {
    return <VideoPlayer src={source.src} poster={poster} title={title} />;
  }

  return (
    <iframe
      src={source.src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  );
}