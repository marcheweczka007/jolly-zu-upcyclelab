# JollyZu — Upcycle Lab

Handmade upcycled bags — marketing site + Stripe shop, deployed on Netlify.

```bash
npm install
cp .env.example .env   # add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SHOW_SHOP
npm run dev            # runs: netlify dev
```

`npm run dev` is an alias for **`netlify dev`**. It starts Vite plus Netlify functions and serves the site at **http://localhost:8888**.

| Script | What it runs | Use when |
|--------|--------------|----------|
| `npm run dev` | `netlify dev` | Shop, checkout, webhooks — normal local dev |
| `npm run dev:vite` | `vite dev` | Frontend only (`:5173`) — shop API won’t work |

Don’t use `npm run dev:vite` alone for the shop; `/.netlify/functions/*` needs `netlify dev`.

### Local webhook testing

In a **second terminal**, forward Stripe events to your local function:

```bash
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
```

Copy the `whsec_…` signing secret it prints into `.env` as `STRIPE_WEBHOOK_SECRET`, then restart `netlify dev`. Without `stripe listen`, test checkouts won’t mark items sold or decrement stock locally.

Production webhook setup (live keys, Netlify env vars) → [docs/stripe-products.md](docs/stripe-products.md).

### Blog

Posts live in `content/blog/` as Markdown files with YAML frontmatter. **No code changes** to publish — add a `.md` file and restart dev (or run `npm run generate:blog`).

See `content/blog/README.md` for the frontmatter template.

- Listing: `/blog` (paginated via `?page=2`)
- Post: `/blog/your-slug`
- Tags: `/blog/tag/sustainability`
- RSS: `/blog/rss.xml`

---

## How to add product images

Gallery images live in the repo, not in Stripe. Folder name must match the **Stripe product id** (`prod_…`).

### Manual upload

1. Add up to **8** images to `public/shop-images/prod_…/`
2. Name them in order: `01.jpg`, `02.webp`, `03.png`, etc.
3. Supported formats: **`.jpg`**, **`.jpeg`**, **`.png`**, **`.webp`** (WebP not required)
4. Regenerate the manifest:
   ```bash
   npm run sync:local-images
   ```
5. Restart `netlify dev` locally, or commit + deploy for production

The shop serves images at `/shop-images/prod_…/01.jpg`. Stripe `images[]` is only a fallback when no local folder exists. `npm run build` regenerates the manifest automatically.

### From Vinted

```bash
npm run sync:vinted-images
```

Pick the Stripe product (for the folder name), paste a Vinted listing URL. Downloads up to 8 photos and refreshes the manifest.

---

## Product metadata

In Stripe Dashboard → **Product** → **Additional options** → **Metadata**:

| Key | Required | Example | What it does |
|-----|----------|---------|--------------|
| `listing_id` | Recommended | `rainbow-crossbody` | URL slug → `/shop/rainbow-crossbody`. Defaults to Stripe product id if omitted. |
| `tagline` | Optional | `Waterproof shell · rope strap` | Small label on cards and detail page |
| `materials` | Optional | `Denim offcuts\|Vintage cotton` | Pipe-separated list on detail page |
| `dimensions` | Optional | `W 28 × H 18 × D 5 cm` | Size line on detail page |
| `availability` | Optional | `available`, `preorder`, `sold_out` | Overrides display state. Inactive product/price = sold out regardless. |
| `preorder_note` | Optional | `Ships in 2–3 weeks` | Shown on pre-order detail pages |
| `image_alt` | Optional | `Rainbow crossbody bag front view` | Accessibility text for images |
| `sort_order` | Optional | `1`, `2`, `3` | Lower numbers appear first (sold-out items always sort to the end) |
| `stock_total` | Optional | `5` | Batch size — enables multi-quantity (see below) |
| `stock_available` | Optional | `3` | Units left. Webhook decrements on sale. Defaults to `stock_total`. |
| `force_hide` | Optional | `true` | Hides product from shop and blocks checkout (see below) |
| `category` | Optional | `bags` or `chalk-bags` | Shop filter pills. Defaults to `bags` if omitted. |

---

## Items with multiple quantities (batch stock)

Use this for small runs of the **same** bag (not one-of-a-kind pieces).

### Setup

1. Create product + one-time GBP price in Stripe as usual
2. Add metadata:
   - `stock_total` = total batch size, e.g. `5`
   - `stock_available` = units left, e.g. `5` (omit to default to `stock_total`)
3. Leave `stock_total` **unset** for one-of-a-kind items (max 1 purchase, sold after sale)

### What shoppers see

- Badge: **“3 of 5 available”** on cards and detail page
- Quantity stepper on detail page (when more than 1 left)

### What happens on purchase

The `checkout.session.completed` webhook decrements `stock_available` by quantity purchased.

- **Batch, stock remains:** metadata updated only; product stays active
- **Batch, stock hits 0:** product + price deactivated, `availability` = `sold_out`, `stock_available` = `0`
- **One-of-a-kind:** product + price deactivated, `availability` = `sold_out`

Sold-out items stay visible in the shop (badge, no add-to-basket) and appear **after** available items.

---

## Hide a product (`force_hide`)

To keep a product in Stripe but remove it from the shop (draft, seasonal hold, duplicate listing, etc.):

1. Stripe → Product → Metadata
2. Add `force_hide` = `true` (also accepts `1` or `yes`)
3. Wait for catalog cache (~30s) or hit `/.netlify/functions/get-products?fresh=1`

The product will not appear on `/shop`, its detail URL will 404, and checkout will reject it.

**To show again:** remove `force_hide` or set it to `false`.

---

## Re-list / unarchive a sold item

After a sale the webhook deactivates the product and price and sets `availability` = `sold_out`. To sell again:

### One-of-a-kind

1. **Product** → set **Active** ✓
2. **Price** → set **Active** ✓ (Products → your product → Pricing → click price → Activate)
3. **Metadata:**
   - Set `availability` = `available` (or delete the key)
   - Remove `force_hide` if set
4. Refresh the shop (`?fresh=1` or wait ~30s)

### Batch (stock depleted to 0)

Do everything above, plus reset stock metadata:

- `stock_total` = batch size, e.g. `5`
- `stock_available` = units to sell, e.g. `5`
- `availability` = `available` (or delete)

### Batch (partially sold, still active)

If some units remain, the product may still be active. Just update:

- `stock_available` = correct remaining count

### Checklist

| Step | One-of-a-kind | Batch (depleted) |
|------|---------------|------------------|
| Product active | ✓ | ✓ |
| Price active | ✓ | ✓ |
| `availability` → `available` | ✓ | ✓ |
| `stock_available` reset | — | ✓ |
| `stock_total` set | — | ✓ (if missing) |
| Remove `force_hide` | if set | if set |
