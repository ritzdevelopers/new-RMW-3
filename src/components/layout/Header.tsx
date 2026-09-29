"use client";

import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const html = document.documentElement;
    const toggle = toggleRef.current;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      html.style.overflow = previous;
      lenis?.start();
      toggle?.focus({ preventScroll: true });
    };
  }, [menuOpen, lenis]);

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
            Contact us
          </Link>

          <button
            ref={toggleRef}
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

      </div>

      {mounted
        ? createPortal(
            <MobileMenu
              open={menuOpen}
              pathname={pathname}
              onClose={() => setMenuOpen(false)}
            />,
            document.body,
          )
        : null}
    </header>
  );
}

function MobileMenu({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <div
      id="site-nav-mobile"
      className={cn("mnav", open && "is-open")}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      data-lenis-prevent
    >
      <div className="mnav-glow" aria-hidden />

      <div className="mnav-top">
        <TransitionLink href="/" aria-label={site.fullName} onClick={onClose}>
          <BrandMark />
        </TransitionLink>
        <button
          ref={closeRef}
          type="button"
          className="mnav-close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <span />
          <span />
        </button>
      </div>

      <nav className="mnav-links" aria-label="Mobile">
        {site.nav.map((item, index) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            className={cn("mnav-link", pathname === item.href && "is-active")}
            style={{ "--i": index } as React.CSSProperties}
            onClick={onClose}
          >
            <span className="mnav-num">{String(index + 1).padStart(2, "0")}</span>
            <span className="mnav-label">{item.label}</span>
            <span className="mnav-arrow" aria-hidden>
              →
            </span>
          </TransitionLink>
        ))}
      </nav>

      <div className="mnav-foot">
        <Link href="/#start-a-project" className="mnav-cta" onClick={onClose}>
          Start a project
          <span aria-hidden>→</span>
        </Link>
        <div className="mnav-contact">
          <a href={`mailto:${site.footer.email}`}>{site.footer.email}</a>
          {site.footer.phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
              {phone}
            </a>
          ))}
        </div>
        <p className="mnav-tagline">{site.tagline}</p>
      </div>
    </div>
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
