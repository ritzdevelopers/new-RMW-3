"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

const TRUCK_GAP = 8;

export function Footer() {
  const data = site.footer;
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;

      const road = root.querySelector(".site-footer-road") as HTMLElement | null;
      const truck = root.querySelector(".site-footer-truck") as HTMLElement | null;
      const milestone = root.querySelector(
        ".site-footer-milestone",
      ) as HTMLElement | null;
      if (!road || !truck || !milestone) return;

      const destinationX = () =>
        Math.max(
          0,
          milestone.offsetLeft - truck.offsetLeft - truck.offsetWidth - TRUCK_GAP,
        );

      if (reduced) {
        gsap.set(truck, { x: destinationX() });
        return;
      }

      gsap.set(truck, { x: 0 });

      gsap.fromTo(
        truck,
        { x: 0 },
        {
          x: destinationX,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 2.2,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: rootRef, dependencies: [ready, reduced] },
  );

  return (
    <footer ref={rootRef} className="site-footer">
      <div className="site-footer-dash" aria-hidden />

      <div className="site-footer-inner">
        <div className="site-footer-intro">
          <h2 className="site-footer-title">
            <span>{data.title[0]}</span>
            <span className="site-footer-title-row">
              <span className="site-footer-title-accent">{data.title[1]}</span>
              <span>{data.title[2]}</span>
            </span>
            <span>{data.title[3]}</span>
          </h2>
          <p className="site-footer-blurb">{data.blurb}</p>
          <p className="site-footer-address">{data.address}</p>
          <p className="site-footer-contact">
            <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>
          <p className="site-footer-phones">
            {data.phones.map((phone, index) => (
              <span key={phone}>
                {index > 0 ? <span className="site-footer-dot" aria-hidden> · </span> : null}
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </span>
            ))}
          </p>
        </div>

        <nav className="site-footer-nav" aria-label="Footer">
          {data.columns.map((column) => (
            <div key={column.title} className="site-footer-col">
              <h3 className="site-footer-col-title">{column.title}</h3>
              <ul className="site-footer-col-list">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-footer-link"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <TransitionLink href={link.href} className="site-footer-link">
                        {link.label}
                      </TransitionLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="site-footer-road" aria-hidden>
        <div className="site-footer-rule" />
        <div className="site-footer-truck">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer/truck.png" alt="" width={120} height={56} />
        </div>
        <div className="site-footer-milestone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer/milestone.png" alt="" width={256} height={256} />
          <span className="site-footer-milestone-text">
            Ritz
            <br />
            Media
          </span>
        </div>
      </div>
    </footer>
  );
}
