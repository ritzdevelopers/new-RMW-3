import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealText } from "@/components/motion/RevealText";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
      <p className="mb-8 text-[11px] uppercase tracking-[0.28em] text-muted">
        The studio
      </p>
      <RevealText className="max-w-[18ch] font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
        Built for websites that should feel like a film, not a brochure.
      </RevealText>
      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <FadeIn>
          <p className="max-w-md text-sm leading-7 text-muted">
            This codebase is the foundation: Next.js App Router, Tailwind CSS,
            Lenis smooth scrolling, and GSAP for scroll-linked animation. Page
            changes use a Barba-inspired leave/enter curtain so routing stays
            native to Next.js without fighting the App Router.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <ul className="space-y-4 text-sm text-foreground">
            <li className="border-b border-line pb-4">Lenis + GSAP ticker, one RAF loop</li>
            <li className="border-b border-line pb-4">SplitText reveals and parallax media</li>
            <li className="border-b border-line pb-4">Magnetic links and a custom cursor</li>
            <li className="border-b border-line pb-4">Reduced-motion fallbacks throughout</li>
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
