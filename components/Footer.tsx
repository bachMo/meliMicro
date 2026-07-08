import { AtSign, Music2, Mail } from "lucide-react";
import { SITE, SOCIAL } from "@/lib/config";

const SOCIAL_LINKS = [
  { href: SOCIAL.instagram, label: "Instagram", Icon: AtSign },
  { href: SOCIAL.tiktok, label: "TikTok", Icon: Music2 },
  { href: SOCIAL.email ? `mailto:${SOCIAL.email}` : "", label: "Email", Icon: Mail },
].filter((link) => !!link.href);

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

        <div className="flex flex-col sm:items-end gap-3">
          {SOCIAL_LINKS.length > 0 && (
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-ink-soft hover:text-lav-600 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} {SITE.name}. Fait avec beaucoup d&apos;écoute.
          </p>
        </div>
      </div>
    </footer>
  );
}