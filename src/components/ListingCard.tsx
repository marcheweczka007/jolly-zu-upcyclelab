import { Link } from "@tanstack/react-router";
import { ListingAvailabilityBadge } from "@/components/ListingAvailabilityBadge";
import { ListingBasketActions } from "@/components/ListingBasketActions";
import { canPurchase, formatPrice } from "@/lib/product-utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ListingCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-ink bg-cream shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg">
      <Link
        to="/shop/$listingId"
        params={{ listingId: product.id }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.imageAlt}
              className={cn(
                "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
                !canPurchase(product) && "opacity-75 saturate-50",
              )}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink/40">No image</div>
          )}
          <ListingAvailabilityBadge product={product} />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          {product.tagline && (
            <p className="text-xs font-bold uppercase tracking-widest text-purple-deep">
              {product.tagline}
            </p>
          )}
          <h2 className="text-display text-xl leading-tight text-ink">{product.name}</h2>
          <p className="flex-1 text-sm text-ink/65 line-clamp-2">{product.description}</p>
          <p className="text-display text-lg text-ink">{formatPrice(product.pricePence)}</p>
        </div>
      </Link>
      <div className="mt-auto shrink-0 px-5 pb-5 pt-3">
        {canPurchase(product) ? (
          <ListingBasketActions product={product} size="compact" />
        ) : (
          <p className="text-center text-xs font-black uppercase tracking-wider text-ink/50">Sold out</p>
        )}
      </div>
    </article>
  );
}
