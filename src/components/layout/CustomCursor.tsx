"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const xCursor = gsap.quickTo(cursor, "x", { duration: 0.12, ease: "power3" });
    const yCursor = gsap.quickTo(cursor, "y", { duration: 0.12, ease: "power3" });
    const xFollow = gsap.quickTo(follower, "x", { duration: 0.45, ease: "power3" });
    const yFollow = gsap.quickTo(follower, "y", { duration: 0.45, ease: "power3" });

    const onMove = (event: PointerEvent) => {
      xCursor(event.clientX);
      yCursor(event.clientY);
      xFollow(event.clientX);
      yFollow(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const hoverable = target?.closest("a, button, [data-cursor='hover']");
      gsap.to(follower, {
        scale: hoverable ? 2.4 : 1,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[120] hidden h-1.5 w-1.5 rounded-full bg-foreground mix-blend-difference md:block"
      />
      <div
        ref={followerRef}
        className="pointer-events-none fixed top-0 left-0 z-[120] hidden h-10 w-10 rounded-full border border-foreground/40 mix-blend-difference md:block"
      />
    </>
  );
}
