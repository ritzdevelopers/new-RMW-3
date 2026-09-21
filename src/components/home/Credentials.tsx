"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

const LOGO_REPEAT = 4;
const MARKER_RESERVE = 120;

export function Credentials() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const edge = root.querySelector(".proof-edge-top") as HTMLElement | null;
      const label = root.querySelector(
        ".proof-edge-label-travel",
      ) as HTMLElement | null;
      const marker = root.querySelector(
        ".proof-milestone",
      ) as HTMLElement | null;
      if (!edge || !label || !marker) return;

      const destinationX = () =>
        Math.max(0, edge.clientWidth - 220 - 20 - MARKER_RESERVE);

      if (reduced) {
        gsap.set(label, {
          x: destinationX(),
          yPercent: -50,
          backgroundColor: "#e53e2a",
          color: "#ffffff",
          width: 220,
          height: 42,
          padding: "10px 20px",
        });
        gsap.set(marker, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(label, { yPercent: -50 });
      gsap.set(marker, { autoAlpha: 0, y: 42, scale: 0.82 });

      const pinRoot =
        (root.closest(".proof-pin") as HTMLElement | null) ?? root;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRoot,
          start: "top top",
          end: "+=900",
          pin: pinRoot,
          pinSpacing: false,
          scrub: 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        label,
        {
          x: 0,
          yPercent: -50,
          scale: 0.94,
          backgroundColor: "#e59b20",
          color: "#1a120a",
          width: 179,
          height: 22,
          padding: 0,
        },
        {
          x: destinationX,
          yPercent: -50,
          scale: 1,
          backgroundColor: "#e53e2a",
          color: "#ffffff",
          width: 220,
          height: 42,
          padding: "10px 20px",
          duration: 1,
          ease: "none",
        },
        0,
      );

      tl.to(
        marker,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.16,
          ease: "none",
        },
        0.84,
      );

      ScrollTrigger.refresh();
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

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
            {[...partners, ...partners].map((partner, index) => (
              <figure key={`${partner.name}-${index}`} className="proof-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={partner.src} alt="" width={78} height={27} />
                <figcaption>{partner.name}</figcaption>
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
