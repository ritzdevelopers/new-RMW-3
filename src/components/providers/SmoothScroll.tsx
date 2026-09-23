"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/components/providers/MotionProvider";

registerGsap();

function LenisScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const { reduced } = useMotion();

  if (reduced) return children;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.88,
        touchMultiplier: 1.05,
        syncTouch: false,
      }}
    >
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
