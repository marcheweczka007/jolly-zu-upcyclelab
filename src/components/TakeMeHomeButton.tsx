import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBasket } from "@/contexts/BasketContext";
import {
  canPurchase,
  isBatchProduct,
  isPreorder,
  maxPurchaseQty,
} from "@/lib/product-utils";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

type TakeMeHomeButtonProps = {
  product: Product;
  className?: string;
};

/** Primary shop CTA — adds to basket (or links to basket if already added). */
export function TakeMeHomeButton({ product, className }: TakeMeHomeButtonProps) {
  const { items, setItemQty } = useBasket();
  const inBasket = (items[product.id] ?? 0) > 0;
  const basketQty = items[product.id] ?? 0;
  const preorder = isPreorder(product);
  const batch = isBatchProduct(product);
  const maxQty = maxPurchaseQty(product);
  const [pendingQty, setPendingQty] = useState(1);

  useEffect(() => {
    if (!inBasket) setPendingQty(1);
  }, [inBasket, product.id]);

  if (!canPurchase(product)) {
    return (
      <p
        className={cn(
          "text-center text-sm font-black uppercase tracking-wider text-ink/50",
          className,
        )}
      >
        Sold out
      </p>
    );
  }

  const buttonClass = cn(
    "inline-flex items-center justify-center rounded-full border-2 border-ink bg-ink px-8 py-4 text-base font-black uppercase tracking-wider text-cream shadow-brutal transition-all hover:-translate-y-0.5 hover:bg-purple-deep md:text-lg",
    className,
  );

  if (inBasket) {
    return (
      <Link
        to="/shop/basket"
        onClick={(e) => e.stopPropagation()}
        className={cn(buttonClass, "bg-mustard text-ink hover:bg-cream hover:text-ink")}
      >
        {basketQty > 1 ? `${basketQty} in basket` : "In basket — checkout"}
      </Link>
    );
  }

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const qty = batch && maxQty > 1 ? pendingQty : 1;
    setItemQty(product.id, qty);
    toast.success(
      qty > 1
        ? `Added ${qty} × ${product.name} to basket`
        : preorder
          ? `Pre-order added — ${product.name}`
          : `Added ${product.name} to basket`,
    );
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:items-end" onClick={(e) => e.stopPropagation()}>
      {batch && maxQty > 1 && (
        <div className="flex items-center justify-center gap-3 md:justify-end">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setPendingQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink font-bold hover:bg-ink/5"
          >
            −
          </button>
          <span className="min-w-6 text-center font-bold">{pendingQty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={pendingQty >= maxQty}
            onClick={() => setPendingQty((q) => Math.min(maxQty, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink font-bold hover:bg-ink/5 disabled:opacity-40"
          >
            +
          </button>
        </div>
      )}
      <button type="button" onClick={handleAdd} className={buttonClass}>
        {preorder ? "Pre-order" : "Take me home"}
      </button>
    </div>
  );
}
