import type { Product } from "@/types/product";

type ProductsResponse = { products: Product[] } | { error: string };

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/.netlify/functions/get-products");
  const data = (await res.json()) as ProductsResponse;
  if (!res.ok) {
    throw new Error("error" in data ? data.error : "Failed to load products from Stripe.");
  }
  if (!("products" in data) || !Array.isArray(data.products)) {
    throw new Error("Invalid products response.");
  }
  return data.products;
}
