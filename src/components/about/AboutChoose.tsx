"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

export function AboutChoose() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const truck = root.querySelector<HTMLElement>(".about-choose-truck");
      if (!truck) return;

      if (reduced) {
        gsap.set(truck, { scale: 1, autoAlpha: 1 });
        return;
      }

      gsap.set(truck, { scale: 0.18, autoAlpha: 0, transformOrigin: "50% 46%" });

      const tween = gsap.to(truck, {
        scale: 1,
        autoAlpha: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "top 22%",
          scrub: 0.85,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="about-choose">
      <div className="about-choose-panel">
        <p className="about-choose-kicker">Six reasons brands ride with us</p>
        <h2 className="about-choose-title">Why choose us?</h2>
        <p className="about-choose-lede">
          Every truck in India carries its own painted promise. These are ours, and
          each one is backed by how we actually work.
        </p>
      </div>

      <div className="about-choose-stage">
        <div className="about-choose-truck">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about/choose-truck.png" alt="" width={1012} height={571} />
          <article className="about-choose-card">
            <span className="about-choose-num">
              <svg viewBox="0 0 100 100" aria-hidden>
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="#F1C411"
                  stroke="#39300C"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </svg>
              01
            </span>
            <h3>One agency, three engines</h3>
            <p>
              Digital, creative and print sit on one brief, so strategy, message and
              media are planned together instead of as loose deliverables.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
