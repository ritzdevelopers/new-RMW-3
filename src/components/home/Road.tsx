"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();
gsap.registerPlugin(useGSAP);

const DASH_TILE = 84;
const GRAIN_TILE = 160;
const DASH_SPEED = 150;
const GRAIN_SPEED = 110;

export function Road() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const dash = root.querySelector(".road-run-track");
      const grain = root.querySelector(".road-grain");

      const tweens = [
        gsap.fromTo(
          dash,
          { x: 0 },
          {
            x: DASH_TILE,
            duration: DASH_TILE / DASH_SPEED,
            ease: "none",
            repeat: -1,
          },
        ),
        gsap.fromTo(
          grain,
          { x: 0 },
          {
            x: GRAIN_TILE,
            duration: GRAIN_TILE / GRAIN_SPEED,
            ease: "none",
            repeat: -1,
          },
        ),
      ];

      return () => tweens.forEach((tween) => tween.kill());
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div ref={rootRef} className="road" aria-hidden>
      <span className="road-asphalt" />
      <span className="road-grain" />
      <span className="road-light" />
      <span className="road-kerb" />
      <span className="road-edge" />
      <div className="road-run">
        <div className="road-run-track">
          <span className="road-dash-strip" />
          <span className="road-dash-strip" />
        </div>
      </div>
    </div>
  );
}
