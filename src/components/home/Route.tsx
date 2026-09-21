"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Route() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const copy = root.querySelectorAll("[data-route-copy]");
      const stops = root.querySelectorAll(".route-stop");
      const railTruck = root.querySelector(".route-rail-truck");

      if (reduced) {
        gsap.set([copy, stops], { autoAlpha: 1, y: 0 });
        if (railTruck) gsap.set(railTruck, { top: "100%" });
        return;
      }

      gsap.set(copy, { autoAlpha: 0, y: 24 });
      gsap.set(stops, { autoAlpha: 0, y: 64 });

      const proofPin = document.querySelector(".proof-pin") as HTMLElement | null;
      const proofHeight = () => proofPin?.offsetHeight ?? 0;
      const pinDistance = 900;

      const fillViewport = () => {
        root.style.minHeight = `${Math.max(window.innerHeight - proofHeight(), 420)}px`;
      };
      fillViewport();

      ScrollTrigger.create({
        trigger: root,
        start: () => `top ${proofHeight()}px`,
        end: `+=${pinDistance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: fillViewport,
      });

      gsap.to(copy, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 72%" },
      });

      gsap.to(stops, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: { trigger: ".route-stops", start: "top 82%" },
      });

      if (railTruck) {
        gsap.fromTo(
          railTruck,
          { top: "0%" },
          {
            top: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: () => `top ${proofHeight()}px`,
              end: `+=${pinDistance}`,
              scrub: 1.4,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="route" aria-label="How we think">
      <div className="route-rail" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="route-rail-marker"
          src="/s2/distance.png"
          alt=""
          width={40}
          height={40}
        />
        <span className="route-rail-line" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="route-rail-marker"
          src="/s2/distance.png"
          alt=""
          width={40}
          height={40}
        />
        <span className="route-rail-truck">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer/truck.png" alt="" width={120} height={56} />
        </span>
      </div>

      <div className="route-inner">
        <p data-route-copy className="route-kicker">
          {site.route.kicker}
        </p>

        <h2 data-route-copy className="route-title">
          {site.route.title.map((word, index) => (
            <span key={word} className="route-title-word">
              {index > 0 ? (
                <span className="route-chevron" aria-hidden>
                  »
                </span>
              ) : null}
              {word}
            </span>
          ))}
        </h2>

        <p data-route-copy className="route-lede">
          {site.route.lede}
        </p>

        <div className="route-stops">
          <span className="route-road" aria-hidden />

          <div className="route-track">
            {site.route.stops.map((stop) => (
              <article key={stop.name} className="route-stop">
                <div className="route-truck">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/s3/truck_back.png"
                    alt=""
                    width={954}
                    height={954}
                  />
                  <span className="route-truck-title">{stop.name}</span>
                  <span className="route-truck-km">{stop.km}</span>
                </div>
                <p className="route-stop-copy">{stop.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
