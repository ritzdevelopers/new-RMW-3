"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { ButtonIcon } from "@/components/layout/ButtonIcon";
import { Road } from "@/components/home/Road";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();
gsap.registerPlugin(useGSAP);

const HERO_HEADLINES = [
  { lines: ["Creative ओके", "Please"] },
  { lines: ["Idea Ka Dhamaka,", "Brand Ka पटाखा"] },
  { lines: ["Dil Se Desi,", "Kaam Mein", "World-Class"] },
] as const;

const TRUCK_PALETTES = [
  ["#f0b450", "#f07828", "#dc2864"],
  ["#dc2864", "#f07828", "#f0b450"],
  ["#1a4db8", "#48c8e8", "#289848"],
] as const;

const HEADLINE_HOLD_MS = 4200;
const HEADLINE_OUT_DURATION = 1.15;
const HEADLINE_IN_DURATION = 1.25;
const HEADLINE_LINE_STAGGER = 0.14;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInnerRef = useRef<HTMLSpanElement>(null);
  const headlineIndexRef = useRef(0);
  const cyclingRef = useRef(false);
  const awaitingEnterRef = useRef(false);
  const onCycleCompleteRef = useRef<(() => void) | null>(null);
  const { ready, reduced } = useMotion();
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const applyHeadlinePalette = useCallback((index: number, animate = false) => {
    const title = titleRef.current;
    if (!title) return;

    const [c1, c2, c3] = TRUCK_PALETTES[index];
    const vars = {
      "--hero-title-c1": c1,
      "--hero-title-c2": c2,
      "--hero-title-c3": c3,
    };

    if (!animate || reduced) {
      gsap.set(title, vars);
      return;
    }

    gsap.to(title, {
      ...vars,
      duration: 1.35,
      ease: "sine.inOut",
    });
  }, [reduced]);

  const finishCycle = useCallback(() => {
    cyclingRef.current = false;
    onCycleCompleteRef.current?.();
    onCycleCompleteRef.current = null;
  }, []);

  const cycleHeadline = useCallback(
    (onSettled?: () => void) => {
      const inner = titleInnerRef.current;
      if (!inner || cyclingRef.current) return;

      const nextIndex =
        (headlineIndexRef.current + 1) % HERO_HEADLINES.length;
      const lines = inner.querySelectorAll(".hero-title-line");

      if (reduced) {
        headlineIndexRef.current = nextIndex;
        setHeadlineIndex(nextIndex);
        applyHeadlinePalette(nextIndex);
        onSettled?.();
        return;
      }

      cyclingRef.current = true;
      onCycleCompleteRef.current = onSettled ?? null;

      gsap.to(lines, {
        autoAlpha: 0,
        y: -8,
        duration: HEADLINE_OUT_DURATION,
        ease: "sine.inOut",
        stagger: { each: HEADLINE_LINE_STAGGER, from: "end" },
        onComplete: () => {
          headlineIndexRef.current = nextIndex;
          awaitingEnterRef.current = true;
          setHeadlineIndex(nextIndex);
        },
      });
    },
    [applyHeadlinePalette, reduced],
  );

  useLayoutEffect(() => {
    if (!awaitingEnterRef.current) return;

    awaitingEnterRef.current = false;
    const inner = titleInnerRef.current;
    if (!inner || reduced) {
      finishCycle();
      return;
    }

    applyHeadlinePalette(headlineIndex, true);

    const lines = inner.querySelectorAll(".hero-title-line");
    gsap.set(inner, { autoAlpha: 1, y: 0 });
    gsap.set(lines, { autoAlpha: 0, y: 12, scale: 0.985 });

    gsap.to(lines, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: HEADLINE_IN_DURATION,
      ease: "sine.out",
      stagger: HEADLINE_LINE_STAGGER,
      onComplete: finishCycle,
    });
  }, [headlineIndex, reduced, finishCycle, applyHeadlinePalette]);

  useEffect(() => {
    applyHeadlinePalette(0);
  }, [applyHeadlinePalette]);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;
    let holdTimeout: number | undefined;

    const queueNext = () => {
      holdTimeout = window.setTimeout(() => {
        if (cancelled) return;
        cycleHeadline(() => {
          if (!cancelled) queueNext();
        });
      }, HEADLINE_HOLD_MS);
    };

    queueNext();

    return () => {
      cancelled = true;
      if (holdTimeout !== undefined) window.clearTimeout(holdTimeout);
    };
  }, [ready, cycleHeadline]);

  useGSAP(
    () => {
      const inner = titleInnerRef.current;
      if (!inner || !ready) return;
      gsap.set(inner, { autoAlpha: 1, y: 0 });
    },
    { scope: titleInnerRef, dependencies: [ready, reduced] },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const items = root.querySelectorAll("[data-hero-item]");
      const scene = root.querySelector(".hero-scene") as HTMLElement | null;
      if (!scene) return;

      if (reduced) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        gsap.set(scene, { x: 0 });
        return;
      }

      const from = scene.offsetWidth + 24;
      gsap.set(items, { autoAlpha: 0, y: 18 });
      gsap.set(scene, { x: from, force3D: true });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const items = root.querySelectorAll("[data-hero-item]");
      const scene = root.querySelector(".hero-scene") as HTMLElement | null;
      if (!scene) return;

      const from = scene.offsetWidth + 24;
      const tl = gsap.timeline();

      tl.to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.07,
        },
        0,
      );

      tl.fromTo(
        scene,
        { x: from, force3D: true },
        {
          x: 0,
          duration: 1.85,
          ease: "power2.out",
          immediateRender: true,
        },
        0,
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p data-hero-item className="hero-kicker">
            <span>Independent creative</span>
            <span className="hero-kicker-dot" aria-hidden>
              •
            </span>
            <span>Media agency</span>
            <span className="hero-kicker-dot" aria-hidden>
              •
            </span>
            <span>India</span>
          </p>
          <h1
            ref={titleRef}
            data-hero-item
            className="hero-title"
            data-headline={headlineIndex}
          >
            <span className="hero-title-viewport" aria-live="polite">
              <span ref={titleInnerRef} className="hero-title-inner">
                {HERO_HEADLINES[headlineIndex].lines.map((line, lineIndex) => (
                  <span
                    key={`${headlineIndex}-${lineIndex}`}
                    className="hero-title-line"
                  >
                    {line}
                  </span>
                ))}
              </span>
            </span>
          </h1>
          <p data-hero-item className="hero-lede">
            We turn business problems into ideas that travel—from brand and
            campaign to media, digital, film, 3D and AI.
          </p>
          <div data-hero-item className="hero-actions">
            <TransitionLink href="/work" className="btn btn-hot">
              See the work
              <ButtonIcon name="arrow" />
            </TransitionLink>
            <Link href="/#start-a-project" className="btn btn-ink">
              Start a project
              <ButtonIcon name="plus" />
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-scene">
            <div className="hero-rig">
              <div className="hero-truck-wrap">
                <video
                  className="hero-truck"
                  src="/hero-section/truck-drive.webm"
                  poster="/hero-section/truck-drive.png"
                  width={1980}
                  height={1080}
                  autoPlay={!reduced}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-label="RMW truck"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Road />
    </section>
  );
}
