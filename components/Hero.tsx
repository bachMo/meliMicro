"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
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
  ChevronDown,
} from "lucide-react";
import { SITE } from "@/lib/config";

const ORBIT_ICON_DEFS = [
  { Icon: Orbit, delay: 0 },
  { Icon: Heart, delay: 0.3 },
  { Icon: Zap, delay: 0.6 },
  { Icon: Music2, delay: 0.9 },
  { Icon: Search, delay: 1.2 },
  { Icon: Globe2, delay: 1.5 },
  { Icon: Lightbulb, delay: 1.8 },
  { Icon: BookOpen, delay: 2.1 },
];

// Rayon du cercle en % du conteneur — doit correspondre à l'anneau en
// pointillés (inset-[7%] -> rayon 43%) pour que les icônes tombent pile
// dessus, à équidistance les unes des autres.
const ORBIT_RADIUS = 43;

function orbitPosition(index: number, total: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  return {
    top: `${50 + ORBIT_RADIUS * Math.sin(angle)}%`,
    left: `${50 + ORBIT_RADIUS * Math.cos(angle)}%`,
  };
}

// Points dispersés repris du logo original, en discret dans le fond.
const SCATTER_DOTS = [
  { top: "8%", left: "12%", size: 5 },
  { top: "16%", left: "88%", size: 4 },
  { top: "42%", left: "6%", size: 3 },
  { top: "78%", left: "10%", size: 6 },
  { top: "88%", left: "92%", size: 4 },
  { top: "58%", left: "94%", size: 3 },
  { top: "6%", left: "48%", size: 3 },
];

// Variantes pour la révélation du titre, lettre par lettre.
const letterContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.15 },
  },
};

const letter: Variants = {
  hidden: { y: 44, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function AnimatedWord({ word, className }: { word: string; className?: string }) {
  return (
    <motion.span
      variants={letterContainer}
      initial="hidden"
      animate="show"
      className={`inline-flex overflow-hidden ${className ?? ""}`}
    >
      {word.split("").map((char, i) => (
        <motion.span key={i} variants={letter} className="inline-block">
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax : les éléments de fond et le cercle bougent à des vitesses
  // différentes du contenu pendant le scroll, pour un effet de profondeur.
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const circleY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const [word1, word2] = SITE.name.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32"
    >
      {/* fond doux, en parallax */}
      <div className="pointer-events-none absolute inset-0 grain" />
      <motion.div
        style={{ y: blobY1 }}
        className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-lav-200/50 blur-3xl animate-drift"
      />
      <motion.div
        style={{ y: blobY2, animationDelay: "-20s" }}
        className="pointer-events-none absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-lav-100/70 blur-3xl animate-drift"
      />
      {SCATTER_DOTS.map((dot, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-lav-300/70"
          style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size }}
        />
      ))}

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative mx-auto max-w-6xl px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full bg-lav-100 border border-lav-200 pl-2.5 pr-4 py-1.5 mb-6"
          >
            <span className="grid place-items-center w-5 h-5 rounded-full bg-lav-500 text-cream">
              <Mic size={11} strokeWidth={2.5} />
            </span>
            <span className="text-xs font-semibold text-lav-700 tracking-wide">
              Le podcast qui ne s&apos;interdit rien
            </span>
          </motion.div>

          <h1 className="font-display font-bold text-6xl sm:text-8xl leading-[0.9] text-ink">
            <AnimatedWord word={word1} />
            <br />
            <span className="relative inline-block italic font-medium text-lav-600">
              <AnimatedWord word={word2} />
              <svg
                viewBox="0 0 200 14"
                className="absolute left-0 -bottom-2 w-full h-3 text-lav-400"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 8 Q 50 2, 100 7 T 198 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                />
              </svg>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
            className="mt-8 text-lg text-ink-soft max-w-md leading-relaxed"
          >
            {SITE.tagline.charAt(0).toUpperCase() + SITE.tagline.slice(1)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="mt-9 flex items-center gap-4"
          >
            <a
              href="#episodes"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-6 py-3 text-sm font-semibold hover:bg-lav-700 transition-colors"
            >
              <Mic size={16} /> Écouter les épisodes
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          style={{ y: circleY, scale: circleScale }}
          className="relative mx-auto w-full max-w-md aspect-square"
        >
          {/* anneau d'orbite en pointillés, relie visuellement les icônes */}
          <div className="absolute inset-[7%] rounded-full border-2 border-dashed border-lav-300/70 animate-[spin_60s_linear_infinite]" />

          {ORBIT_ICON_DEFS.map(({ Icon, delay }, i) => {
            const { top, left } = orbitPosition(i, ORBIT_ICON_DEFS.length);
            return (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top, left }}
              >
                <motion.div
                  className="grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-cream border border-lav-200 shadow-sm text-lav-500"
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
              </div>
            );
          })}

          <div className="absolute inset-[16%] rounded-full bg-gradient-to-br from-lav-400 via-lav-500 to-lav-700 shadow-[0_30px_60px_-15px_rgba(107,95,181,0.45)] animate-breathe grid place-items-center">
            <div className="absolute inset-4 rounded-full bg-white/10 blur-xl" />
            <Mic
              size={64}
              strokeWidth={1.25}
              className="relative text-cream/95"
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#episodes"
        aria-label="Voir les épisodes"
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 items-center justify-center text-lav-400 hover:text-lav-600 transition-colors"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={22} strokeWidth={1.5} />
      </motion.a>
    </section>
  );
}