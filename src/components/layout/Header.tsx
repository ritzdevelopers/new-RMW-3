"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonIcon } from "@/components/layout/ButtonIcon";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMotion } from "@/components/providers/MotionProvider";
import { cn } from "@/lib/cn";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/lib/site";

registerGsap();
gsap.registerPlugin(useGSAP);

export function Header() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const { ready, reduced } = useMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on route change and when the viewport grows
  // back into the desktop nav breakpoint.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    media.addEventListener("change", onChange);
    window.addEventListener("keydown", onKey);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (reduced) {
        gsap.set(root, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(root, { autoAlpha: 0, y: -10 });
    },
    { dependencies: [reduced] },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready || reduced) return;

      gsap.to(root, {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        ease: "power2.out",
      });
    },
    { dependencies: [ready, reduced] },
  );

  return (
    <header ref={rootRef} className="site-header absolute top-0 right-0 left-0 z-50">
      <div className="site-header-bar flex items-center justify-between gap-4 px-5 py-5 md:px-10 md:py-6">
        <TransitionLink href="/" className="flex items-center gap-2" aria-label={site.fullName}>
          <BrandMark />
        </TransitionLink>

        <nav className="site-nav">
          {site.nav.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={cn(
                "site-nav-link",
                pathname === item.href && "is-active",
              )}
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>

        <div className="site-header-actions">
          <Link href="/#start-a-project" className="btn btn-ink">
            Start a project
            <ButtonIcon name="plus" />
          </Link>

          <button
            type="button"
            className={cn("site-nav-toggle", menuOpen && "is-open")}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-nav-mobile"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {menuOpen ? (
          <nav id="site-nav-mobile" className="site-nav-mobile" aria-label="Mobile">
            {site.nav.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={cn(
                  "site-nav-link",
                  pathname === item.href && "is-active",
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </TransitionLink>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark">
      <Image
        src="/logo.png"
        alt=""
        width={61}
        height={77}
        className="brand-mark-logo"
        priority
      />
    </span>
  );
}
