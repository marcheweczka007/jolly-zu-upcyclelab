import type { Product } from "@/types/product";

export function isBatchProduct(product: Product): boolean {
  return product.stockTotal != null && product.stockTotal > 1;
}

export function maxPurchaseQty(product: Product): number {
  if (product.stockTotal != null) {
    return Math.max(0, product.stockAvailable ?? 0);
  }
  return product.availability === "available" || product.availability === "preorder" ? 1 : 0;
}

export function canPurchase(product: Product): boolean {
  return maxPurchaseQty(product) > 0;
}

export function isPreorder(product: Product): boolean {
  return product.availability === "preorder";
}

export function stockLabel(product: Product): string | null {
  if (product.stockTotal == null || product.stockTotal <= 1) return null;
  const available = product.stockAvailable ?? 0;
  if (available <= 0) return null;
  return `${available} of ${product.stockTotal} available`;
}

export function availabilityLabel(product: Product): string | null {
  if (product.availability === "sold_out") return "Sold out";
  if (product.availability === "preorder") return "Pre-order";
  const stock = stockLabel(product);
  if (stock) return stock;
  return null;
}

export function basketLineSubtitle(product: Product): string {
  if (isPreorder(product)) return "Pre-order · ships in 2–3 weeks";
  const stock = stockLabel(product);
  if (stock) return stock;
  return "One of a kind";
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
