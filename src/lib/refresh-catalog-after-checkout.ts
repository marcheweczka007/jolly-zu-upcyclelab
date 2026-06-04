import type { QueryClient } from "@tanstack/react-query";
import { CATALOG_FRESH_AFTER_CHECKOUT_KEY, fetchProducts } from "@/lib/products-api";

/** Delays between fresh catalog fetches while the Stripe webhook may still be processing. */
const POLL_DELAYS_MS = [0, 2000, 5000, 10000];

export function markCatalogFreshAfterCheckout() {
  sessionStorage.setItem(CATALOG_FRESH_AFTER_CHECKOUT_KEY, "1");
}

export async function refreshCatalogAfterCheckout(queryClient: QueryClient) {
  markCatalogFreshAfterCheckout();

  for (const delayMs of POLL_DELAYS_MS) {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    await queryClient.fetchQuery({
      queryKey: ["products"],
      queryFn: () => fetchProducts({ fresh: true }),
      staleTime: 0,
    });
  }
}

export function consumeCatalogFreshFlag(): boolean {
  if (sessionStorage.getItem(CATALOG_FRESH_AFTER_CHECKOUT_KEY) !== "1") {
    return false;
  }
  sessionStorage.removeItem(CATALOG_FRESH_AFTER_CHECKOUT_KEY);
  return true;
}
