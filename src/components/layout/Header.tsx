"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-6 py-6 md:px-10">
        <Magnetic>
          <TransitionLink
            href="/"
            className="font-serif text-2xl tracking-tight text-white"
          >
            {site.name}
          </TransitionLink>
        </Magnetic>
        <nav className="flex items-center gap-7 text-[11px] uppercase tracking-[0.24em] text-white">
          {site.nav.map((item) => (
            <Magnetic key={item.href} strength={0.25}>
              <TransitionLink
                href={item.href}
                className={cn(
                  "transition-opacity duration-300",
                  pathname === item.href ? "opacity-100" : "opacity-55 hover:opacity-100",
                )}
              >
                {item.label}
              </TransitionLink>
            </Magnetic>
          ))}
          <Magnetic strength={0.25}>
            <Link
              href="mailto:hello@rmw.studio"
              className="hidden opacity-55 transition-opacity duration-300 hover:opacity-100 md:inline"
            >
              Contact
            </Link>
          </Magnetic>
        </nav>
      </div>
    </header>
  );
}
