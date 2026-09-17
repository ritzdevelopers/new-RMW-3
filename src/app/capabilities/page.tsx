import type { Metadata } from "next";

export const metadata: Metadata = { title: "Capabilities" };

export default function CapabilitiesPage() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-32 pb-24 md:px-10">
      <p className="hero-kicker">What we do</p>
      <h1 className="hero-title">Capabilities</h1>
      <p className="hero-lede">
        Brand, campaign, media, digital, film, 3D and AI — a full creative stack
        for ideas that travel.
      </p>
    </section>
  );
}
