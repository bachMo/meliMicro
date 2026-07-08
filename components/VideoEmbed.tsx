"use client";

import { Clapperboard } from "lucide-react";
import { videoEmbedUrl } from "@/lib/video";

export default function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = videoEmbedUrl(url);

  if (!embed) {
    return (
      <div className="w-full h-full grid place-items-center bg-gradient-to-br from-lav-100 to-lav-200">
        <Clapperboard size={40} strokeWidth={1.25} className="text-lav-400" />
      </div>
    );
  }

  return (
    <iframe
      src={embed.src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  );
}
