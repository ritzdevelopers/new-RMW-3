"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

/**
 * One pinned scrub on `.proof-route` drives both:
 * - Ideas That Travel label + milestone (then the bar slides away)
 * - Insight » Idea » Impact scroll mask → full-viewport open
 */
const MASK_CLOSED = 7;
const MASK_OPEN = 160;
const PIN_DISTANCE = 1800;
const MARKER_RESERVE = 120;

export function Route() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const shell =
        (root.closest(".proof-route") as HTMLElement | null) ?? root;
      const proofPin = shell.querySelector<HTMLElement>(".proof-pin");
      const media = root.querySelector<HTMLElement>(".route-mask-media");
      const poster = root.querySelector<HTMLElement>(".route-mask-poster");
      const caption = root.querySelectorAll<HTMLElement>("[data-route-caption]");
      const edge = shell.querySelector<HTMLElement>(".proof-edge-top");
      const label = shell.querySelector<HTMLElement>(
        ".proof-edge-label-travel",
      );
      const marker = shell.querySelector<HTMLElement>(".proof-milestone");
      if (!media || !poster) return;

      const setRadius = (value: number) =>
        media.style.setProperty("--mask-r", `${value}%`);

      const clearMask = () => {
        media.style.webkitMaskImage = "none";
        media.style.maskImage = "none";
      };

      const restoreMask = () => {
        media.style.webkitMaskImage = "";
        media.style.maskImage = "";
      };

      const destinationX = () =>
        edge
          ? Math.max(0, edge.clientWidth - 220 - 20 - MARKER_RESERVE)
          : 0;

      if (reduced) {
        setRadius(MASK_OPEN);
        clearMask();
        gsap.set(poster, { scale: 1 });
        gsap.set(caption, { autoAlpha: 0 });
        if (proofPin) gsap.set(proofPin, { yPercent: -100 });
        if (label) {
          gsap.set(label, {
            x: destinationX(),
            yPercent: -50,
            backgroundColor: "#e53e2a",
            color: "#ffffff",
            width: 220,
            height: 42,
            padding: "10px 20px",
          });
        }
        if (marker) gsap.set(marker, { autoAlpha: 1, y: 0 });
        return;
      }

      const mask = { r: MASK_CLOSED };
      restoreMask();
      setRadius(MASK_CLOSED);
      gsap.set(poster, { scale: 1.32 });
      gsap.set(caption, { autoAlpha: 0, y: 18 });
      if (label) gsap.set(label, { yPercent: -50 });
      if (marker) gsap.set(marker, { autoAlpha: 0, y: 42, scale: 0.82 });
      if (proofPin) gsap.set(proofPin, { yPercent: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "proof-route",
          trigger: shell,
          start: "top top",
          end: `+=${PIN_DISTANCE}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Label travels across while the mask begins opening.
      if (label) {
        tl.fromTo(
          label,
          {
            x: 0,
            yPercent: -50,
            scale: 0.94,
            backgroundColor: "#e59b20",
            color: "#1a120a",
            width: 179,
            height: 22,
            padding: 0,
          },
          {
            x: destinationX,
            yPercent: -50,
            scale: 1,
            backgroundColor: "#e53e2a",
            color: "#ffffff",
            width: 220,
            height: 42,
            padding: "10px 20px",
            duration: 0.55,
          },
          0,
        );
      }

      if (marker) {
        tl.to(
          marker,
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.1 },
          0.42,
        );
      }

      // Mask opens to past the farthest corner so the poster is fully revealed.
      tl.to(
        mask,
        {
          r: MASK_OPEN,
          duration: 0.78,
          onUpdate: () => {
            setRadius(mask.r);
            if (mask.r >= MASK_OPEN - 0.5) clearMask();
            else restoreMask();
          },
        },
        0,
      );
      tl.to(poster, { scale: 1, duration: 0.78 }, 0);

      tl.to(
        caption,
        { autoAlpha: 1, y: 0, duration: 0.06, stagger: 0.02 },
        0.02,
      );
      tl.to(
        caption,
        { autoAlpha: 0, y: -14, duration: 0.08, stagger: 0.02 },
        0.16,
      );

      // Slide Ideas That Travel off so Impact owns the full viewport.
      if (proofPin) {
        tl.to(
          proofPin,
          { yPercent: -100, duration: 0.35, ease: "none" },
          0.45,
        );
      }

      // Hold the fully opened Impact frame before unpinning.
      tl.to(
        {},
        {
          duration: 0.22,
          onStart: clearMask,
          onUpdate: clearMask,
        },
      );

      ScrollTrigger.refresh();

      let lastHeight = document.body.offsetHeight;
      let refreshId = 0;
      const observer = new ResizeObserver(() => {
        const height = document.body.offsetHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        lastHeight = height;
        window.clearTimeout(refreshId);
        refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      observer.observe(document.body);

      return () => {
        window.clearTimeout(refreshId);
        observer.disconnect();
        restoreMask();
      };
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section ref={rootRef} className="route" aria-label="How we think">
      <div className="route-mask-stage">
        <div className="route-mask-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="route-mask-poster"
            src="/s2/route-poster.jpg"
            alt={`${site.route.title.join(" » ")} — ${site.route.lede}`}
            width={1024}
            height={601}
            loading="lazy"
            decoding="async"
          />

          <div className="route-mask-copy">
            <h2 className="route-mask-title">{site.route.title.join(" » ")}</h2>
            <p className="route-mask-lede">{site.route.lede}</p>
            <ul className="route-mask-stops">
              {site.route.stops.map((stop) => (
                <li key={stop.name}>
                  <strong>
                    {stop.name} <span>({stop.km})</span>
                  </strong>
                  <span>{stop.copy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="route-mask-caption" aria-hidden>
          <p data-route-caption className="route-mask-kicker">
            {site.route.kicker}
          </p>
          <p data-route-caption className="route-mask-hint">
            Keep scrolling to open the route
          </p>
        </div>
      </div>
    </section>
  );
}
