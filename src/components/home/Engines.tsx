"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { Road } from "@/components/home/Road";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Engines() {
  const rootRef = useRef<HTMLElement>(null);
  const cargoRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();
  const [active, setActive] = useState(0);
  const engine = site.engines.items[active];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const rig = root.querySelector(".engines-rig");
      if (!rig) return;

      gsap.fromTo(
        rig,
        { x: 80, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 72%" },
        },
      );

      gsap.to(rig, {
        y: -2,
        rotation: 0.28,
        transformOrigin: "50% 100%",
        duration: 0.55,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  useGSAP(
    () => {
      if (reduced) return;
      const cargo = cargoRef.current;
      const copy = copyRef.current;
      if (!cargo || !copy) return;

      gsap.fromTo(
        cargo,
        { autoAlpha: 0, scale: 1.06 },
        { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out" },
      );
      gsap.fromTo(
        copy,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    },
    { dependencies: [active, reduced] },
  );

  return (
    <section ref={rootRef} className="engines" aria-label="Capabilities">
      <div className="engines-inner">
        <h2 className="engines-title">{site.engines.title}</h2>

        <div className="engines-tabs" role="tablist">
          {site.engines.items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={
                index === active
                  ? "engines-tab engines-tab-active"
                  : "engines-tab"
              }
              onClick={() => setActive(index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div ref={copyRef} className="engines-copy">
          <h3 className="engines-heading">{engine.heading}</h3>
          <p className="engines-lede">{engine.copy}</p>
        </div>
      </div>

      <div className="engines-stage">
        <div className="engines-rig">
          <div className="engines-vehicle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="engines-truck"
            src="/s4/image 29.png"
            alt=""
            width={1600}
            height={820}
          />
          <div className="engines-cargo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={cargoRef}
              key={engine.id}
              src={engine.cargo}
              alt=""
              width={1400}
              height={900}
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="engines-horn"
            src="/s4/Frame 105331.png"
            alt=""
            width={640}
            height={220}
          />
          </div>
        </div>

        <Road className="engines-road" />
        <div className="ticker-pattern engines-pattern" />
      </div>
    </section>
  );
}
