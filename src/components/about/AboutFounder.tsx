"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";

registerGsap();

const STOPS = [
  { when: "Aug 2008", detail: "Founds Ritz Media World in Delhi NCR" },
  { when: "[YEAR]", detail: "Founds Creative Thinks Media" },
  { when: "[YEAR]", detail: "[Key milestone: award, expansion or landmark client]" },
  { when: "Today", detail: "Leads RMW across strategy, creative, media and AI" },
] as const;

type Dot = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  delay: number;
  r: number;
  color: string;
};

function samplePortrait(img: HTMLImageElement, width: number, height: number) {
  const cols = 62;
  const step = Math.max(4, width / cols);
  const sampleW = Math.max(1, Math.round(width / step));
  const sampleH = Math.max(1, Math.round(height / step));
  const sample = document.createElement("canvas");
  sample.width = sampleW;
  sample.height = sampleH;
  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  if (!sampleCtx) return [];

  sampleCtx.drawImage(img, 0, 0, sampleW, sampleH);
  const pixels = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
  const dots: Dot[] = [];
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy) || 1;
  for (let row = 0; row < sampleH; row++) {
    for (let col = 0; col < sampleW; col++) {
      const index = (row * sampleW + col) * 4;
      const alpha = pixels[index + 3];
      if (alpha < 24) continue;

      const x = (col + 0.5) * (width / sampleW);
      const y = (row + 0.5) * (height / sampleH);
      const fromCenter = Math.hypot(x - cx, y - cy) / maxDist;
      const inset = 6;
      const jitterX = (Math.random() - 0.5) * width * 0.62;
      const jitterY = (Math.random() - 0.5) * height * 0.62;

      dots.push({
        x,
        y,
        sx: Math.min(width - inset, Math.max(inset, x + jitterX)),
        sy: Math.min(height - inset, Math.max(inset, y + jitterY)),
        delay: fromCenter * 0.22,
        r: (width / sampleW) * 0.48,
        color: `rgb(${pixels[index]},${pixels[index + 1]},${pixels[index + 2]})`,
      });
    }
  }

  return dots;
}

function easeOut(value: number) {
  return 1 - (1 - value) ** 3;
}

export function AboutFounder() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const card = root.querySelector<HTMLElement>(".about-founder-card");
      const img = root.querySelector<HTMLImageElement>(".about-founder-portrait");
      const canvas = root.querySelector<HTMLCanvasElement>(".about-founder-assemble");
      if (!card || !img || !canvas) return;

      if (reduced) {
        card.classList.add("is-settled");
        canvas.hidden = true;
        return;
      }

      let cancelled = false;
      let trigger: ScrollTrigger | null = null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const paint = (progress: number, dots: Dot[], width: number, height: number) => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        for (const dot of dots) {
          const span = 1 - dot.delay;
          const local = Math.min(1, Math.max(0, (progress - dot.delay) / span));
          const eased = easeOut(local);
          const x = dot.sx + (dot.x - dot.sx) * eased;
          const y = dot.sy + (dot.y - dot.sy) * eased;
          ctx.globalAlpha = 0.72 + 0.28 * eased;
          ctx.fillStyle = dot.color;
          ctx.beginPath();
          ctx.arc(x, y, dot.r * (0.55 + 0.45 * eased), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      };

      const play = () => {
        if (cancelled) return;
        const width = card.clientWidth;
        const height = card.clientHeight;
        if (!width || !height) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.hidden = false;

        const dots = samplePortrait(img, width, height);
        if (!dots.length) {
          card.classList.add("is-settled");
          canvas.hidden = true;
          return;
        }

        const draw = (progress: number) => {
          const gather = Math.min(1, progress / 0.78);
          paint(gather, dots, width, height);
          const fade = Math.max(0, (progress - 0.72) / 0.28);
          img.style.opacity = String(fade);
          img.style.visibility = fade > 0.01 ? "visible" : "hidden";
          canvas.style.opacity = String(1 - fade);
        };

        canvas.hidden = false;
        canvas.style.opacity = "1";
        img.style.opacity = "0";

        let played = 0;
        const apply = (progress: number) => {
          if (progress < played) return;
          played = progress;
          draw(played);
        };

        trigger?.kill();
        trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 1.45)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.direction < 0) return;
            apply(self.progress);
          },
        });

        const sync = () => {
          if (cancelled || !trigger) return;
          trigger.refresh();
          if (trigger.direction < 0) return;
          apply(trigger.progress);
        };

        requestAnimationFrame(sync);
        window.addEventListener("load", sync);
        const pendingImages = Array.from(document.images).filter((image) => !image.complete);
        pendingImages.forEach((image) => image.addEventListener("load", sync, { once: true }));
        const timers = [400, 1200, 2400].map((delay) => window.setTimeout(sync, delay));

        return () => {
          window.removeEventListener("load", sync);
          pendingImages.forEach((image) => image.removeEventListener("load", sync));
          timers.forEach((timer) => window.clearTimeout(timer));
        };
      };

      let stopLayout = () => {};
      const begin = () => {
        stopLayout();
        stopLayout = play() ?? (() => {});
      };

      if (img.complete && img.naturalWidth > 0) {
        begin();
      } else {
        img.addEventListener("load", begin, { once: true });
      }

      return () => {
        cancelled = true;
        img.removeEventListener("load", begin);
        stopLayout();
        trigger?.kill();
      };
    },
    { dependencies: [ready, reduced], scope: rootRef },
  );

  return (
    <section ref={rootRef} className="about-founder">
      <div className="about-founder-layout">
        <div className="about-founder-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="about-founder-stripes"
            src="/about/founder-stripes.png"
            alt=""
            width={83}
            height={754}
          />
          <figure className="about-founder-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="about-founder-portrait"
              src="/about/founder-portrait.png"
              alt="Ritesh Malik, founder of Ritz Media World since 2008"
              width={541}
              height={541}
            />
            <canvas className="about-founder-assemble" aria-hidden="true" />
          </figure>
        </div>
        <div className="about-founder-copy">
          <p className="about-founder-kicker">Founder details &amp; journey</p>
          <h2 className="about-founder-title">
            The driver
            <br />
            behind the route
          </h2>
          <p className="about-founder-role">
            Ritesh Malik · Founder &amp; Promoter, Ritz Media World And Creative Thinks Media
          </p>
          <p className="about-founder-lede">
            Ritesh founded Ritz Media World in August 2008 and has steered the agency ever
            since, growing it into a full-service creative, digital and media partner. [Add
            one or two lines on his background and philosophy.]
          </p>
          <ol className="about-founder-list">
            {STOPS.map((stop) => (
              <li key={stop.detail}>
                <span>
                  <span className="about-founder-when">{stop.when} · </span>
                  <span className="about-founder-detail">{stop.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
