import { TransitionLink } from "@/components/motion/TransitionLink";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-16 md:px-10">
      <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Next chapter
          </p>
          <TransitionLink
            href="/work"
            className="mt-4 block font-serif text-5xl tracking-tight md:text-7xl"
          >
            See the work
          </TransitionLink>
        </div>
        <div className="flex flex-col gap-3 text-sm text-muted">
          <span>{site.name} — {new Date().getFullYear()}</span>
          <span>Lenis · GSAP · Next.js</span>
        </div>
      </div>
    </footer>
  );
}
