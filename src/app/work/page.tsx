import type { Metadata } from "next";
import { FadeIn } from "@/components/motion/FadeIn";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { RevealText } from "@/components/motion/RevealText";
import { projects } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <section className="px-6 pt-32 pb-24 md:px-10 md:pt-40 md:pb-32">
      <RevealText className="max-w-[12ch] font-serif text-6xl leading-[0.9] tracking-tight md:text-8xl">
        A quieter kind of spectacle.
      </RevealText>
      <FadeIn className="mt-8 max-w-md text-sm leading-7 text-muted">
        Placeholder case studies so the motion system can be felt across routes.
        Swap these with real projects when the content is ready.
      </FadeIn>
      <div className="mt-20 flex flex-col gap-20">
        {projects.map((project, index) => (
          <FadeIn key={project.slug} delay={index * 0.05}>
            <article className="grid gap-8 border-t border-line pt-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
                  0{index + 1} / {project.year}
                </p>
                <h2 className="mt-4 font-serif text-5xl tracking-tight md:text-6xl">
                  {project.title}
                </h2>
                <p className="mt-4 text-sm text-muted">{project.tag} campaign</p>
              </div>
              <div className="relative aspect-[16/11] overflow-hidden">
                <ParallaxMedia
                  src={project.image}
                  alt={project.title}
                  priority={index === 0}
                />
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
