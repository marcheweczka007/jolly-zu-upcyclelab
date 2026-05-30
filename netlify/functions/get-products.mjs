import Stripe from "stripe";
import { listCatalogCached } from "./lib/stripe-catalog.mjs";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
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

  try {
    const stripe = new Stripe(secret);
    const products = await listCatalogCached(stripe, { shopOnly: true });
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Cache-Control": "public, max-age=60",
      },
      body: JSON.stringify({ products }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("get-products:", message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: message }) };
  }
}
