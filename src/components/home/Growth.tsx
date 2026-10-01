"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

const SERVICE_ICONS = [SearchIcon, PeopleIcon, ChartIcon, TargetIcon] as const;

function splitItem(item: string) {
  const match = item.match(/^(.*?)\s*(\([^)]*\))$/);
  if (!match) return { name: item, detail: "" };
  return { name: match[1], detail: match[2] };
}

export function Growth() {
  const rootRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotion();
  const [active, setActive] = useState(0);
  const slide = site.growth.slides[active];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelectorAll("[data-growth-item]"),
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%" },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  useGSAP(
    () => {
      const copy = copyRef.current;
      if (!copy || reduced) return;

      gsap.fromTo(
        copy,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    },
    { dependencies: [active, reduced] },
  );

  return (
    <section ref={rootRef} className="growth" aria-label="Growth strategies">
      <div className="ticker-pattern growth-pattern" aria-hidden />
      <div className="growth-body">
        <div className="growth-art" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/s5/highway.jpg" alt="" width={1024} height={576} />
        </div>

        <div data-growth-item className="growth-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={slide.id}
            src={slide.image ?? "/s5/banner-hoarding.png"}
            alt="Digital marketing"
            width={1024}
            height={682}
          />
        </div>

        <div className="growth-road" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/s5/highway.jpg" alt="" width={1024} height={576} />
        </div>

        <div className="growth-inner">
          <div ref={copyRef} className="growth-copy">
            <p data-growth-item className="growth-kicker">
              Capabilities
            </p>
            <h2 data-growth-item className="growth-title">
              {slide.title.split("\n").map((line) => (
                <span key={line} className="growth-title-line">
                  <Brush />
                  {line}
                </span>
              ))}
            </h2>
            <ul data-growth-item className="growth-list">
              {slide.items.map((item, index) => {
                const { name, detail } = splitItem(item);
                const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
                return (
                  <li key={item}>
                    <span className="growth-badge" aria-hidden>
                      <Icon />
                    </span>
                    <span className="growth-label">
                      <span className="growth-name">{name}</span>
                      {detail ? <span className="growth-detail">{detail}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
            <TransitionLink
              data-growth-item
              href={site.growth.href}
              className="growth-btn"
            >
              <Flourish className="is-left" />
              <span>
                {site.growth.cta}
                <Arrow />
              </span>
              <Flourish className="is-right" />
            </TransitionLink>
            <div
              data-growth-item
              className="growth-dots"
              role="tablist"
              aria-label="Capability slides"
            >
              {site.growth.slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-label={item.title.replace(/\n/g, " ")}
                  aria-selected={index === active}
                  className={
                    index === active
                      ? "growth-dot growth-dot-active"
                      : "growth-dot"
                  }
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ticker-pattern growth-pattern" aria-hidden />
    </section>
  );
}

function Brush() {
  return (
    <svg className="growth-brush" viewBox="0 0 640 92" preserveAspectRatio="none" aria-hidden>
      <path
        fill="#172033"
        d="M28 46c18-24 62-34 118-36 74-3 150 8 228 6 70-2 132-16 196-8 28 4 52 16 58 32-8 18-40 30-86 36-78 10-160-2-242 2-86 4-168 18-246 10-36-4-58-16-26-42z"
      />
    </svg>
  );
}

function Flourish({ className }: { className: string }) {
  return (
    <svg className={`growth-flourish ${className}`} viewBox="0 0 72 72" aria-hidden>
      <circle cx="36" cy="36" r="16" fill="#e23a2f" stroke="#f3c14a" strokeWidth="3" />
      <g fill="#f3c14a" stroke="#1f8a42" strokeWidth="1.2">
        <ellipse cx="36" cy="14" rx="7" ry="10" />
        <ellipse cx="36" cy="58" rx="7" ry="10" />
        <ellipse cx="14" cy="36" rx="10" ry="7" />
        <ellipse cx="58" cy="36" rx="10" ry="7" />
        <ellipse cx="20" cy="20" rx="7" ry="9" transform="rotate(-40 20 20)" />
        <ellipse cx="52" cy="20" rx="7" ry="9" transform="rotate(40 52 20)" />
        <ellipse cx="20" cy="52" rx="7" ry="9" transform="rotate(40 20 52)" />
        <ellipse cx="52" cy="52" rx="7" ry="9" transform="rotate(-40 52 52)" />
      </g>
      <circle cx="36" cy="36" r="6" fill="#f6d56a" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg className="growth-arrow" viewBox="0 0 18 18" aria-hidden>
      <path d="M4 9h10M10 5l4 4-4 4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M15 15.5L20 20.5" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="9" cy="9" r="3" />
      <circle cx="16" cy="10" r="2.4" />
      <path d="M3.5 18.5c.6-2.6 2.8-4 5.5-4s4.9 1.4 5.5 4" />
      <path d="M14 14.6c1.6-.3 3.2.3 4.2 1.9" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 19h16" />
      <path d="M7 16v-4M12 16V8M17 16v-6" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
