import { site } from "@/lib/site";

export function Ticker() {
  const items = [...site.ticker, ...site.ticker];

  return (
    <section className="ticker">
      <div className="ticker-pattern" />
      <div className="ticker-track" aria-hidden>
        <div className="ticker-row marquee">
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className="ticker-item">
              <span className="ticker-diamond" />
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="ticker-pattern ticker-pattern-bottom" />
    </section>
  );
}
