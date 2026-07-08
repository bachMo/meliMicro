"use client";

import { useEffect, useState } from "react";
import WritingGrid from "@/components/WritingGrid";
import { Writing } from "@/lib/types";
import { fetchWritings } from "@/lib/writings";

export default function EcritsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWritings().then(({ writings, isDemo }) => {
      setWritings(writings);
      setIsDemo(isDemo);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-ink-muted text-sm">Chargement...</div>;
  }

  return (
    <>
      {isDemo && (
        <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-10">
          <p className="text-xs text-lav-600 bg-lav-100 border border-lav-200 rounded-xl px-4 py-3">
            Mode démonstration : connecte le Google Sheet des écrits dans{" "}
            <code className="font-mono">lib/config.ts</code>.
          </p>
        </div>
      )}
      <WritingGrid writings={writings} />
    </>
  );
}