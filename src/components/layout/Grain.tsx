"use client";

import { useMotion } from "@/components/providers/MotionProvider";

export function Grain() {
  const { reduced } = useMotion();
  if (reduced) return null;
  return <div className="grain" aria-hidden />;
}
