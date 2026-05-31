import type { BasketItems } from "@/contexts/BasketContext";

type CheckoutResponse = { url: string } | { error: string };

export async function startStripeCheckout(items: BasketItems): Promise<CheckoutResponse> {
  const origin = window.location.origin;
  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, origin }),
  });

  const data = (await res.json()) as CheckoutResponse;
  if (!res.ok) {
    return { error: "error" in data ? data.error : "Checkout failed. Please try again." };
  }
  if (!("url" in data) || !data.url) {
    return { error: "Invalid checkout response." };
  }
  return data;
}
