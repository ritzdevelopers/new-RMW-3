"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap, SplitText } from "@/lib/gsap";

registerGsap();

type RevealTextProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  once?: boolean;
};

export function RevealText({
  children,
  className,
  as: Tag = "h2",
  delay = 0,
  once = true,
}: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !ready || reduced) return;

      let split: SplitText | undefined;
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled || !ref.current) return;

        split = new SplitText(element, {
          type: "lines,words",
          linesClass: "split-line",
        });

        gsap.set(element, { opacity: 1 });
        gsap.from(split.words, {
          yPercent: 115,
          rotate: 1.5,
          duration: 1.25,
          ease: "power4.out",
          stagger: 0.035,
          delay,
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once,
          },
        });
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { dependencies: [ready, reduced, delay, once] },
  );

  return (
    <Tag ref={ref} className={cn(!reduced && "opacity-0", className)}>
      {children}
    </Tag>
  );
}
