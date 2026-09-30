"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { Road } from "@/components/home/Road";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

const ENGINE_TAB_ROWS = [5, 4] as const;
const PIN_DISTANCE = 1100;
const COMPACT_MQ = "(max-width: 1024px)";
const WHEEL_SLOTS = ["front", "mid", "rear"] as const;

function EngineWheel({ slot }: { slot: (typeof WHEEL_SLOTS)[number] }) {
  return (
    <span className={`engines-wheel engines-wheel--${slot}`} aria-hidden>
      <span className="engines-wheel-tread" />
      <span className="engines-wheel-hub" />
    </span>
  );
}

export function Engines() {
  const rootRef = useRef<HTMLElement>(null);
  const cargoRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const skipSwapRef = useRef(true);
  const swappingRef = useRef(false);
  const { ready, reduced } = useMotion();
  const [active, setActive] = useState(0);
  const engine = site.engines.items[active];

  const selectEngine = (index: number) => {
    if (index === active || swappingRef.current) return;
    const cargo = cargoRef.current;
    if (!cargo || reduced) {
      setActive(index);
      return;
    }
    swappingRef.current = true;
    gsap.to(cargo, {
      scale: 0,
      duration: 0.22,
      ease: "back.in(1.7)",
      overwrite: "auto",
      onComplete: () => {
        setActive(index);
        swappingRef.current = false;
      },
    });
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle("is-driving", entry.isIntersecting && !reduced);
      },
      { threshold: 0.12 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      root.classList.remove("is-driving");
    };
  }, [reduced]);

  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      const title = root.querySelector<HTMLElement>(".engines-title");
      const tabs = root.querySelectorAll<HTMLElement>(".engines-tab");
      const rig = root.querySelector<HTMLElement>(".engines-rig");
      const vehicle = root.querySelector<HTMLElement>(".engines-vehicle");
      const horn = root.querySelector<HTMLElement>(".engines-horn");
      const copy = copyRef.current;
      const truckImg = root.querySelector<HTMLImageElement>(".engines-truck");
      if (!title || !rig || !vehicle || !copy || !contextSafe) return;

      const mm = gsap.matchMedia();
      let cancelled = false;
      let split: SplitText | undefined;
      let drive: ScrollTrigger | undefined;
      let stopDrive = () => {};

      const boot = contextSafe(() => {
        if (cancelled || !rootRef.current) return;

        split = new SplitText(title, {
          type: "lines,chars",
          linesClass: "engines-title-line",
          charsClass: "engines-char",
        });

        const chars = split.chars;
        const bounce = gsap.to(vehicle, {
          y: -2,
          duration: 0.28,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          paused: true,
        });

        const playDrive = () => {
          if (reduced) return;
          root.classList.add("is-driving");
          bounce.play();
        };
        stopDrive = () => {
          bounce.pause();
        };

        drive = ScrollTrigger.create({
          trigger: root,
          start: "top 92%",
          end: "bottom 6%",
          onToggle: (self) => (self.isActive ? playDrive() : stopDrive()),
        });
        playDrive();

        gsap.set(chars, {
          yPercent: 130,
          rotateX: -85,
          transformOrigin: "50% 100%",
        });
        gsap.set(tabs, {
          yPercent: 120,
          rotateX: -80,
          autoAlpha: 0,
          transformOrigin: "50% 0%",
        });
        gsap.set(rig, { x: "110vw", rotate: 2.6 });
        gsap.set(horn, { rotation: -2, transformOrigin: "92% 70%" });
        gsap.set(copy, {
          autoAlpha: 0,
          y: 28,
          clipPath: "inset(0 0 100% 0)",
          "--engines-bar": 0,
        });

        mm.add(COMPACT_MQ, () => {
          const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: root,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          intro
            .to(
              chars,
              {
                yPercent: 0,
                rotateX: 0,
                duration: 0.9,
                stagger: { amount: 0.38, from: "start" },
                ease: "power4.out",
              },
              0,
            )
            .to(
              tabs,
              {
                yPercent: 0,
                rotateX: 0,
                autoAlpha: 1,
                duration: 0.7,
                stagger: { amount: 0.32, from: "start" },
                ease: "back.out(1.4)",
              },
              0.12,
            )
            .to(
              rig,
              {
                x: 0,
                rotate: 0,
                duration: 1.35,
                ease: "power3.out",
              },
              0.08,
            )
            .to(
              copy,
              {
                autoAlpha: 1,
                y: 0,
                clipPath: "inset(0 0 0% 0)",
                "--engines-bar": 1,
                duration: 0.7,
                ease: "power3.out",
              },
              0.42,
            )
            .to(
              horn,
              {
                rotation: 7,
                duration: 0.09,
                yoyo: true,
                repeat: 5,
                ease: "power1.inOut",
              },
              0.85,
            );

          return () => {
            intro.kill();
          };
        });

        mm.add("(min-width: 1025px)", () => {
          const intro = { p: 0 };
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              id: "engines-pin",
              trigger: root,
              start: "top top",
              end: `+=${PIN_DISTANCE}`,
              pin: true,
              pinSpacing: true,
              scrub: 1.1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(
            chars,
            {
              yPercent: 0,
              rotateX: 0,
              duration: 0.55,
              stagger: { amount: 0.28, from: "start" },
              ease: "power4.out",
            },
            0,
          )
            .to(
              tabs,
              {
                yPercent: 0,
                rotateX: 0,
                autoAlpha: 1,
                duration: 0.48,
                stagger: { amount: 0.22, from: "start" },
                ease: "power3.out",
              },
              0.06,
            )
            .to(
              rig,
              {
                x: 0,
                rotate: 0,
                duration: 0.92,
                ease: "power2.out",
              },
              0,
            )
            .to(
              intro,
              {
                p: 1,
                duration: 0.12,
                onUpdate: () => {
                  gsap.set(horn, {
                    rotation: -2 + Math.sin(intro.p * Math.PI * 6) * 8,
                  });
                },
              },
              0.42,
            )
            .to(
              copy,
              {
                autoAlpha: 1,
                y: 0,
                clipPath: "inset(0 0 0% 0)",
                "--engines-bar": 1,
                duration: 0.35,
                ease: "power3.out",
              },
              0.38,
            );

          return () => {
            tl.kill();
          };
        });

        if (truckImg && !truckImg.complete) {
          truckImg.addEventListener("load", () => ScrollTrigger.refresh(), {
            once: true,
          });
        }
      });

      void document.fonts.ready.then(boot);

      return () => {
        cancelled = true;
        split?.revert();
        mm.revert();
        drive?.kill();
        stopDrive();
      };
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  useGSAP(
    () => {
      if (reduced) return;
      if (skipSwapRef.current) {
        skipSwapRef.current = false;
        return;
      }
      const cargo = cargoRef.current;
      const copy = copyRef.current;
      const root = rootRef.current;
      if (!cargo || !copy || !root) return;

      const kicker = copy.querySelector<HTMLElement>(".engines-kicker");
      const heading = copy.querySelector<HTMLElement>(".engines-heading");
      const lede = copy.querySelector<HTMLElement>(".engines-lede");
      const horn = root.querySelector<HTMLElement>(".engines-horn");

      gsap.fromTo(
        cargo,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.52,
          ease: "back.out(1.8)",
          overwrite: "auto",
        },
      );

      gsap.fromTo(
        [heading, lede],
        { y: 32, clipPath: "inset(0 0 100% 0)" },
        {
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out",
          overwrite: "auto",
        },
      );

      if (kicker) {
        gsap.fromTo(
          kicker,
          { x: -18 },
          { x: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" },
        );
        gsap.to(kicker, {
          duration: 0.55,
          scrambleText: {
            text: kicker.textContent ?? "",
            chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            speed: 0.55,
          },
        });
      }

      gsap.fromTo(
        copy,
        { "--engines-bar": 0 },
        {
          "--engines-bar": 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        },
      );

      if (horn) {
        gsap.fromTo(
          horn,
          { rotation: -2 },
          {
            rotation: 8,
            duration: 0.08,
            yoyo: true,
            repeat: 3,
            ease: "power1.inOut",
            overwrite: "auto",
          },
        );
      }
    },
    { dependencies: [active, reduced], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className="engines" aria-label="Capabilities">
      <div className="engines-inner">
        <h2 className="engines-title">{site.engines.title}</h2>

        <div className="engines-tabs" role="tablist">
          {ENGINE_TAB_ROWS.map((count, rowIndex) => {
            const start = ENGINE_TAB_ROWS.slice(0, rowIndex).reduce(
              (total, rowCount) => total + rowCount,
              0,
            );

            return (
              <div key={rowIndex} className="engines-tabs-row">
                {site.engines.items
                  .slice(start, start + count)
                  .map((item, index) => {
                    const tabIndex = start + index;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={tabIndex === active}
                        className={
                          tabIndex === active
                            ? "engines-tab engines-tab-active"
                            : "engines-tab"
                        }
                        onClick={() => selectEngine(tabIndex)}
                      >
                        {item.label}
                      </button>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="engines-split">
        <div ref={copyRef} className="engines-copy">
          <p key={`kicker-${engine.id}`} className="engines-kicker">
            {engine.label}
          </p>
          <h3 key={`heading-${engine.id}`} className="engines-heading">
            {engine.heading}
          </h3>
          <p key={`lede-${engine.id}`} className="engines-lede">
            {engine.copy}
          </p>
        </div>

        <div className="engines-stage">
          <div className="engines-rig">
            <div className="engines-vehicle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="engines-truck"
                src="/s4/engines-truck.png?v=3"
                alt=""
                width={1024}
                height={472}
              />
              <div className="engines-cargo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={cargoRef}
                  key={engine.id}
                  src={engine.cargo}
                  alt=""
                  width={1400}
                  height={900}
                />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="engines-horn"
                src="/s4/Frame 105331.png"
                alt=""
                width={640}
                height={220}
              />
              {WHEEL_SLOTS.map((slot) => (
                <EngineWheel key={slot} slot={slot} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Road className="engines-road" />
      <div className="engines-strip engines-strip-bottom" aria-hidden />
    </section>
  );
}
