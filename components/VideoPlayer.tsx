"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Loader2,
  RotateCcw,
  RotateCw,
} from "lucide-react";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SKIP_SECONDS = 10;

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setCurrentTime(video.currentTime);
    const onLoaded = () => {
      setDuration(video.duration || 0);
      setIsLoading(false);
    };
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onEnded = () => setIsPlaying(false);
    const onErr = () => {
      setError(true);
      setIsLoading(false);
    };

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onErr);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onErr);
    };
  }, [src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const seek = (fraction: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = fraction * duration;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration || Infinity);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const changeSpeed = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = value;
    setSpeed(value);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space" || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      skip(-SKIP_SECONDS);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      skip(SKIP_SECONDS);
    } else if (e.key === "m") {
      toggleMute();
    } else if (e.key === "f") {
      toggleFullscreen();
    }
  };

  if (error) {
    return (
      <div className="relative w-full h-full grid place-items-center text-center px-6 bg-gradient-to-br from-lav-100 to-lav-200">
        <p className="text-sm text-ink-muted">
          Impossible de charger la vidéo. Vérifie que le fichier est bien
          partagé publiquement sur Drive.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full h-full bg-black group outline-none"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={title}
        playsInline
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {isLoading && !error && (
        <div className="absolute inset-0 grid place-items-center bg-black/20 pointer-events-none">
          <Loader2 size={32} className="text-cream animate-spin" />
        </div>
      )}

      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          aria-label="Lecture"
          className="absolute inset-0 grid place-items-center bg-black/20"
        >
          <span className="grid place-items-center w-16 h-16 rounded-full bg-cream/95 text-ink shadow-lg">
            <Play size={26} fill="currentColor" className="ml-1" />
          </span>
        </button>
      )}

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pt-10 pb-3">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={duration ? currentTime / duration : 0}
          onChange={(e) => seek(parseFloat(e.target.value))}
          className="w-full accent-lav-400 h-1 cursor-pointer mb-2.5"
        />
        <div className="flex items-center justify-between text-cream">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => skip(-SKIP_SECONDS)}
              aria-label={`Reculer de ${SKIP_SECONDS} secondes`}
              className="relative"
            >
              <RotateCcw size={19} />
              <span className="absolute inset-0 grid place-items-center text-[8px] font-bold translate-y-px">
                {SKIP_SECONDS}
              </span>
            </button>

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
            </button>

            <button
              onClick={() => skip(SKIP_SECONDS)}
              aria-label={`Avancer de ${SKIP_SECONDS} secondes`}
              className="relative"
            >
              <RotateCw size={19} />
              <span className="absolute inset-0 grid place-items-center text-[8px] font-bold translate-y-px">
                {SKIP_SECONDS}
              </span>
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
              className="hidden sm:block"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <span className="text-xs tabular-nums text-cream/80 hidden sm:inline">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <select
              value={speed}
              onChange={(e) => changeSpeed(parseFloat(e.target.value))}
              aria-label="Vitesse de lecture"
              className="bg-transparent text-xs font-semibold tabular-nums cursor-pointer outline-none [&>option]:text-ink"
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s}×
                </option>
              ))}
            </select>
            <button onClick={toggleFullscreen} aria-label="Plein écran">
              <Maximize size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}