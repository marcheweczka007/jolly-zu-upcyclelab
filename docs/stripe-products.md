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

If `availability` is omitted, active product + active price = **available**. Inactive product or price = **sold out**.

## Checkout

Basket stores `listing_id` values. Checkout resolves live prices from Stripe — no per-product env vars needed.

## Images

Upload images to Stripe, or host elsewhere and paste HTTPS URLs into the product image field.
