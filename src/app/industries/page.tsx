import type { Metadata } from "next";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesPage() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-32 pb-24 md:px-10">
      <p className="hero-kicker">Who we work with</p>
      <h1 className="hero-title">Industries</h1>
      <p className="hero-lede">
        From consumer brands to culture-led businesses, we build work that can
        move across India and the world.
      </p>
    </section>
  );
}
