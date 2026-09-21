"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { roadbookPages } from "@/lib/roadbook";
import { cn } from "@/lib/cn";
import type { RoadbookFlipApi } from "@/components/home/RoadbookFlip";

const RoadbookFlip = dynamic(
  () => import("@/components/home/RoadbookFlip").then((mod) => mod.RoadbookFlip),
  {
    ssr: false,
    loading: () => (
      <div className="roadbook-loading">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/s6/cover.png" alt="RMW Roadbook" width={440} height={580} />
      </div>
    ),
  },
);

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" className="roadbook-chevron" aria-hidden>
      {dir === "prev" ? (
        <path
          d="M14.5 5.5 8 12l6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 5.5 16 12l-6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function Roadbook() {
  const apiRef = useRef<RoadbookFlipApi | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const [page, setPage] = useState(1);
  const total = roadbookPages.length;

  const onApi = useCallback((api: RoadbookFlipApi) => {
    apiRef.current = api;
  }, []);

  const goPrev = useCallback(() => {
    if (page <= 1) return;
    apiRef.current?.prev();
  }, [page]);

  const goNext = useCallback(() => {
    if (page >= total) return;
    apiRef.current?.next();
  }, [page, total]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  return (
    <section ref={rootRef} className="roadbook" aria-label="Work">
      <h2 className="roadbook-title">Work</h2>

      <div className="roadbook-stage">
        <button
          type="button"
          className={cn(
            "roadbook-nav",
            page <= 1 ? "roadbook-nav-light" : "roadbook-nav-dark",
          )}
          aria-label="Previous page"
          disabled={page <= 1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={goPrev}
        >
          <Chevron dir="prev" />
        </button>

        <div className="roadbook-viewport">
          <RoadbookFlip onPage={setPage} onApi={onApi} />
        </div>

        <button
          type="button"
          className={cn(
            "roadbook-nav",
            page >= total ? "roadbook-nav-light" : "roadbook-nav-dark",
          )}
          aria-label="Next page"
          disabled={page >= total}
          onMouseDown={(event) => event.preventDefault()}
          onClick={goNext}
        >
          <Chevron dir="next" />
        </button>
      </div>

      <p className="roadbook-count" aria-live="polite">
        {page} / {total}
      </p>
    </section>
  );
}
