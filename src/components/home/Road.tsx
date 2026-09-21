"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();
gsap.registerPlugin(useGSAP);

const ROAD_TILE = 1440;
const ROAD_SPEED = 160;
const TILES = 4;

const REFLECTOR_STEP = 64;

function RoadReflectors() {
  const count = Math.round((ROAD_TILE * TILES) / REFLECTOR_STEP);
  const dots = Array.from({ length: count }, (_, index) => index * REFLECTOR_STEP);

  return (
    <>
      {dots.map((x) => (
        <span key={x} className="road-reflector" style={{ left: x }} />
      ))}
    </>
  );
}

export function Road({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const worlds = root.querySelectorAll(".road-world");
      const tween = gsap.fromTo(
        worlds,
        { x: -ROAD_TILE },
        {
          x: 0,
          duration: ROAD_TILE / ROAD_SPEED,
          ease: "none",
          repeat: -1,
          force3D: true,
        },
      );

      return () => tween.kill();
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div ref={rootRef} className={`road ${className}`.trim()} aria-hidden>
      <div className="road-bed">
        <div className="road-world road-surface" />
        <div className="road-world road-reflector-track">
          <RoadReflectors />
        </div>
        <span className="road-glow" />
        <span className="road-sheen" />
      </div>
    </div>
  );
}
