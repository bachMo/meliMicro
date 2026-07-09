"use client";

import { useEffect, useState } from "react";
import ReviewGrid from "@/components/ReviewGrid";
import { Review } from "@/lib/types";
import { fetchReviews } from "@/lib/reviews";

export default function RevuesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews().then(({ reviews, isDemo }) => {
      setReviews(reviews);
      setIsDemo(isDemo);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-ink-muted text-sm"></div>;
  }

  return (
    <>
      {isDemo && (
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10">
          <p className="text-xs text-lav-600 bg-lav-100 border border-lav-200 rounded-xl px-4 py-3">
            Mode démonstration : connecte le Google Sheet des revues dans{" "}
            <code className="font-mono">lib/config.ts</code>.
          </p>
        </div>
      )}
      <ReviewGrid reviews={reviews} />
    </>
  );
}
