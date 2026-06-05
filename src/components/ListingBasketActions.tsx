import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { useBasket } from "@/contexts/BasketContext";
import {
  canPurchase,
  isBatchProduct,
  isPreorder,
  maxPurchaseQty,
  stockLabel,
} from "@/lib/product-utils";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function ListingBasketActions({
  product,
  size = "default",
}: {
  product: Product;
  size?: "default" | "compact";
}) {
  const { addItem, items, setItemQty } = useBasket();
  const inBasket = (items[product.id] ?? 0) > 0;
  const basketQty = items[product.id] ?? 0;
  const preorder = isPreorder(product);
  const batch = isBatchProduct(product);
  const maxQty = maxPurchaseQty(product);
  const atMax = basketQty >= maxQty;

  if (!canPurchase(product)) return null;

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id);
    toast.success(
      preorder ? `Pre-order added — ${product.name}` : `Added ${product.name} to basket`,
    );
  };

  const compact = size === "compact";
  const stock = stockLabel(product);

  if (inBasket) {
    return (
      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
        {batch && maxQty > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setItemQty(product.id, basketQty - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink text-lg font-bold hover:bg-ink/5"
            >
              −
            </button>
            <span className="min-w-8 text-center text-sm font-bold">{basketQty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={atMax}
              onClick={() => addItem(product.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink text-lg font-bold hover:bg-ink/5 disabled:opacity-40"
            >
              +
            </button>
          </div>
        )}
        <Link
          to="/shop/basket"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-full border-2 border-ink bg-mustard font-bold uppercase tracking-wider text-ink leading-normal shadow-brutal transition-all hover:-translate-y-0.5 hover:bg-cream",
            compact ? "px-4 py-2.5 text-xs" : "px-8 py-4 text-sm md:text-base",
          )}
        >
          {batch && basketQty > 1
            ? `${basketQty} in basket — checkout`
            : preorder
              ? "Pre-order in basket — go to basket"
              : "In basket — go to basket"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      {stock && !compact && (
        <p className="text-sm font-bold uppercase tracking-wider text-purple-deep">{stock}</p>
      )}
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
    </div>
  );
}
