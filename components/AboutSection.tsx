import { SITE } from "@/lib/config";

const TONE = ["Douceur", "Intimité", "Sincérité", "Inclusivité", "Multi-facette"];

export default function AboutSection() {
  return (
    <section id="a-propos" className="relative py-12 sm:py-16 bg-lav-50 border-y border-lav-200/60">
      <div className="pointer-events-none absolute inset-0 grain opacity-60" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <div className="grid sm:grid-cols-[auto_1fr] gap-3 sm:gap-7">
          <p className="font-display italic text-5xl sm:text-6xl text-lav-300 leading-none select-none">
            &ldquo;
          </p>
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-lav-600 mb-3">
              Le concept
            </p>
            <p className="font-display text-xl sm:text-2xl leading-snug text-ink">
              {SITE.about}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {TONE.map((word) => (
                <span
                  key={word}
                  className="px-3.5 py-1 rounded-full bg-cream border border-lav-200 text-lav-700 text-xs font-semibold"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}