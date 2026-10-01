"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, SplitText } from "@/lib/gsap";

registerGsap();

const PHRASES = [
  "Ideas on board",
  "Creative ओके Please",
  "India to the world",
  "No empty promises",
  "Ideas that travel",
] as const;

const BULBS = Array.from({ length: 9 }, (_, index) => index);

export function AboutDrive() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const stage = root.querySelector<HTMLElement>(".about-drive-stage");
      const rig = root.querySelector<HTMLElement>(".about-drive-rig");
      const dashes = root.querySelector<HTMLElement>(".about-drive-dashes");
      const tyres = root.querySelectorAll<HTMLElement>(".about-tyre");
      const copy = root.querySelectorAll<HTMLElement>(".about-billboard-copy");
      if (!stage || !rig) return;

      const splits: SplitText[] = [];
      const animations: gsap.core.Animation[] = [];
      let cancelled = false;

      document.fonts.ready.then(() => {
        if (cancelled) return;

        root.querySelectorAll<HTMLElement>(".about-drive-label").forEach((label) => {
          splits.push(
            new SplitText(label, { type: "chars", charsClass: "about-drive-char" }),
          );
        });
        const chars = splits.flatMap((split) => split.chars);

        if (reduced) {
          gsap.set(chars, { yPercent: 0, opacity: 1 });
          gsap.set(copy, { y: 0, opacity: 1 });
          return;
        }

        gsap.set(chars, { yPercent: 130, opacity: 0 });
        gsap.set(copy, { y: 16, opacity: 0 });

        animations.push(
          gsap.to(chars, {
            yPercent: 0,
            opacity: 1,
            ease: "power3.out",
            stagger: 0.014,
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              end: "top 28%",
              scrub: true,
            },
          }),
        );

        const state = { p: 0 };
        const drive = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        animations.push(drive);

        drive.fromTo(
          state,
          { p: 0 },
          {
          p: 1,
          duration: 1,
          ease: "none",
          immediateRender: true,
          onUpdate: () => {
            const from = stage.offsetWidth + 32;
            const to = -rig.offsetWidth - 32;
            const x = from + (to - from) * state.p;
            const traveled = from - x;
            const radius = Math.max(8, (tyres[0]?.offsetWidth ?? 28) / 2);
            const rotation = (traveled / (Math.PI * 2 * radius)) * 360;

            gsap.set(rig, { x });
            gsap.set(tyres, { rotation, transformOrigin: "50% 50%" });
            if (dashes) gsap.set(dashes, { backgroundPositionX: traveled });
          },
          },
        );

        drive.to(
          copy,
          { y: 0, opacity: 1, duration: 0.18, stagger: 0.04, ease: "power2.out" },
          0.08,
        );
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
    <section ref={rootRef} className="about-drive" aria-label="Ideas on the road">
      <div className="about-drive-stripes" aria-hidden />

      <div className="about-drive-bar">
        {PHRASES.map((phrase) => (
          <span key={phrase} className="about-drive-item">
            <span className="about-drive-diamond" aria-hidden />
            <span className="about-drive-label">{phrase}</span>
          </span>
        ))}
      </div>

      <div className="about-drive-stage">
        <div className="about-drive-rig">
          <div className="about-cab">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/footer/truck.png" alt="" width={116} height={74} />
            <span className="about-tyre about-tyre-rear" aria-hidden />
            <span className="about-tyre about-tyre-front" aria-hidden />
          </div>

          <div className="about-billboard">
            <div className="about-billboard-frame">
              <span className="about-billboard-bulbs">
                {BULBS.map((bulb) => (
                  <i key={bulb} />
                ))}
              </span>
              <p className="about-billboard-copy about-billboard-kicker">Use data at night</p>
              <p className="about-billboard-copy about-billboard-line">
                Keep distance from empty promises
              </p>
              <p className="about-billboard-copy about-billboard-plate">
                <span>UP16 · RMW 2008</span>
              </p>
            </div>
            <span className="about-billboard-scallop" />
          </div>
        </div>

        <div className="about-drive-road" aria-hidden>
          <span className="about-drive-dashes" />
        </div>
      </div>

      <div className="about-drive-scallop" aria-hidden />
    </section>
  );
}
