"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap, SplitText } from "@/lib/gsap";

registerGsap();

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const title = titleRef.current;
      const root = rootRef.current;
      if (!title || !root || !ready || reduced) return;

      let split: SplitText | undefined;
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled || !titleRef.current) return;

        split = new SplitText(title, {
          type: "lines,words",
          linesClass: "split-line",
        });

        gsap.set(title, { opacity: 1 });
        const items = root.querySelectorAll("[data-hero-item]");
        gsap.from(split.words, {
          yPercent: 120,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.05,
        });
        gsap.from(items, {
          y: 28,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.35,
        });
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { dependencies: [ready, reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-20"
    >
      <p
        data-hero-item
        className="mb-8 text-[11px] uppercase tracking-[0.32em] text-muted"
      >
        Digital atelier / Est. 2026
      </p>
      <h1
        ref={titleRef}
        className={cn(
          "max-w-[14ch] font-serif text-[14vw] leading-[0.86] tracking-tight md:text-[9.5vw]",
          !reduced && "opacity-0",
        )}
      >
        We design websites that linger.
      </h1>
      <div
        data-hero-item
        className="mt-12 flex max-w-xl flex-col gap-6 text-sm leading-relaxed text-muted md:mt-16 md:flex-row md:items-end md:justify-between md:max-w-none"
      >
        <p className="max-w-sm">
          Smooth scrolling, cinematic page transitions, and motion that feels
          considered — built for brands that want more than a template.
        </p>
        <p className="text-[11px] uppercase tracking-[0.24em]">
          Scroll to explore
        </p>
      </div>
    </section>
  );
}
