import { Link } from "@tanstack/react-router";
import { ListingAvailabilityBadge } from "@/components/ListingAvailabilityBadge";
import { ListingBasketActions } from "@/components/ListingBasketActions";
import { canPurchase, formatPrice, type Listing } from "@/data/listings";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-ink bg-cream shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg">
      <Link
        to="/shop/$listingId"
        params={{ listingId: listing.id }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={listing.image}
            alt={listing.imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <ListingAvailabilityBadge listing={listing} />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-deep">
            {listing.tagline}
          </p>
          <h2 className="text-display text-xl leading-tight text-ink">{listing.name}</h2>
          <p className="flex-1 text-sm text-ink/65 line-clamp-2">{listing.description}</p>
          <p className="text-display text-lg text-ink">{formatPrice(listing.pricePence)}</p>
        </div>
      </Link>
      <div className="mt-auto shrink-0 px-5 pb-5 pt-3">
        {canPurchase(listing) && <ListingBasketActions listing={listing} size="compact" />}
      </div>
    </article>
  );
}
