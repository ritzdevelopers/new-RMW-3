import type { Metadata } from "next";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-32 pb-24 md:px-10">
      <p className="hero-kicker">Thinking</p>
      <h1 className="hero-title">Insights</h1>
      <p className="hero-lede">
        Notes on craft, culture and campaigns. Real work writing coming next.
      </p>
    </section>
  );
}
