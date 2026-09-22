"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { ButtonIcon } from "@/components/layout/ButtonIcon";
import { Road } from "@/components/home/Road";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();
gsap.registerPlugin(useGSAP);

const OK_EN = "OK";
const OK_HI = "ओके";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const [okLabel, setOkLabel] = useState(OK_EN);
  const [okSwapping, setOkSwapping] = useState(false);

  useEffect(() => {
    let swapIn: number | undefined;
    const swapAt = window.setTimeout(() => {
      setOkSwapping(true);
      swapIn = window.setTimeout(() => {
        setOkLabel(OK_HI);
        setOkSwapping(false);
      }, 180);
    }, 1000);

    return () => {
      window.clearTimeout(swapAt);
      if (swapIn !== undefined) window.clearTimeout(swapIn);
    };
  }, []);

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
          <h1 data-hero-item className="hero-title">
            <span className="hero-title-line">
              Creative{" "}
              <span
                className={`hero-title-ok${okSwapping ? " is-swapping" : ""}`}
                lang={okLabel === OK_HI ? "hi" : "en"}
              >
                {okLabel}
              </span>
            </span>
            <span className="hero-title-line">Please</span>
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
