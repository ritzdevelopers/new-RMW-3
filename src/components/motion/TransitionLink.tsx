"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "@/components/providers/PageTransition";
import { cn } from "@/lib/cn";

type TransitionLinkProps = ComponentProps<typeof Link>;

export function TransitionLink({
  href,
  className,
  children,
  onClick,
  ...props
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  return (
    <Link
      href={href}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.button !== 0) return;

        const nextHref = typeof href === "string" ? href : href.pathname;
        if (!nextHref || nextHref.startsWith("mailto:") || nextHref.startsWith("tel:")) {
          return;
        }

        event.preventDefault();
        navigate(nextHref);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
