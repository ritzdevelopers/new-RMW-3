import { CountUp } from "@/components/motion/CountUp";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealText } from "@/components/motion/RevealText";

const stats = [
  { value: 48, suffix: "", label: "Launched experiences" },
  { value: 12, suffix: "", label: "Awards & mentions" },
  { value: 8, suffix: "y", label: "Of considered craft" },
];

export function Approach() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-16 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <RevealText className="max-w-[16ch] font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
          Motion should feel inevitable, never decorative.
        </RevealText>
        <FadeIn>
          <p className="max-w-md text-sm leading-7 text-muted">
            Lenis handles the scroll. GSAP drives the timeline. Page changes
            use a Barba-style leave and enter curtain so every route feels like
            one continuous film instead of a reload.
          </p>
        </FadeIn>
      </div>
      <div className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
        {stats.map((stat) => (
          <FadeIn key={stat.label}>
            <p className="font-serif text-6xl tracking-tight md:text-7xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-muted">
              {stat.label}
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
