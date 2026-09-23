"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";

const ROAD_TILE = 1440;
const TILES = 4;
const REFLECTOR_STEP = 128;

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

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle("is-active", entry.isIntersecting);
      },
      { rootMargin: "120px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [reduced]);

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
