import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { useBasket } from "@/contexts/BasketContext";
import { canPurchase, isPreorder, type Listing } from "@/data/listings";
import { cn } from "@/lib/utils";

export function ListingBasketActions({
  listing,
  size = "default",
}: {
  listing: Listing;
  size?: "default" | "compact";
}) {
  const { addItem, items } = useBasket();
  const inBasket = (items[listing.id] ?? 0) > 0;
  const preorder = isPreorder(listing);

  if (!canPurchase(listing)) return null;

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(listing.id);
    toast.success(
      preorder ? `Pre-order added — ${listing.name}` : `Added ${listing.name} to basket`,
    );
  };

  const compact = size === "compact";

  if (inBasket) {
    return (
      <Link
        to="/shop/basket"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "inline-flex w-full items-center justify-center rounded-full border-2 border-ink bg-mustard font-bold uppercase tracking-wider text-ink leading-normal shadow-brutal transition-all hover:-translate-y-0.5 hover:bg-cream",
          compact ? "px-4 py-2.5 text-xs" : "px-8 py-4 text-sm md:text-base",
        )}
      >
        {preorder ? "Pre-order in basket — go to basket" : "In basket — go to basket"}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-full font-bold uppercase tracking-wider leading-normal shadow-brutal transition-all hover:-translate-y-0.5",
        preorder
          ? "border-2 border-ink bg-purple-deep text-cream hover:bg-ink"
          : "bg-ink text-cream hover:bg-purple-deep",
        compact ? "px-4 py-2.5 text-xs" : "px-8 py-4 text-sm md:text-base",
      )}
    >
      {preorder ? "Pre-order" : "Add to basket"}
    </button>
  );
}
