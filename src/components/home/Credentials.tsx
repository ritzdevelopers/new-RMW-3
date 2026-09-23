"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

const LOGO_REPEAT = 1;

/**
 * Visual shell for credentials. Scroll animation for "Ideas That Travel"
 * is driven by Route on `.proof-pin` so the ticker strip stays visible.
 */
export function Credentials() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || !reduced) return;

      const edge = root.querySelector(".proof-edge-top") as HTMLElement | null;
      const label = root.querySelector(
        ".proof-edge-label-travel",
      ) as HTMLElement | null;
      const marker = root.querySelector(
        ".proof-milestone",
      ) as HTMLElement | null;
      if (!edge || !label || !marker) return;

      const destinationX = Math.max(0, edge.clientWidth - 220 - 20 - 120);
      gsap.set(label, {
        x: destinationX,
        yPercent: -50,
        backgroundColor: "#e53e2a",
        color: "#ffffff",
        width: 220,
        height: 42,
        padding: "10px 20px",
      });
      gsap.set(marker, { autoAlpha: 1, y: 0 });
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const logos = root.querySelector<HTMLElement>(".proof-logos");
    if (!logos) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        logos.classList.toggle("is-paused", !entry.isIntersecting);
      },
      { rootMargin: "80px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [reduced]);

  const partners = Array.from(
    { length: LOGO_REPEAT },
    () => site.proof.partners,
  ).flat();

  return (
    <section ref={rootRef} className="proof" aria-label="Credentials">
      <div className="proof-edge proof-edge-top">
        <span className="proof-edge-road" aria-hidden />
        <span className="proof-edge-label proof-edge-label-gold proof-edge-label-travel">
          {site.proof.edge}
        </span>
      </div>

      <div className="proof-body">
        <div className="proof-stats">
          {site.proof.stats.map((stat) => (
            <div key={stat.label} className="proof-stat">
              <CountUp
                value={stat.value}
                suffix={stat.suffix}
                className="proof-stat-value"
              />
              <p className="proof-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="proof-logos">
          <div className="proof-logos-track" aria-hidden>
            {[...partners, ...partners].map((src, index) => (
              <figure key={`${src}-${index}`} className="proof-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="proof-rule" aria-hidden />

      <div className="proof-milestone" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/s2/distance.png" alt="" width={256} height={256} />
        <span className="proof-milestone-text">
          Ritz
          <br />
          Media
          <br />
          World
        </span>
      </div>
    </section>
  );
}
