import type { Product } from "@/types/product";

type ProductsResponse = { products: Product[] } | { error: string };

/** Set on checkout success so the shop refetches once when opened. */
export const CATALOG_FRESH_AFTER_CHECKOUT_KEY = "jollyzu-catalog-fresh";

export type FetchProductsOptions = {
  /** Bypass CDN and server catalog cache — use after checkout. */
  fresh?: boolean;
};

export async function fetchProducts(options?: FetchProductsOptions): Promise<Product[]> {
  const url = new URL("/.netlify/functions/get-products", window.location.origin);
  if (options?.fresh) {
    url.searchParams.set("fresh", "1");
    url.searchParams.set("_", String(Date.now()));
  }

  const res = await fetch(url.toString(), {
    cache: options?.fresh ? "no-store" : "default",
  });
  const data = (await res.json()) as ProductsResponse;
  if (!res.ok) {
    throw new Error("error" in data ? data.error : "Failed to load products from Stripe.");
  }
  if (!("products" in data) || !Array.isArray(data.products)) {
    throw new Error("Invalid products response.");
  }
  return data.products;
}
