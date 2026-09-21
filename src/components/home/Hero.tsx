"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { ButtonIcon } from "@/components/layout/ButtonIcon";
import { Road } from "@/components/home/Road";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

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

      gsap.to(".hero-rig", {
        y: -3,
        rotation: 0.22,
        transformOrigin: "50% 94%",
        duration: 0.58,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".hero-mascot", {
        y: "-1.1%",
        duration: 0.72,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
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
            Creative OK
            <br />
            Please
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hero-truck"
                  src="/hero-section/Truck_Art.png"
                  alt="RMW truck art"
                  width={1995}
                  height={788}
                />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hero-mascot"
                src="/hero-section/image 19.png"
                alt=""
                width={640}
                height={800}
              />
            </div>
          </div>
        </div>
      </div>
      <Road />
    </section>
  );
}
