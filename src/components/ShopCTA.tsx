import { Link } from "@tanstack/react-router";
import { useVintedShop } from "@/contexts/VintedShopContext";
import { SHOW_SHOP } from "@/constants/shop";

export function ShopCTA({
  variant = "default",
  label = "Shop the Drop",
}: {
  variant?: "default" | "huge" | "outline" | "mustard";
  label?: string;
}) {
  const { openShop } = useVintedShop();

  const classNames = {
    huge: "text-display group inline-flex items-center gap-4 rounded-full bg-ink px-10 py-6 text-2xl uppercase text-cream shadow-brutal transition-all hover:-translate-y-1 hover:bg-purple-deep hover:shadow-brutal-lg md:px-14 md:py-8 md:text-4xl",
    mustard:
      "text-display group inline-flex items-center gap-4 rounded-full bg-mustard px-10 py-6 text-2xl uppercase text-ink shadow-brutal transition-all hover:-translate-y-1 hover:bg-cream hover:shadow-brutal-lg md:px-14 md:py-8 md:text-4xl",
    outline:
      "inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink transition-all hover:bg-ink hover:text-cream",
    default:
      "inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5 hover:bg-purple-deep",
  } as const;

  const arrowClass =
    variant === "huge"
      ? "text-mustard transition-transform group-hover:translate-x-1 text-4xl items-center mb-[12px]"
      : variant === "mustard"
        ? "text-purple-deep transition-transform group-hover:translate-x-1"
        : null;

  const className = classNames[variant];

  if (!SHOW_SHOP) {
    return (
      <button type="button" onClick={openShop} className={className}>
        {label}
        {arrowClass ? <span className={arrowClass}>→</span> : <> →</>}
      </button>
    );
  }

  if (variant === "huge") {
    return (
      <Link to="/shop" className={className}>
        {label}
        <span className={arrowClass!}>→</span>
      </Link>
    );
  }
  if (variant === "mustard") {
    return (
      <Link to="/shop" className={className}>
        {label}
        <span className={arrowClass!}>→</span>
      </Link>
    );
  }
  if (variant === "outline") {
    return (
      <Link to="/shop" className={className}>
        {label} →
      </Link>
    );
  }
  return (
    <Link to="/shop" className={className}>
      {label} →
    </Link>
  );
}
