"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MotionContextValue = {
  ready: boolean;
  reduced: boolean;
  setReady: () => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [ready, setReadyState] = useState(false);
  const setReady = useCallback(() => setReadyState(true), []);

  const value = useMemo(
    () => ({ ready: ready || reduced, reduced, setReady }),
    [ready, reduced, setReady],
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within MotionProvider");
  }
  return context;
}
