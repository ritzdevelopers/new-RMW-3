export function ButtonIcon({ name }: { name: "arrow" | "plus" }) {
  return <span className={`btn-icon btn-icon-${name}`} aria-hidden />;
}
