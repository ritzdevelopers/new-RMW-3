import { TransitionLink } from "@/components/motion/TransitionLink";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="px-5 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-8 md:flex-row md:items-center">
        <p className="text-sm text-muted">
          {site.fullName} — {new Date().getFullYear()}
        </p>
        <TransitionLink href="/work" className="text-sm font-semibold uppercase tracking-[0.14em]">
          See the work →
        </TransitionLink>
      </div>
    </footer>
  );
}
