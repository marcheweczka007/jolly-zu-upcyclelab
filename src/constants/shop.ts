import { redirect } from "@tanstack/react-router";

export const SHOP_URL = "https://www.vinted.co.uk/member/128740025";

function parseShowShop(value: string | undefined): boolean {
  if (value === undefined || value.trim() === "") return true;
  return value.trim().toLowerCase() === "true";
}

/** Set SHOW_SHOP=FALSE in Netlify / .env to hide the Stripe shop (build-time). */
export const SHOW_SHOP = parseShowShop(import.meta.env.SHOW_SHOP);

export function shopRouteGuard() {
  if (!SHOW_SHOP) {
    throw redirect({ to: "/" });
  }
}
