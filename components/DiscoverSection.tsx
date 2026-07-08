import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Feather, Clapperboard } from "lucide-react";

const DISCOVER_ITEMS = [
  {
    href: "/revues",
    Icon: BookOpen,
    title: "Revues",
    description: "Ce qu'elle a lu, ce qu'elle en pense, sans détour.",
  },
  {
    href: "/ecrits",
    Icon: Feather,
    title: "Écrits",
    description: "Poèmes, textes, réflexions — ce qui la traverse.",
  },
  {
    href: "/njogonal-litteraire",
    Icon: Clapperboard,
    title: "Njogonal littéraire",
    description: "Le club de lecture filmé, à visage découvert.",
  },
];

export default function DiscoverSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
      <p className="text-xs font-semibold tracking-[0.25em] uppercase text-lav-600 mb-8 text-center">
        À découvrir aussi
      </p>
      <div className="grid sm:grid-cols-3 gap-5">
        {DISCOVER_ITEMS.map(({ href, Icon, title, description }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              href={href}
              className="group flex flex-col h-full rounded-2xl bg-white/60 border border-lav-200/70 p-7 hover:border-lav-400 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(107,95,181,0.35)]"
            >
              <span className="grid place-items-center w-11 h-11 rounded-full bg-lav-100 text-lav-600">
                <Icon size={19} strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-display font-semibold text-xl text-ink">
                {title}
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed flex-1">
                {description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-lav-600 group-hover:gap-2.5 transition-all">
                Découvrir <ArrowRight size={13} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}