"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMotion();
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(true);
  }, []);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !ready || !live) return;

      if (reduced) {
        element.textContent = `${prefix}${value}${suffix}`;
        return;
      }

      const counter = { value: 0 };
      gsap.to(counter, {
        value,
        duration: 2.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
        },
      });
    },
    { dependencies: [ready, reduced, live, value, prefix, suffix] },
  );

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {prefix}0{suffix}
    </span>
  );
}
