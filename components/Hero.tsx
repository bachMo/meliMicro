"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Orbit,
  Zap,
  Music2,
  Search,
  Lightbulb,
  Globe2,
  BookOpen,
  Mic,
} from "lucide-react";
import { SITE } from "@/lib/config";

const ORBIT_ICONS = [
  { Icon: Orbit, top: "2%", left: "38%", delay: 0 },
  { Icon: Heart, top: "0%", left: "58%", delay: 0.3 },
  { Icon: Zap, top: "8%", left: "76%", delay: 0.6 },
  { Icon: Music2, top: "32%", left: "88%", delay: 0.9 },
  { Icon: Search, top: "58%", left: "88%", delay: 1.2 },
  { Icon: Globe2, top: "80%", left: "72%", delay: 1.5 },
  { Icon: Lightbulb, top: "62%", left: "8%", delay: 1.8 },
  { Icon: BookOpen, top: "30%", left: "4%", delay: 2.1 },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-28 sm:pt-24 sm:pb-36">
      {/* fond doux */}
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-lav-200/50 blur-3xl animate-drift" />
      <div
        className="pointer-events-none absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-lav-100/70 blur-3xl animate-drift"
        style={{ animationDelay: "-20s" }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-lav-600 mb-5">
            Le podcast
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[0.95] text-ink">
            {SITE.name.split(" ")[0]}
            <br />
            <span className="italic font-medium text-lav-600">
              {SITE.name.split(" ")[1]}
            </span>
          </h1>
          <p className="mt-6 text-lg text-ink-soft max-w-md leading-relaxed">
            {SITE.tagline.charAt(0).toUpperCase() + SITE.tagline.slice(1)}
          </p>
          <div className="mt-9 flex items-center gap-4">
            <a
              href="#episodes"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-6 py-3 text-sm font-semibold hover:bg-lav-700 transition-colors"
            >
              <Mic size={16} /> Écouter les épisodes
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto w-full max-w-md aspect-square"
        >
          {ORBIT_ICONS.map(({ Icon, top, left, delay }, i) => (
            <motion.div
              key={i}
              className="absolute grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-cream border border-lav-200 shadow-sm text-lav-500"
              style={{ top, left }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              <Icon size={17} strokeWidth={1.75} />
            </motion.div>
          ))}

          <div className="absolute inset-[16%] rounded-full bg-gradient-to-br from-lav-400 via-lav-500 to-lav-700 shadow-[0_30px_60px_-15px_rgba(107,95,181,0.45)] animate-breathe grid place-items-center">
            <div className="absolute inset-4 rounded-full bg-white/10 blur-xl" />
            <Mic
              size={64}
              strokeWidth={1.25}
              className="relative text-cream/95"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
