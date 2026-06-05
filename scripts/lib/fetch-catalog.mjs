import Stripe from "stripe";
import { listCatalog } from "../../netlify/functions/lib/stripe-catalog.mjs";

export async function fetchCatalogProducts() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return [];
  }
  const stripe = new Stripe(secret);
  return listCatalog(stripe, { shopOnly: true });
}
