"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function FadeIn({ children, className, delay = 0, y = 36 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !ready || reduced) return;

      gsap.from(element, {
        y,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          once: true,
        },
      });
    },
    { dependencies: [ready, reduced, delay, y] },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
