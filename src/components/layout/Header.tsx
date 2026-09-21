"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ButtonIcon } from "@/components/layout/ButtonIcon";
import { Magnetic } from "@/components/motion/Magnetic";
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
      <div className="flex items-center justify-between gap-4 px-5 py-5 md:px-10 md:py-6">
        <Magnetic>
          <TransitionLink href="/" className="flex items-center gap-2" aria-label={site.fullName}>
            <BrandMark />
          </TransitionLink>
        </Magnetic>

        <nav className="site-nav">
          {site.nav.map((item) => (
            <Magnetic key={item.href} strength={0.2}>
              <TransitionLink
                href={item.href}
                className={cn(
                  "site-nav-link",
                  pathname === item.href && "is-active",
                )}
              >
                {item.label}
              </TransitionLink>
            </Magnetic>
          ))}
        </nav>

        <Link href="/#start-a-project" className="btn btn-ink">
          Start a project
          <ButtonIcon name="plus" />
        </Link>
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
