import { availabilityLabel } from "@/lib/product-utils";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function ListingAvailabilityBadge({ product }: { product: Product }) {
  const label = availabilityLabel(product);
  if (!label) return null;

  return (
    <span
      className={cn(
        "absolute left-3 top-3 rounded-full border-2 border-ink px-3 py-1 text-xs font-black uppercase tracking-wider",
        product.availability === "preorder" ? "bg-purple-deep text-cream" : "bg-cream text-ink",
      )}
    >
      {label}
    </span>
  );
}
