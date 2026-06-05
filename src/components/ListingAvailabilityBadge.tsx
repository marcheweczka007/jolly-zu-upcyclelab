import { availabilityLabel, isPreorder, stockLabel } from "@/lib/product-utils";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function ListingAvailabilityBadge({ product }: { product: Product }) {
  const label = availabilityLabel(product);
  if (!label) return null;

  const isStock = Boolean(stockLabel(product));

  return (
    <span
      className={cn(
        "absolute left-3 top-3 z-10 rounded-full border-2 border-ink px-3 py-1 text-xs font-black tracking-wide shadow-brutal",
        isStock && "bg-leaf text-cream normal-case",
        product.availability === "sold_out" && "bg-muted text-ink uppercase",
        isPreorder(product) && "bg-purple-deep text-cream uppercase",
        !isStock &&
          product.availability === "available" &&
          "bg-cream text-ink uppercase",
      )}
    >
      {label}
    </span>
  );
}
