"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Highways() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const [open, setOpen] = useState(0);
  const data = site.highways;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelectorAll("[data-highways-item]"),
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

  return (
    <section ref={rootRef} id="highways" className="highways" aria-label="Common highways">
      <div className="highways-inner">
        <div className="highways-left">
          <div data-highways-item className="highways-copy">
            <h2 className="highways-title">
              <span>Common</span>
              <span>Highways.</span>
            </h2>
            <p className="highways-lede">{data.lede}</p>
          </div>

          <div data-highways-item className="highways-visual">
            <div className="highways-card">
              <h3 className="highways-card-title">{data.card.title}</h3>
              <p className="highways-card-copy">{data.card.copy}</p>
              <a href={data.card.href} className="highways-card-btn">
                {data.card.cta}
                <span aria-hidden>→</span>
              </a>
            </div>

            <div className="highways-truck" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.truck} alt="" width={688} height={421} />
            </div>
          </div>
        </div>

        <div data-highways-item className="highways-faqs">
          {data.faqs.map((item, index) => {
            const isOpen = open === index;
            const num = String(index + 1).padStart(2, "0");

            return (
              <div
                key={item.q}
                className={cn("highways-faq", isOpen && "is-open")}
              >
                <button
                  type="button"
                  className="highways-faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(index)}
                >
                  <span className="highways-faq-num">{num}</span>
                  <span className="highways-faq-q">{item.q}</span>
                  <span className="highways-faq-toggle" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div className="highways-faq-panel">
                  <p className="highways-faq-a">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ticker-pattern highways-pattern" aria-hidden />
    </section>
  );
}
