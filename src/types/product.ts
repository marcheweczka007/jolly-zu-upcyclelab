export type ProductAvailability = "available" | "preorder" | "sold_out";

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
  preorderNote?: string;
  sortOrder: number;
};
