"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const SLIDES = [
  { src: "/about/proof-tablet.png", alt: "Expense dashboard proof on a tablet" },
  { src: "/about/proof-tablet.png", alt: "Expense dashboard proof on a tablet" },
  { src: "/about/proof-tablet.png", alt: "Expense dashboard proof on a tablet" },
] as const;

const REST = {
  x: 0,
  y: 0,
  z: 0,
  rotateX: 16,
  rotateY: -28,
  rotateZ: 7,
  scale: 1,
  autoAlpha: 1,
};

const TRUCK_STEP = 42;

export function AboutProofs() {
  const facesRef = useRef<Array<HTMLDivElement | null>>([]);
  const truckRef = useRef<HTMLImageElement>(null);
  const truckX = useRef(0);
  const activeRef = useRef(0);
  const busyRef = useRef(false);
  const [active, setActive] = useState(0);

  const nudgeTruck = (dir: 1 | -1) => {
    const truck = truckRef.current;
    if (!truck) return;
    const section = truck.parentElement;
    const limit = section
      ? Math.max(TRUCK_STEP, section.clientWidth - truck.offsetWidth - 180)
      : 280;
    const nextX = Math.min(limit, Math.max(0, truckX.current + dir * TRUCK_STEP));
    truckX.current = nextX;
    gsap.to(truck, {
      x: nextX,
      duration: 0.7,
      ease: "power2.out",
    });
  };

  const turn = (dir: 1 | -1) => {
    nudgeTruck(dir);
    const total = SLIDES.length;
    const from = activeRef.current;
    const to = (from + dir + total) % total;
    const current = facesRef.current[from];
    const next = facesRef.current[to];
    if (!current || !next || busyRef.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(facesRef.current, { autoAlpha: 0 });
      gsap.set(next, { ...REST, zIndex: 2 });
      activeRef.current = to;
      setActive(to);
      return;
    }

    busyRef.current = true;

    gsap.set([current, next], {
      transformPerspective: 1700,
      transformOrigin: "50% 58%",
    });
    gsap.set(next, {
      zIndex: 4,
      x: dir * 64,
      y: dir * -128,
      z: -210,
      rotateX: dir > 0 ? -34 : 40,
      rotateY: dir > 0 ? 86 : -86,
      rotateZ: dir > 0 ? -18 : 18,
      scale: 0.9,
      autoAlpha: 0,
    });
    gsap.set(current, { zIndex: 5 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(current, { autoAlpha: 0, zIndex: 1 });
        gsap.set(next, { ...REST, zIndex: 3, transformPerspective: 1700 });
        activeRef.current = to;
        setActive(to);
        busyRef.current = false;
      },
    });

    tl.to(
      current,
      {
        keyframes: [
          {
            x: dir * -22,
            y: dir * 48,
            z: -50,
            rotateX: dir > 0 ? 4 : 30,
            rotateY: dir > 0 ? -108 : 52,
            rotateZ: dir > 0 ? 24 : -10,
            scale: 0.96,
            autoAlpha: 1,
            duration: 0.34,
            ease: "power2.in",
          },
          {
            x: dir * -38,
            y: dir * 132,
            z: -140,
            rotateX: dir > 0 ? 38 : -6,
            rotateY: dir > 0 ? -172 : 158,
            rotateZ: dir > 0 ? 32 : -26,
            scale: 0.86,
            autoAlpha: 0,
            duration: 0.36,
            ease: "power2.in",
          },
        ],
      },
      0,
    );

    tl.to(
      next,
      {
        ...REST,
        zIndex: 4,
        duration: 0.74,
        ease: "power3.out",
      },
      0.2,
    );
  };

  return (
    <section className="about-proofs" aria-roledescription="carousel" aria-label="Real proofs">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="about-proofs-wave is-left" src="/about/proof-wave-left.png" alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="about-proofs-wave is-right" src="/about/proof-wave-right.png" alt="" />

      <h2 className="about-proofs-title">REAL PROOFS</h2>

      <button
        type="button"
        className="about-proofs-arrow is-prev"
        aria-label="Previous proof"
        onClick={() => turn(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M14.5 5.5 L8 12 l6.5 6.5" />
        </svg>
      </button>

      <div className="about-proofs-stage">
        <div className="about-proofs-shadow" aria-hidden />
        <div className="about-proofs-faces">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              ref={(node) => {
                facesRef.current[index] = node;
              }}
              className={index === active ? "about-proofs-face is-active" : "about-proofs-face"}
              aria-hidden={index !== active}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt={index === active ? slide.alt : ""} />
            </div>
          ))}
        </div>
        <span className="about-proofs-spark" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      </div>

      <button
        type="button"
        className="about-proofs-arrow is-next"
        aria-label="Next proof"
        onClick={() => turn(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M9.5 5.5 L16 12 l-6.5 6.5" />
        </svg>
      </button>

      <div className="about-proofs-road" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={truckRef}
        className="about-proofs-truck"
        src="/about/proof-truck.png"
        alt=""
      />
      <div className="about-proofs-mark" aria-hidden>
        <span className="about-proofs-mark-cap" />
        <span className="about-proofs-mark-label">RitzMedia</span>
      </div>
    </section>
  );
}
