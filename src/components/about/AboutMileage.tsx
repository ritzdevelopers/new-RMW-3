"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, SplitText } from "@/lib/gsap";

registerGsap();

const STATS = [
  { count: 18, suffix: "+", label: "Years in brand building" },
  { text: "[XX]+", label: "Professionals on the team" },
  { text: "[XXX]+", label: "Brands served" },
  { count: 6, pad: 2, label: "Industries we specialise in" },
] as const;

export function AboutMileage() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const splits: SplitText[] = [];
      const animations: gsap.core.Animation[] = [];
      let cancelled = false;

      const paintCount = (el: HTMLElement, value: number) => {
        const pad = Number(el.dataset.pad ?? 0);
        const suffix = el.dataset.suffix ?? "";
        const digits = pad ? String(value).padStart(pad, "0") : String(value);
        el.textContent = `${digits}${suffix}`;
      };

      document.fonts.ready.then(() => {
        if (cancelled) return;

        const kicker = root.querySelector<HTMLElement>(".about-mile-kicker");
        const title = root.querySelector<HTMLElement>(".about-mile-title");
        const lede = root.querySelector<HTMLElement>(".about-mile-lede");
        const card = root.querySelector<HTMLElement>(".about-mile-card");
        const brand = root.querySelector<HTMLElement>(".about-mile-brand");
        const counts = root.querySelectorAll<HTMLElement>("[data-count]");
        const labels = root.querySelectorAll<HTMLElement>(".about-mile-label");
        const rules = root.querySelectorAll<HTMLElement>(".about-mile-stat");
        const literals = root.querySelectorAll<HTMLElement>(".about-mile-literal");

        if (!kicker || !title || !lede || !card || !brand) return;

        const kickerSplit = new SplitText(kicker, { type: "chars", charsClass: "about-mile-char" });
        const titleSplit = new SplitText(title, {
          type: "lines,chars",
          linesClass: "about-mile-line",
          charsClass: "about-mile-char",
        });
        const ledeSplit = new SplitText(lede, { type: "words", wordsClass: "about-mile-word" });
        const brandSplit = new SplitText(brand, { type: "chars", charsClass: "about-mile-char" });
        splits.push(kickerSplit, titleSplit, ledeSplit, brandSplit);

        literals.forEach((el) => {
          splits.push(new SplitText(el, { type: "chars", charsClass: "about-mile-char" }));
        });
        const literalChars = splits.slice(4).flatMap((split) => split.chars);

        const finals = () => {
          counts.forEach((el) => paintCount(el, Number(el.dataset.count)));
          gsap.set(
            [card, kicker, title, lede, labels, ...kickerSplit.chars, ...titleSplit.chars, ...ledeSplit.words, ...brandSplit.chars, ...literalChars],
            { clearProps: "all" },
          );
        };

        if (reduced) {
          finals();
          return;
        }

        gsap.set(card, { y: 56, autoAlpha: 0 });
        gsap.set(brandSplit.chars, { yPercent: 130, opacity: 0 });
        gsap.set(kicker, { autoAlpha: 1 });
        gsap.set(kickerSplit.chars, { yPercent: 120, opacity: 0 });
        gsap.set(title, { autoAlpha: 1 });
        gsap.set(titleSplit.chars, { yPercent: 115, opacity: 0 });
        gsap.set(lede, { autoAlpha: 1 });
        gsap.set(ledeSplit.words, { y: 22, opacity: 0 });
        gsap.set(labels, { y: 14, autoAlpha: 0 });
        gsap.set(literalChars, { yPercent: 110, opacity: 0 });
        gsap.set(rules, { "--rule": 0 });
        counts.forEach((el) => paintCount(el, 0));

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top 90%",
            end: "bottom 30%",
            scrub: 1.6,
          },
        });
        animations.push(tl);

        tl.to(card, { y: 0, autoAlpha: 1, duration: 0.7 }, 0);
        tl.to(
          brandSplit.chars,
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          0.15,
        );
        tl.to(
          kickerSplit.chars,
          { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.045 },
          0.1,
        );
        tl.to(
          titleSplit.chars,
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.035 },
          0.35,
        );
        tl.to(
          ledeSplit.words,
          { y: 0, opacity: 1, duration: 1, stagger: 0.02 },
          0.9,
        );
        tl.to(rules, { "--rule": 1, duration: 0.6, stagger: 0.1 }, 1.35);
        tl.to(
          literalChars,
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.04 },
          1.4,
        );
        tl.to(labels, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 1.55);

        counts.forEach((el, index) => {
          const proxy = { value: 0 };
          const target = Number(el.dataset.count);
          tl.to(
            proxy,
            {
              value: target,
              duration: 0.9,
              onUpdate: () => paintCount(el, Math.round(proxy.value)),
            },
            1.3 + index * 0.12,
          );
        });
      });

      return () => {
        cancelled = true;
        animations.forEach((animation) => {
          animation.scrollTrigger?.kill();
          animation.kill();
        });
        splits.forEach((split) => split.revert());
      };
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="about-mile">
      <div className="about-mile-grid">
        <article className="about-mile-card">
          <div className="about-mile-arch">
            <p className="about-mile-brand">RMW</p>
          </div>
          <p className="about-mile-pill">Noida · NH 2008</p>
          <p className="about-mile-figure" data-count="18" data-suffix="+">
            0+
          </p>
          <p className="about-mile-road">Years on the road</p>
        </article>

        <div className="about-mile-copy">
          <p className="about-mile-kicker">Mile marker 18</p>
          <h2 className="about-mile-title">18+ Years of Experience</h2>
          <p className="about-mile-lede">
            Since 2008 we have launched projects, built brands and planned media through
            every shift in Indian marketing, from print and radio to search, social,
            performance and now AI. That mileage shows up in the work as faster starts,
            fewer detours and plans grounded in what has actually moved buyers.
          </p>

          <div className="about-mile-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="about-mile-stat">
                {"text" in stat ? (
                  <p className="about-mile-value about-mile-literal">{stat.text}</p>
                ) : (
                  <p
                    className="about-mile-value"
                    data-count={stat.count}
                    data-suffix={"suffix" in stat ? stat.suffix : ""}
                    data-pad={"pad" in stat ? stat.pad : undefined}
                  >
                    {"pad" in stat ? "00" : `0${"suffix" in stat ? stat.suffix : ""}`}
                  </p>
                )}
                <p className="about-mile-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
