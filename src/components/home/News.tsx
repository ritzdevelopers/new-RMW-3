"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path
        d="M4.2 11.8 11.4 4.6M6.2 4.4h5.2v5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function News() {
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.fromTo(
        root.querySelectorAll("[data-news-item]"),
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

  return (
    <section ref={rootRef} className="news" aria-label="News and blogs">
      <div className="news-inner">
        <div data-news-item className="news-head">
          <div className="news-copy">
            <h2 className="news-title">{site.news.title}</h2>
            <p className="news-lede">{site.news.lede}</p>
          </div>

          <TransitionLink href={site.news.href} className="news-cta">
            {site.news.cta}
            <ArrowIcon />
          </TransitionLink>
        </div>

        <div className="news-grid">
          {site.news.posts.map((post) => (
            <TransitionLink
              key={post.slug}
              href={post.href}
              data-news-item
              className="news-card"
            >
              <div className="news-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt=""
                  width={900}
                  height={560}
                />
              </div>
              <div className="news-card-body">
                <p className="news-card-tags">
                  {post.tags.join(" • ").toUpperCase()}
                </p>
                <h3 className="news-card-title">{post.title}</h3>
                <span className="news-card-go" aria-hidden>
                  <ArrowIcon />
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
