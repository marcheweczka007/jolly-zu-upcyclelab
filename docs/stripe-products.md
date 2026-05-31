# Stripe product catalog

The shop loads all products from Stripe via `/.netlify/functions/get-products`.

## Dashboard setup

For each bag, create a **Product** with a **one-time GBP Price**.

### Product fields (Stripe UI)

| Field | Used for |
|-------|----------|
| Name | Product title |
| Description | Detail page body |
| Image | First image URL (must be HTTPS) |
| Active | Uncheck to mark sold out |

### Metadata (Product → Additional options)

| Key | Required | Example |
|-----|----------|---------|
| `listing_id` | Recommended | `rope-crossbody-magenta` (URL: `/shop/rope-crossbody-magenta`) |
| `tagline` | Optional | `Waterproof shell · orange rope` |
| `materials` | Optional | `Denim offcuts\|Vintage cotton` (pipe-separated) |
| `dimensions` | Optional | `W 42 × H 38 × D 12 cm` |
| `availability` | Optional | `available`, `preorder`, or `sold_out` |
| `preorder_note` | Optional | Shown on pre-order detail pages |
| `image_alt` | Optional | Accessibility text for image |
| `sort_order` | Optional | `1`, `2`, `3` — lower appears first |

If `listing_id` is omitted, the Stripe product id is used in URLs.

### Product gallery (multiple images)

Stripe Dashboard only supports one upload. For a full gallery:

```bash
npm run sync:vinted-images
```

Pick a Stripe product, paste a Vinted listing URL, and the script scrapes photos and saves up to 8 URLs to the product's `images[]` in Stripe.

If `availability` is omitted, active product + active price = **available**. Inactive product or price = **sold out**.

## Checkout

Basket stores `listing_id` values. Checkout resolves live prices from Stripe — no per-product env vars needed.

## Automatic “sold” after payment

When checkout completes, Stripe sends `checkout.session.completed` to `/.netlify/functions/stripe-webhook`. The handler:

1. Deactivates each purchased **Product** and **Price** in Stripe  
2. Sets metadata `availability` = `sold_out`  
3. Removes the piece from the shop on the next catalog fetch (usually within ~60s, or immediately after success page refresh)

### Webhook setup

1. [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**  
2. URL (production): `https://YOUR-SITE.netlify.app/.netlify/functions/stripe-webhook`  
3. Event: `checkout.session.completed`  
4. Copy **Signing secret** (`whsec_…`) → Netlify env `STRIPE_WEBHOOK_SECRET`

**Local testing:**

```bash
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
```

Put the printed `whsec_…` in `.env` as `STRIPE_WEBHOOK_SECRET`, restart `netlify dev`.

## Images

Upload images to Stripe, or host elsewhere and paste HTTPS URLs into the product image field.
