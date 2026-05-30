import type { Product } from "@/types/product";

export function canPurchase(product: Product): boolean {
  return product.availability === "available" || product.availability === "preorder";
}

export function isPreorder(product: Product): boolean {
  return product.availability === "preorder";
}

export function availabilityLabel(product: Product): string | null {
  if (product.availability === "sold_out") return "Sold out";
  if (product.availability === "preorder") return "Pre-order";
  return null;
}

export function formatPrice(pence: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(pence / 100);
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
