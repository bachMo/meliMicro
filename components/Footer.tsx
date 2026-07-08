import { SITE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-lav-200/60 mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <p className="font-display text-xl font-semibold text-ink">
            {SITE.name}
          </p>
          <p className="text-sm text-ink-muted mt-1 max-w-sm">
            {SITE.description}
          </p>
        </div>
        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} {SITE.name}. Fait avec beaucoup d&apos;écoute.
        </p>
      </div>
    </footer>
  );
}
