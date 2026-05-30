/**
 * Shop catalog — edit here for copy, images, prices shown on site, and availability.
 * Checkout uses Stripe Price IDs in Netlify env (STRIPE_PRICE_*) via create-checkout-session.
 * Listing `id` must match the keys in netlify/functions/create-checkout-session.mjs CATALOG.
 */
import bagsFlatlay from "@/assets/bags-flatlay.jpg";
import collectionFlatlay from "@/assets/collection-flatlay.jpg";
import fabricStack from "@/assets/fabric-stack.jpg";
import heroProduct from "@/assets/hero-product.jpg";

export type ListingAvailability = "available" | "preorder" | "sold_out";

export type Listing = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Display price on site (keep in sync with the matching Stripe Price) */
  pricePence: number;
  image: string;
  imageAlt: string;
  materials: string[];
  dimensions: string;
  availability: ListingAvailability;
  /** Shown on detail page for pre-order pieces */
  preorderNote?: string;
};

export function canPurchase(listing: Listing): boolean {
  return listing.availability === "available" || listing.availability === "preorder";
}

export function isPreorder(listing: Listing): boolean {
  return listing.availability === "preorder";
}

export function availabilityLabel(listing: Listing): string | null {
  if (listing.availability === "sold_out") return "Sold out";
  if (listing.availability === "preorder") return "Pre-order";
  return null;
}

export const LISTINGS: Listing[] = [
  {
    id: "rope-crossbody-magenta",
    name: "Rope Strap Crossbody",
    tagline: "Waterproof shell · orange rope",
    description:
      "Hand-cut from rescued rainwear with a braided rope strap. Fully lined, one interior pocket. Built for daily carry and Scottish weather.",
    pricePence: 4800,
    image: heroProduct,
    imageAlt: "Magenta waterproof crossbody bag with orange rope strap",
    materials: ["Rescued raincoat shell", "Braided cotton rope", "Recycled lining"],
    dimensions: "W 24 × H 18 × D 8 cm · strap 110–130 cm",
    availability: "available",
  },
  {
    id: "patchwork-tote-leaf",
    name: "Patchwork Market Tote",
    tagline: "Denim + curtain scraps",
    description:
      "Oversized tote stitched from denim offcuts and vintage curtain panels. Reinforced base, open top — fits a laptop and your Saturday market haul.",
    pricePence: 5200,
    image: bagsFlatlay,
    imageAlt: "Flat lay of handmade patchwork tote bags",
    materials: ["Denim offcuts", "Vintage curtain cotton", "Cotton webbing handles"],
    dimensions: "W 42 × H 38 × D 12 cm",
    availability: "available",
  },
  {
    id: "mini-belt-bag-mustard",
    name: "Mini Belt Bag",
    tagline: "Rave-ready · adjustable belt",
    description:
      "Compact belt bag from mustard deadstock nylon and contrast zip tape. Where JollyZu started — still the fastest seller every drop.",
    pricePence: 3600,
    image: collectionFlatlay,
    imageAlt: "Collection of small upcycled belt bags on a table",
    materials: ["Deadstock nylon", "YKK zip", "Adjustable webbing belt"],
    dimensions: "W 20 × H 14 × D 5 cm",
    availability: "available",
  },
  {
    id: "drawstring-backpack-lilac",
    name: "Drawstring Backpack",
    tagline: "Soft structure · lilac mix",
    description:
      "Lightweight drawstring pack from mixed rescued textiles. Padded straps, internal slip pocket. One-of-one colourway — won't be remade.",
    pricePence: 4400,
    image: fabricStack,
    imageAlt: "Stack of colourful rescued fabrics ready for cutting",
    materials: ["Mixed rescued wovens", "Cotton drawcord", "Soft strap padding"],
    dimensions: "W 30 × H 40 cm (relaxed)",
    availability: "preorder",
    preorderNote:
      "Reserve this piece now — Zuza will cut and sew your bag over the next 2–3 weeks, then post from Edinburgh.",
  },
];

export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

export function formatPrice(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}
