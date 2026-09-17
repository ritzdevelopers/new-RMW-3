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
      if (!root || !ready) return;

      const items = root.querySelectorAll("[data-hero-item]");
      const scene = root.querySelector(".hero-scene") as HTMLElement | null;
      if (!scene) return;

      gsap.from(items, {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });

      if (reduced) {
        gsap.set(scene, { x: 0 });
        return;
      }

      const from = Math.max(root.clientWidth, scene.offsetWidth);
      gsap.set(scene, { x: from });

      gsap.to(".hero-wheel", {
        rotation: 360,
        duration: 0.72,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".hero-rig", {
        y: -4,
        rotation: 0.35,
        transformOrigin: "50% 94%",
        duration: 0.22,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".hero-mascot", {
        y: "-1.4%",
        duration: 0.38,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(scene, {
        x: 0,
        duration: 2.6,
        delay: 0.15,
        ease: "power2.out",
      });
    },
    { dependencies: [ready, reduced] },
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
            <Link href="mailto:hello@ritzmediaworld.com" className="btn btn-ink">
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
                  src="/loader/image 1.png"
                  alt="RMW truck art"
                  width={537}
                  height={305}
                />
                <span className="hero-wheel hero-wheel-front" aria-hidden />
                <span className="hero-wheel hero-wheel-rear" aria-hidden />
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
