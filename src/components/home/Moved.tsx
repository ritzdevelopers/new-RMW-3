"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Moved() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelectorAll("[data-moved-item]"),
        { autoAlpha: 0, y: 16 },
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

  return (
    <section ref={rootRef} className="moved" aria-label="Work that moved something">
      <div className="moved-inner">
        <div data-moved-item className="moved-copy">
          <h2 className="moved-title">
            {site.moved.title.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="moved-lede">{site.moved.lede}</p>
        </div>

        <div className="moved-stats">
          {site.moved.stats.map((stat) => (
            <div data-moved-item key={stat.label} className="moved-stat">
              <CountUp
                prefix={stat.prefix}
                value={stat.value}
                suffix={stat.suffix}
                className="moved-stat-value"
              />
              <p className="moved-stat-label">{stat.label}</p>
              <p className="moved-stat-note">{site.moved.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="moved-ribbon" aria-hidden />
    </section>
  );
}
