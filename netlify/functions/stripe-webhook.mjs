import Stripe from "stripe";
import { recordPurchase } from "./lib/stripe-catalog.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    console.error("stripe-webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return { statusCode: 503, body: "Webhook not configured" };
  }

  const stripe = new Stripe(secret);
  const signature = event.headers["stripe-signature"] ?? event.headers["Stripe-Signature"];
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("stripe-webhook: signature verification failed", message);
    return { statusCode: 400, body: `Webhook Error: ${message}` };
  }

  try {
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      await handleCheckoutCompleted(stripe, session.id);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Handler error";
    console.error("stripe-webhook:", stripeEvent.type, message);
    return { statusCode: 500, body: message };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
}

async function handleCheckoutCompleted(stripe, sessionId) {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });
  const sold = [];

  for (const item of lineItems.data) {
    const priceId = typeof item.price === "object" ? item.price?.id : item.price;
    if (!priceId) continue;

    const price = await stripe.prices.retrieve(priceId);
    const productId =
      typeof price.product === "string" ? price.product : price.product?.id;
    if (!productId) continue;

    const quantity = item.quantity ?? 1;
    const result = await recordPurchase(stripe, productId, priceId, quantity);
    sold.push(result);
    console.log(
      "recordPurchase:",
      productId,
      `qty ${quantity}`,
      result.depleted ? "depleted" : `remaining ${result.stockAvailable ?? "n/a"}`,
    );
  }

  return sold;
}
