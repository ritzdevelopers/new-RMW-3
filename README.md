# RMW

Award-style Next.js website foundation with Tailwind CSS, Lenis smooth scrolling, and GSAP motion.

## Stack

- **Next.js 16** App Router + TypeScript
- **Tailwind CSS 4**
- **Lenis** for smooth scrolling
- **GSAP** + ScrollTrigger + SplitText for cinematic animation
- **Barba-style page transitions** via a GSAP curtain (Barba.js itself is built for multi-page sites and conflicts with Next.js routing)

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Motion system

| Piece | Where |
| --- | --- |
| Smooth scroll | `src/components/providers/SmoothScroll.tsx` |
| Page transitions | `src/components/providers/PageTransition.tsx` + `TransitionLink` |
| Preloader / cursor | `src/components/layout` |
| Reveal, fade, parallax | `src/components/motion` |

Use `TransitionLink` for internal routes so the leave/enter overlay can play. Lenis and ScrollTrigger share one `requestAnimationFrame` loop.

`prefers-reduced-motion` disables Lenis, the preloader, and GSAP reveals.
