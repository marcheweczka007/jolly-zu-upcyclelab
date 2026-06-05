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

function QuantityStepper({
  qty,
  maxQty,
  onDecrease,
  onIncrease,
  size = "default",
}: {
  qty: number;
  maxQty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: "default" | "compact";
}) {
  const atMax = qty >= maxQty;
  const buttonClass = cn(
    "flex items-center justify-center rounded-full border-2 border-ink font-bold hover:bg-ink/5 disabled:opacity-40",
    size === "compact" ? "h-9 w-9 text-lg" : "h-11 w-11 text-xl",
  );

  return (
    <div className="flex items-center gap-4">
      <button type="button" aria-label="Decrease quantity" onClick={onDecrease} className={buttonClass}>
        −
      </button>
      <span className={cn("min-w-8 text-center font-bold", size === "compact" ? "text-sm" : "text-base")}>
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={atMax}
        onClick={onIncrease}
        className={buttonClass}
      >
        +
      </button>
    </div>
  );
}

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
  const compact = size === "compact";
  const showStepper = batch && maxQty > 1 && !compact;

  const [pendingQty, setPendingQty] = useState(1);

  useEffect(() => {
    if (!inBasket) {
      setPendingQty(1);
    }
  }, [inBasket, product.id]);

  if (!canPurchase(product)) return null;

  const displayQty = inBasket ? basketQty : pendingQty;

  const handleDecrease = () => {
    if (inBasket) {
      setItemQty(product.id, basketQty - 1);
      return;
    }
    setPendingQty((q) => Math.max(1, q - 1));
  };

  const handleIncrease = () => {
    if (inBasket) {
      addItem(product.id);
      return;
    }
    setPendingQty((q) => Math.min(maxQty, q + 1));
  };

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setItemQty(product.id, pendingQty);
    toast.success(
      pendingQty > 1
        ? `Added ${pendingQty} × ${product.name} to basket`
        : preorder
          ? `Pre-order added — ${product.name}`
          : `Added ${product.name} to basket`,
    );
  };

  const buttonClass = cn(
    "inline-flex w-full items-center justify-center rounded-full font-bold uppercase tracking-wider leading-normal shadow-brutal transition-all hover:-translate-y-0.5",
    preorder
      ? "border-2 border-ink bg-purple-deep text-cream hover:bg-ink"
      : "bg-ink text-cream hover:bg-purple-deep",
    compact ? "px-4 py-2.5 text-xs" : "px-8 py-4 text-sm md:text-base",
  );

  if (inBasket) {
    return (
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        {showStepper && (
          <QuantityStepper
            qty={displayQty}
            maxQty={maxQty}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
          />
        )}
        <Link
          to="/shop/basket"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-full border-2 border-ink bg-mustard font-bold uppercase tracking-wider text-ink leading-normal shadow-brutal transition-all hover:-translate-y-0.5 hover:bg-cream",
            compact ? "px-4 py-2.5 text-xs" : "px-8 py-4 text-sm md:text-base",
          )}
        >
          {basketQty > 1
            ? `${basketQty} in basket — checkout`
            : preorder
              ? "Pre-order in basket — go to basket"
              : "In basket — go to basket"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      {showStepper && (
        <QuantityStepper
          qty={displayQty}
          maxQty={maxQty}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
        />
      )}
      <button type="button" onClick={handleAdd} className={buttonClass}>
        {preorder ? "Pre-order" : showStepper ? `Add ${displayQty} to basket` : "Add to basket"}
      </button>
    </div>
  );
}
