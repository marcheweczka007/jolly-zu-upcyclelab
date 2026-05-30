import { availabilityLabel, type Listing } from "@/data/listings";
import { cn } from "@/lib/utils";

export function ListingAvailabilityBadge({ listing }: { listing: Listing }) {
  const label = availabilityLabel(listing);
  if (!label) return null;

  return (
    <span
      className={cn(
        "absolute left-3 top-3 rounded-full border-2 border-ink px-3 py-1 text-xs font-black uppercase tracking-wider",
        listing.availability === "preorder" ? "bg-purple-deep text-cream" : "bg-cream text-ink",
      )}
    >
      {label}
    </span>
  );
}
