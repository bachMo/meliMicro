"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, Mic } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const BAR_HEIGHTS = [6, 12, 8, 16, 10, 14, 7, 11, 9, 15, 6, 13];

export default function Player() {
  const { current, isPlaying, progress, currentTime, duration, error, toggle, seek } =
    usePlayer();

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
        >
          {error && (
            <div className="mb-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2">
              {error}
            </div>
          )}
          <div className="rounded-2xl bg-ink/95 backdrop-blur-md text-cream shadow-2xl px-4 py-3 flex items-center gap-4">
            <button
              onClick={toggle}
              aria-label={isPlaying ? "Pause" : "Lecture"}
              className={`shrink-0 grid place-items-center w-11 h-11 rounded-full bg-lav-500 hover:bg-lav-400 transition-colors ${
                isPlaying ? "animate-breathe" : ""
              }`}
            >
              {isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold truncate">
                  {current.title}
                </p>
                <div className="hidden sm:flex items-end gap-[3px] h-4">
                  {BAR_HEIGHTS.map((h, i) => (
                    <span
                      key={i}
                      className="w-[2.5px] rounded-full bg-lav-300"
                      style={{
                        height: h,
                        animation: isPlaying
                          ? `breathe ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate`
                          : "none",
                        opacity: isPlaying ? 1 : 0.35,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-lav-200 w-8 tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.001}
                  value={progress || 0}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="flex-1 accent-lav-300 h-1 cursor-pointer"
                />
                <span className="text-[10px] text-lav-200 w-8 tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <span className="hidden sm:grid shrink-0 place-items-center w-9 h-9 rounded-full bg-lav-600/60">
              <Mic size={14} />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
