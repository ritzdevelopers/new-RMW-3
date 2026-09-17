import { FadeIn } from "@/components/motion/FadeIn";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { RevealText } from "@/components/motion/RevealText";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { projects } from "@/lib/site";

export function SelectedWork() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <div className="mb-16 flex items-end justify-between gap-6">
        <RevealText className="max-w-[10ch] font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
          Selected work
        </RevealText>
        <FadeIn>
          <TransitionLink
            href="/work"
            className="text-[11px] uppercase tracking-[0.24em] text-muted transition-colors hover:text-foreground"
          >
            All projects
          </TransitionLink>
        </FadeIn>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project, index) => (
          <FadeIn key={project.slug} delay={index * 0.08} className="group">
            <TransitionLink href="/work" className="block">
              <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-paper/10">
                <ParallaxMedia
                  src={project.image}
                  alt={project.title}
                  priority={index === 0}
                />
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-3xl tracking-tight">
                  {project.title}
                </h3>
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
                  {project.tag} · {project.year}
                </span>
              </div>
            </TransitionLink>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
