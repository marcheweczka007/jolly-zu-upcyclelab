import Stripe from "stripe";

/** Keys must match listing `id` in src/data/listings.ts */
const CATALOG = {
  "rope-crossbody-magenta": process.env.STRIPE_PRICE_ROPE_CROSSBODY,
  "patchwork-tote-leaf": process.env.STRIPE_PRICE_PATCHWORK_TOTE,
  "mini-belt-bag-mustard": process.env.STRIPE_PRICE_MINI_BELT,
  "drawstring-backpack-lilac": process.env.STRIPE_PRICE_DRAWSTRING,
};

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

  const lineItems = [];
  for (const [id, qty] of Object.entries(items)) {
    if (typeof qty !== "number" || qty < 1) continue;
    const priceId = CATALOG[id];
    if (!priceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: `No Stripe price configured for "${id}". Set the matching STRIPE_PRICE_* env var.`,
        }),
      };
    }
    lineItems.push({ price: priceId, quantity: 1 });
  }

  if (lineItems.length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Basket is empty" }) };
  }

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/checkout/cancel`,
      shipping_address_collection: { allowed_countries: ["GB"] },
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
