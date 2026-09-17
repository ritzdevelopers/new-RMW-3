"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type ParallaxMediaProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ParallaxMedia({
  src,
  alt,
  className,
  priority = false,
}: ParallaxMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const frame = frameRef.current;
      const media = mediaRef.current;
      if (!frame || !media || !ready || reduced) return;

      gsap.fromTo(
        media,
        { yPercent: -12, scale: 1.16 },
        {
          yPercent: 12,
          scale: 1.16,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [ready, reduced] },
  );

  return (
    <div ref={frameRef} className={cn("relative h-full overflow-hidden", className)}>
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
