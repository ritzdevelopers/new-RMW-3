"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonIcon } from "@/components/layout/ButtonIcon";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="absolute top-0 right-0 left-0 z-50">
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

        <Link href="mailto:hello@ritzmediaworld.com" className="btn btn-ink">
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
