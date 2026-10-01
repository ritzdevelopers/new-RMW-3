"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();

const STOPS = [
  {
    year: "2008",
    title: "Foundation",
    copy: "Ritz Media World opens in Delhi NCR to reimagine brand communication for India's growth markets.",
    place: "above",
    at: "14%",
    tone: "rose",
  },
  {
    year: "[YEAR]",
    title: "The digital engine",
    copy: "[When SEO, social and performance marketing became a full practice at RMW.]",
    place: "below",
    at: "32%",
    tone: "teal",
  },
  {
    year: "[YEAR]",
    title: "Real estate specialists",
    copy: "[First major developer launch: client and project name.]",
    place: "above",
    at: "50%",
    tone: "navy",
  },
  {
    year: "[YEAR]",
    title: "Studio in-house",
    copy: "[Film, 3D rendering and content production brought under one roof.]",
    place: "below",
    at: "68%",
    tone: "red",
  },
  {
    year: "Today",
    title: "AI on board",
    copy: "Brand, campaign, media, digital, film, 3D and AI now run as one connected system.",
    place: "above",
    at: "86%",
    tone: "now",
  },
] as const;

const TRUCK_GAP = 20;

const truckEnd = (road: HTMLElement, truck: HTMLElement) =>
  Math.max(0, road.clientWidth * 0.86 - truck.offsetWidth - TRUCK_GAP);

export function AboutJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      let match: gsap.MatchMedia | null = null;
      let cancelled = false;

      const park = () => {
        const road = root.querySelector<HTMLElement>(".about-journey-road");
        const truck = root.querySelector<HTMLElement>(".about-journey-truck");
        const cards = root.querySelectorAll<HTMLElement>(".about-journey-stop");
        gsap.set(cards, { y: 0, autoAlpha: 1, xPercent: -50 });
        if (!road || !truck) return;
        gsap.set(truck, { x: truckEnd(road, truck) });
      };

      document.fonts.ready.then(() => {
        if (cancelled) return;

        if (reduced) {
          park();
          return;
        }

        match = gsap.matchMedia();

        match.add("(max-width: 900px)", () => {
          const cards = root.querySelectorAll<HTMLElement>(".about-journey-stop");
          gsap.set(cards, { clearProps: "transform", autoAlpha: 1 });
        });

        match.add("(min-width: 901px)", () => {
          const road = root.querySelector<HTMLElement>(".about-journey-road");
          const truck = root.querySelector<HTMLElement>(".about-journey-truck");
          const tyres = root.querySelectorAll<HTMLElement>(".about-journey-tyre");
          const cards = root.querySelectorAll<HTMLElement>(".about-journey-stop");
          if (!road || !truck) return;

          gsap.set(cards, { y: 56, autoAlpha: 0, xPercent: -50 });
          gsap.set(truck, { x: 0 });

          const state = { p: 0 };
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * 1.7)}`,
              pin: true,
              pinSpacing: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(
            state,
            { p: 0 },
            {
              p: 1,
              duration: 1,
              ease: "none",
              immediateRender: true,
              onUpdate: () => {
                const x = truckEnd(road, truck) * state.p;
                const radius = Math.max(6, (tyres[0]?.offsetWidth ?? 14) / 2);
                gsap.set(truck, { x });
                gsap.set(tyres, {
                  rotation: (x / (Math.PI * 2 * radius)) * 360,
                  transformOrigin: "50% 50%",
                });
              },
            },
          );

          cards.forEach((card) => {
            const at = Number.parseFloat(card.dataset.at ?? "0") / 100;
            const when = Math.min(0.82, Math.max(0, (at - 0.14) / 0.72) * 0.82);
            tl.to(
              card,
              { y: 0, autoAlpha: 1, xPercent: -50, duration: 0.18, ease: "power2.out" },
              when,
            );
          });
        });
      });

      return () => {
        cancelled = true;
        match?.revert();
      };
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="about-journey">
      <div className="about-journey-head">
        <div>
          <p className="about-journey-kicker">Route map · 2008 → today</p>
          <h2 className="about-journey-title">Our Journey</h2>
        </div>
        <p className="about-journey-intro">
          Every kilometre added a new engine to the truck.<br />
          Here are the stops that shaped the agency we are today.
        </p>
      </div>

      <div className="about-journey-map">
        {STOPS.map((stop) => (
          <article
            key={stop.title}
            className={`about-journey-stop is-${stop.place} is-${stop.tone}`}
            style={{ "--at": stop.at } as React.CSSProperties}
            data-at={stop.at}
          >
            <p className="about-journey-year">{stop.year}</p>
            <h3 className="about-journey-stop-title">{stop.title}</h3>
            <p className="about-journey-stop-copy">{stop.copy}</p>
          </article>
        ))}

        <div className="about-journey-road">
          <span className="about-journey-lane" aria-hidden />
          {STOPS.map((stop) => (
            <span
              key={stop.title}
              className={`about-journey-dot is-${stop.tone}`}
              style={{ "--at": stop.at } as React.CSSProperties}
            />
          ))}
          <div className="about-journey-truck">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/footer/truck.png" alt="" width={116} height={74} />
            <span className="about-journey-tyre about-journey-tyre-rear" aria-hidden />
            <span className="about-journey-tyre about-journey-tyre-front" aria-hidden />
          </div>
        </div>
      </div>

      <div className="about-journey-stripes" aria-hidden />
    </section>
  );
}
