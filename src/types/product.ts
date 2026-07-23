export type ProductAvailability = "available" | "preorder" | "sold_out";

/** Shop category — set via Stripe metadata `category`. Defaults to bags. */
export type ProductCategory = "bags" | "chalk-bags";

export type Product = {
  id: string;
  stripeProductId: string;
  stripePriceId: string | null;
  name: string;
  tagline: string;
  description: string;
  pricePence: number;
  currency: string;
  image: string;
  images: string[];
  imageAlt: string;
  materials: string[];
  dimensions: string;
  availability: ProductAvailability;
  category: ProductCategory;
  preorderNote?: string;
  sortOrder: number;
  /** Set when metadata stock_total is present (batch listing). */
  stockTotal: number | null;
  stockAvailable: number | null;
};
