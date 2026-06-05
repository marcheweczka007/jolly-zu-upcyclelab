export function skuLabel(product) {
  const listingId = product.metadata?.listing_id?.trim();
  if (listingId) return listingId;
  return product.id;
}

export function truncate(text, max = 60) {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export async function listProducts(stripe) {
  const products = [];
  for await (const product of stripe.products.list({ limit: 100 })) {
    products.push(product);
  }
  return products.sort((a, b) => a.name.localeCompare(b.name));
}

export async function selectStripeProduct(stripe) {
  const products = await listProducts(stripe);
  if (products.length === 0) {
    return null;
  }

  const { select } = await import("@inquirer/prompts");
  const productId = await select({
    message: "Choose a Stripe product",
    pageSize: 12,
    choices: products.map((p) => ({
      name: `[${skuLabel(p)}] ${truncate(p.name, 55)}`,
      value: p.id,
      description: p.description ? truncate(p.description, 90) : undefined,
    })),
  });

  return products.find((p) => p.id === productId) ?? null;
}
