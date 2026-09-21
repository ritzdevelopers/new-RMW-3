"use client";

import { useGSAP } from "@gsap/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

type Review = (typeof site.reviews.items)[number];
type Slot = "left" | "center" | "right" | "hidden";

const AUTO_MS = 2500;

function reviewRing(items: Review[]) {
  if (items.length >= 3) return items;
  const ring: Review[] = [];
  for (let i = 0; i < 3; i += 1) {
    ring.push(items[i % items.length]);
  }
  return ring;
}

function slotFor(index: number, active: number, total: number): Slot {
  const raw = (index - active + total) % total;
  const offset = raw > total / 2 ? raw - total : raw;
  if (offset === 0) return "center";
  if (offset === -1) return "left";
  if (offset === 1) return "right";
  return "hidden";
}

function ReviewCard({
  review,
  slot,
  onSelect,
}: {
  review: Review;
  slot: Slot;
  onSelect?: () => void;
}) {
  const featured = slot === "center";

  return (
    <article
      className={cn("reviews-card", `is-${slot}`, featured && "reviews-card-featured")}
      onClick={slot === "left" || slot === "right" ? onSelect : undefined}
    >
      <div className="reviews-avatar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={review.photo} alt="" width={64} height={64} />
      </div>
      <p className="reviews-role">- {review.role}</p>
      <p className="reviews-company">{review.company}</p>
      <div className="reviews-copy">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/s8/star-rating.png"
          alt="5.0 rating"
          width={138}
          height={18}
          className="reviews-stars"
        />
        <p className="reviews-quote">“{review.quote}”</p>
      </div>
      {featured ? (
        <div className="reviews-foot">
          <span className="reviews-verified">Verified Review</span>
          <span className="reviews-chip">{review.company}</span>
        </div>
      ) : (
        <p className="reviews-foot-name">{review.company}</p>
      )}
    </article>
  );
}

export function Reviews() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const items = useMemo(() => reviewRing(site.reviews.items), []);
  const total = items.length;
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  const go = (next: number) => {
    setActive((next + total) % total);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !inView || paused || total < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [active, inView, paused, reduced, total]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelector(".reviews-stage"),
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 78%" },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <section
      ref={rootRef}
      className="reviews"
      aria-label="Client reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="reviews-title">{site.reviews.title}</h2>

      <div className="reviews-stage">
        <div className="reviews-track" aria-live="polite">
          {items.map((review, index) => {
            const slot = slotFor(index, active, total);
            return (
              <ReviewCard
                key={`${review.company}-${index}`}
                review={review}
                slot={slot}
                onSelect={() => go(slot === "left" ? active - 1 : active + 1)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
