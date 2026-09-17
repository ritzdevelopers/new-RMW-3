"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

type PageTransitionContextValue = {
  navigate: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { reduced } = useMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      gsap.set(overlay, { yPercent: 100, pointerEvents: "none" });
    }
  }, []);

  const uncover = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      busyRef.current = false;
      pendingRef.current = null;
      return;
    }

    gsap.to(overlay, {
      yPercent: -100,
      duration: reduced ? 0 : 0.8,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(overlay, { yPercent: 100, pointerEvents: "none" });
        busyRef.current = false;
        pendingRef.current = null;
      },
    });
  }, [reduced]);

  useEffect(() => {
    if (!pendingRef.current) return;
    uncover();
  }, [pathname, uncover]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || busyRef.current) return;

      if (reduced) {
        router.push(href);
        return;
      }

      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }

      busyRef.current = true;
      pendingRef.current = href;
      gsap.set(overlay, { yPercent: 100, pointerEvents: "auto" });
      gsap.to(overlay, {
        yPercent: 0,
        duration: 0.7,
        ease: "power4.inOut",
        onComplete: () => {
          router.push(href);
        },
      });
    },
    [pathname, reduced, router],
  );

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[200] bg-paper"
      />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransition");
  }
  return context;
}
