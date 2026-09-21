import { site } from "@/lib/site";

export function Ticker() {
  return (
    <section className="ticker">
      <div className="ticker-pattern" />
      <div className="ticker-track">
        <div className="ticker-row">
          {site.ticker.map((item) => (
            <span key={item} className="ticker-item">
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
