"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Awards() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const item = site.awards.items[0];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelectorAll("[data-awards-item]"),
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%" },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="awards" aria-label="Awards">
      <div className="awards-inner">
        <div data-awards-item className="awards-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-section/Truck_Art.png"
            alt=""
            width={900}
            height={420}
            className="awards-truck"
          />
          <h2 className="awards-title">{site.awards.title}</h2>
        </div>

        <article data-awards-item className="awards-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/s9/image 16.png"
            alt=""
            width={673}
            height={380}
            className="awards-card-art"
          />
          <div className="awards-card-inner">
            <p className="awards-year">{item.year}</p>
            <div className="awards-mark">
              <div className="awards-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Ritz Media World" width={96} height={96} />
              </div>
              <p className="awards-heading">{item.heading}</p>
              <p className="awards-copy">{item.copy}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
