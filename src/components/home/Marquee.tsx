const phrases = [
  "Smooth scroll",
  "Page transitions",
  "Split typography",
  "Parallax imagery",
  "Magnetic cursor",
  "Scroll storytelling",
];

export function Marquee() {
  const items = [...phrases, ...phrases];

  return (
    <section className="border-y border-line py-5 overflow-hidden">
      <div className="marquee flex w-max gap-10">
        {items.map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            className="flex items-center gap-10 font-serif text-4xl tracking-tight text-foreground/85 md:text-6xl"
          >
            {phrase}
            <span className="text-accent">*</span>
          </span>
        ))}
      </div>
    </section>
  );
}
