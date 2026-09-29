"use client";

import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { roadbookPages } from "@/lib/roadbook";
import { cn } from "@/lib/cn";
import type { RoadbookFlipApi } from "@/components/home/RoadbookFlip";

registerGsap();
gsap.registerPlugin(useGSAP);

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
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top 90%",
          end: "top 10%",
          scrub: 1,
        },
      });

      tl.fromTo(
        "[data-roadbook-title]",
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.35 },
        0,
      )
        .fromTo(
          "[data-roadbook-book]",
          {
            autoAlpha: 0,
            yPercent: 70,
            rotateX: 48,
            scale: 0.78,
            transformPerspective: 1600,
            transformOrigin: "50% 100%",
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          0,
        )
        .fromTo(
          "[data-roadbook-nav]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3, stagger: 0.05 },
          0.7,
        )
        .fromTo(
          "[data-roadbook-count]",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.3 },
          0.75,
        );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

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
      <h2 data-roadbook-title className="roadbook-title">
        Work
      </h2>

      <div className="roadbook-stage">
        <button
          type="button"
          data-roadbook-nav
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

        <div data-roadbook-book className="roadbook-viewport">
          <RoadbookFlip onPage={setPage} onApi={onApi} />
        </div>

        <button
          type="button"
          data-roadbook-nav
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

      <p data-roadbook-count className="roadbook-count" aria-live="polite">
        {page} / {total}
      </p>
    </section>
  );
}
