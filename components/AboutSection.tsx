import { SITE } from "@/lib/config";

const TONE = ["Douceur", "Intimité", "Sincérité", "Inclusivité", "Multi-facette"];

export default function AboutSection() {
  return (
    <section id="a-propos" className="mx-auto max-w-4xl px-5 sm:px-8 py-16">
      <p className="text-xs font-semibold tracking-[0.25em] uppercase text-lav-600 mb-4">
        Le concept
      </p>
      <p className="font-display text-2xl sm:text-3xl leading-snug text-ink">
        {SITE.about}
      </p>
      <div className="flex flex-wrap gap-2 mt-8">
        {TONE.map((word) => (
          <span
            key={word}
            className="px-3.5 py-1.5 rounded-full bg-lav-100 text-lav-700 text-xs font-semibold"
          >
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
