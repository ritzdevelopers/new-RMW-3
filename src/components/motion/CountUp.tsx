"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type CountUpProps = {
  value: number;
  suffix?: string;
  className?: string;
};

export function CountUp({ value, suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !ready) return;

      if (reduced) {
        element.textContent = `${value}${suffix}`;
        return;
      }

      const counter = { value: 0 };
      gsap.to(counter, {
        value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          element.textContent = `${Math.round(counter.value)}${suffix}`;
        },
      });
    },
    { dependencies: [ready, reduced, value, suffix] },
  );

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
