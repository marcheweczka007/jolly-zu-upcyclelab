import { SHOP_URL } from "./SiteHeader";

export function ShopCTA({
  variant = "default",
  label = "Shop the Drop",
}: {
  variant?: "default" | "huge" | "outline";
  label?: string;
}) {
  if (variant === "huge") {
    return (
      <a
        href={SHOP_URL}
        target="_blank"
        rel="noreferrer"
        className="text-display group inline-flex items-center gap-4 rounded-full bg-ink px-10 py-6 text-2xl uppercase text-cream shadow-brutal transition-all hover:-translate-y-1 hover:bg-purple-deep hover:shadow-brutal-lg md:px-14 md:py-8 md:text-4xl"
      >
        {label}
        <span className="text-mustard transition-transform group-hover:translate-x-1 text-4xl items-center mb-[12px]">
          ↗
        </span>
      </a>
    );
  }
  if (variant === "outline") {
    return (
      <a
        href={SHOP_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink transition-all hover:bg-ink hover:text-cream"
      >
        {label} ↗
      </a>
    );
  }
  return (
    <a
      href={SHOP_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5 hover:bg-purple-deep"
    >
      {label} ↗
    </a>
  );
}
