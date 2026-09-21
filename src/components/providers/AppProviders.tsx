"use client";

import { Grain } from "@/components/layout/Grain";
import { Preloader } from "@/components/layout/Preloader";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SmoothScroll>
        <PageTransition>
          <Preloader />
          <Grain />
          {children}
        </PageTransition>
      </SmoothScroll>
    </MotionProvider>
  );
}
