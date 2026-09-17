"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { useMotion } from "@/components/providers/MotionProvider";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Preloader() {
  const { reduced, setReady } = useMotion();
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const revealPage = () => {
        setReady();
        document.documentElement.classList.remove("preloader-lock");
      };

      const finish = () => {
        if (doneRef.current) return;
        doneRef.current = true;
        revealPage();
        setVisible(false);
      };

      document.documentElement.classList.add("preloader-lock");

      if (reduced) {
        finish();
        return;
      }

      const logo = root.querySelector(".preloader-logo");
      const bar = root.querySelector(".preloader-bar-fill");
      const label = root.querySelector(".preloader-label");
      const count = root.querySelector("[data-count]");
      const counter = { value: 0 };

      gsap.set(logo, { autoAlpha: 0, y: 12 });
      gsap.set(label, { autoAlpha: 0 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ onComplete: finish });

      tl.to(logo, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0)
        .to(label, { autoAlpha: 1, duration: 0.35 }, 0.15)
        .to(bar, { scaleX: 1, duration: 1.6, ease: "power1.inOut" }, 0.2)
        .to(
          counter,
          {
            value: 100,
            duration: 1.6,
            ease: "power1.inOut",
            onUpdate: () => {
              if (count) {
                count.textContent = String(Math.round(counter.value)).padStart(3, "0");
              }
            },
          },
          0.2,
        )
        .to(
          root,
          {
            autoAlpha: 0,
            duration: 0.75,
            ease: "power2.inOut",
            onStart: revealPage,
          },
          "+=0.12",
        );

      const safety = window.setTimeout(finish, 4200);
      return () => window.clearTimeout(safety);
    },
    { scope: rootRef, dependencies: [reduced, setReady] },
  );

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="preloader"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="preloader-inner">
        <p className="preloader-logo">{site.name}</p>
        <div className="preloader-progress">
          <div className="preloader-bar" aria-hidden>
            <span className="preloader-bar-fill" />
          </div>
          <span className="preloader-count" data-count>
            000
          </span>
        </div>
        <p className="preloader-label">Loading</p>
      </div>
    </div>
  );
}
