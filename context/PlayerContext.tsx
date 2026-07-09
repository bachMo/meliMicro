"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Episode } from "@/lib/types";
import { driveAudioCandidates } from "@/lib/drive";

type PlayerContextType = {
  current: Episode | null;
  isPlaying: boolean;
  progress: number; // 0 to 1
  duration: number;
  currentTime: number;
  error: string | null;
  speed: number;
  play: (episode: Episode) => void;
  toggle: () => void;
  seek: (fraction: number) => void;
  skip: (seconds: number) => void;
  setSpeed: (value: number) => void;
  close: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

const ERROR_MESSAGES: Record<number, string> = {
  1: "Lecture interrompue.",
  2: "Réseau interrompu pendant le chargement.",
  3: "Le fichier audio est corrompu ou dans un format non supporté.",
  4: "Impossible d'accéder au fichier — vérifie que le lien Drive est bien partagé en \"Tous les utilisateurs disposant du lien\".",
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const candidatesRef = useRef<string[]>([]);
  const candidateIndexRef = useRef(0);
  const [current, setCurrent] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [speed, setSpeedState] = useState(1);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnd = () => setIsPlaying(false);
    const onError = () => {
      const candidates = candidatesRef.current;
      const nextIndex = candidateIndexRef.current + 1;

      if (nextIndex < candidates.length) {
        console.warn(
          `[Player] Échec du lien ${candidateIndexRef.current + 1}/${candidates.length}, tentative avec le suivant...`,
          audio.src
        );
        candidateIndexRef.current = nextIndex;
        audio.src = candidates[nextIndex];
        audio.play().catch(() => {});
        return;
      }

      const code = audio.error?.code;
      const message =
        (code && ERROR_MESSAGES[code]) || "Impossible de lire ce fichier audio.";
      console.error(
        `[Player] Tous les formats de lien ont échoué (code ${code}) pour`,
        audio.src,
        "-",
        message
      );
      setError(message);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, []);

  const play = (episode: Episode) => {
    const audio = audioRef.current;
    if (!audio || !episode.audioUrl) return;

    setError(null);
    if (current?.slug !== episode.slug) {
      const candidates = driveAudioCandidates(episode.audioUrl);
      candidatesRef.current = candidates;
      candidateIndexRef.current = 0;
      audio.src = candidates[0] || episode.audioUrl;
      audio.playbackRate = speed;
      setCurrent(episode);
      setCurrentTime(0);
    }
    audio.play().catch(() => {
      /* onError se charge déjà d'afficher le message */
    });
    setIsPlaying(true);
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const seek = (fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = fraction * duration;
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration || Infinity);
  };

  const setSpeed = (value: number) => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = value;
    setSpeedState(value);
  };

  const close = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setCurrent(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        current,
        isPlaying,
        progress: duration ? currentTime / duration : 0,
        duration,
        currentTime,
        error,
        speed,
        play,
        toggle,
        seek,
        skip,
        setSpeed,
        close,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}