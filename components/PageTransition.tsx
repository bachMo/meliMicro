/* eslint-disable react-hooks/set-state-in-effect -- orchestration d'une séquence d'animation basée sur une mesure DOM réelle, cas d'usage légitime d'un effet. */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Mic, Sparkle } from "lucide-react";
import { ReactNode } from "react";

type Phase = "idle" | "out" | "burst" | "back";

const PARTICLE_COUNT = 12;
const OUT_MS = 420;
const BURST_MS = 380;
const BACK_MS = 420;

type Point = { x: number; y: number };

function makeParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (360 / PARTICLE_COUNT) * i + (Math.random() * 20 - 10);
    const distance = 55 + Math.random() * 50;
    const rad = (angle * Math.PI) / 180;
    return {
      id: i,
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
      size: 8 + Math.random() * 8,
      delay: Math.random() * 0.08,
    };
  });
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isFirstEffect = useRef(true);

  const [prevPathname, setPrevPathname] = useState(pathname);
  const [phase, setPhase] = useState<Phase>("idle");
  const [startPoint, setStartPoint] = useState<Point>({ x: 32, y: 32 });
  const [centerPoint, setCenterPoint] = useState<Point>({ x: 0, y: 0 });
  const [particles] = useState(makeParticles);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  // Cas sans animation (accessibilité) : on ajuste l'état pendant le rendu
  // plutôt que dans un effet, pour rester synchrone avec le changement de route.
  if (pathname !== prevPathname && reduceMotion) {
    setPrevPathname(pathname);
    setDisplayedChildren(children);
  }

  useEffect(() => {
    if (isFirstEffect.current) {
      isFirstEffect.current = false;
      return;
    }
    if (reduceMotion) return;

    const navIcon = document.getElementById("nav-mic-icon");
    const rect = navIcon?.getBoundingClientRect();
    setStartPoint(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: 32, y: 32 }
    );
    setCenterPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setPhase("out");

    const t1 = setTimeout(() => {
      setPhase("burst");
      setDisplayedChildren(children);
    }, OUT_MS);
    const t2 = setTimeout(() => setPhase("back"), OUT_MS + BURST_MS);
    const t3 = setTimeout(() => setPhase("idle"), OUT_MS + BURST_MS + BACK_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {displayedChildren}

      {phase !== "idle" && (
        <div className="fixed inset-0 z-70 pointer-events-none" style={{ zIndex: 70 }}>
          <motion.div
            className="absolute grid place-items-center rounded-full bg-gradient-to-br from-lav-400 via-lav-500 to-lav-700 text-cream shadow-[0_20px_50px_-10px_rgba(107,95,181,0.5)]"
            initial={{
              left: startPoint.x,
              top: startPoint.y,
              x: "-50%",
              y: "-50%",
              width: 32,
              height: 32,
            }}
            animate={
              phase === "out"
                ? { left: centerPoint.x, top: centerPoint.y, width: 64, height: 64, rotate: 360 }
                : phase === "burst"
                ? { left: centerPoint.x, top: centerPoint.y, width: 72, height: 72, rotate: 360 }
                : { left: startPoint.x, top: startPoint.y, width: 32, height: 32, rotate: 720 }
            }
            transition={
              phase === "back"
                ? { duration: BACK_MS / 1000, ease: [0.22, 1, 0.36, 1] }
                : { duration: OUT_MS / 1000, ease: [0.34, 1.56, 0.64, 1] }
            }
          >
            <Mic size={phase === "back" ? 16 : 28} strokeWidth={1.75} />
          </motion.div>

          {phase === "burst" &&
            particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute text-lav-400"
                style={{ left: centerPoint.x, top: centerPoint.y }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: p.delay, ease: "easeOut" }}
              >
                <Sparkle size={p.size} fill="currentColor" />
              </motion.span>
            ))}
        </div>
      )}
    </>
  );
}