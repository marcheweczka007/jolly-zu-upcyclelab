import Stripe from "stripe";
import { findListingById } from "./lib/stripe-catalog.mjs";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your Netlify environment.",
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const items = body.items;
  const origin =
    typeof body.origin === "string" && body.origin.startsWith("http")
      ? body.origin.replace(/\/$/, "")
      : (process.env.URL ?? "http://localhost:5173").replace(/\/$/, "");

  if (!items || typeof items !== "object" || Array.isArray(items)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing basket items" }) };
  }

  try {
    const stripe = new Stripe(secret);
    const lineItems = [];

    for (const [listingId, qty] of Object.entries(items)) {
      if (typeof qty !== "number" || qty < 1) continue;

      const listing = await findListingById(stripe, listingId);
      if (!listing?.stripePriceId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Product "${listingId}" not found in Stripe.` }),
        };
      }
      if (listing.availability === "sold_out") {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `"${listing.name}" is not available to purchase.` }),
        };
      }

      lineItems.push({ price: listing.stripePriceId, quantity: 1 });
    }

    if (lineItems.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Basket is empty" }) };
    }

    const listingIds = Object.keys(items).filter((id) => items[id] > 0);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/checkout/cancel`,
      shipping_address_collection: { allowed_countries: ["GB"] },
      metadata: {
        listing_ids: listingIds.join(","),
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("create-checkout-session:", message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: message }) };
  }
}
