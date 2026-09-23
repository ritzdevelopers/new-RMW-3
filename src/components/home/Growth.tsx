"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Growth() {
  const rootRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();
  const [active, setActive] = useState(0);
  const slide = site.growth.slides[active];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelectorAll("[data-growth-item]"),
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%" },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  useGSAP(
    () => {
      const copy = copyRef.current;
      if (!copy || reduced) return;

      gsap.fromTo(
        copy,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    },
    { dependencies: [active, reduced] },
  );

  return (
    <section ref={rootRef} className="growth" aria-label="Growth strategies">
      <div className="ticker-pattern growth-pattern" aria-hidden />
      <div className="growth-body">
        <div className="growth-art" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/s5/highway.jpg" alt="" width={1024} height={576} />
        </div>

        <div data-growth-item className="growth-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={slide.id}
            src={slide.image ?? "/s5/banner-hoarding.png"}
            alt="Digital marketing"
            width={1024}
            height={682}
          />
        </div>

        <div className="growth-road" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/s5/highway.jpg" alt="" width={1024} height={576} />
        </div>

        <div className="growth-inner">
          <div ref={copyRef} className="growth-copy">
            <h2 data-growth-item className="growth-title">
              {slide.title}
            </h2>
            <ul data-growth-item className="growth-list">
              {slide.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <TransitionLink
              data-growth-item
              href={site.growth.href}
              className="growth-btn"
            >
              <span>{site.growth.cta}</span>
            </TransitionLink>
            <div
              data-growth-item
              className="growth-dots"
              role="tablist"
              aria-label="Capability slides"
            >
              {site.growth.slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-label={item.title.replace(/\n/g, " ")}
                  aria-selected={index === active}
                  className={
                    index === active
                      ? "growth-dot growth-dot-active"
                      : "growth-dot"
                  }
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ticker-pattern growth-pattern" aria-hidden />
    </section>
  );
}
