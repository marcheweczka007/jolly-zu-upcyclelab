import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShopProductsState } from "@/components/ShopProductsState";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useBasket } from "@/contexts/BasketContext";
import { formatPrice, isPreorder } from "@/lib/product-utils";
import { startStripeCheckout } from "@/lib/checkout";

export const Route = createFileRoute("/shop/basket")({
  head: () => ({
    meta: [{ title: "Basket — JollyZu Shop" }],
  }),
  component: BasketPage,
});

function BasketPage() {
  const { lineItems, checkoutItems, removeItem, subtotalPence, clearBasket } = useBasket();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutError(null);
    setCheckingOut(true);
    if (lineItems.length === 0) {
      setCheckoutError("Your basket is empty.");
      setCheckingOut(false);
      return;
    }
    const result = await startStripeCheckout(checkoutItems);
    setCheckingOut(false);
    if ("error" in result) {
      setCheckoutError(result.error);
      return;
    }
    window.location.href = result.url;
  };

  return (
    <ShopProductsState>
      <div className="min-h-screen bg-cream text-ink">
        <SiteHeader />

        <section className="mx-auto max-w-3xl px-5 pb-20 pt-8 md:px-8 md:pt-14">
          <nav className="mb-8 text-sm font-bold uppercase tracking-wider">
            <Link to="/shop" className="text-ink/50 hover:text-purple-deep">
              ← Continue shopping
            </Link>
          </nav>

          <h1 className="text-display text-4xl md:text-5xl">Your basket</h1>

          {lineItems.length === 0 ? (
            <div className="mt-12 rounded-2xl border-2 border-dashed border-ink/25 p-12 text-center">
              <p className="text-lg text-ink/70">Nothing here yet.</p>
              <Link
                to="/shop"
                className="text-display mt-6 inline-flex rounded-full bg-ink px-8 py-4 text-lg uppercase text-cream shadow-brutal hover:bg-purple-deep"
              >
                Browse the drop
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-10 divide-y-2 divide-ink/10">
                {lineItems.map(({ product }) => (
                  <li key={product.id} className="flex gap-4 py-6 first:pt-0">
                    <Link
                      to="/shop/$listingId"
                      params={{ listingId: product.id }}
                      className="h-24 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-ink"
                    >
                      {product.image ? (
                        <img src={product.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/shop/$listingId"
                        params={{ listingId: product.id }}
                        className="text-display text-lg hover:text-purple-deep"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink/60">
                        {isPreorder(product) ? "Pre-order · ships in 2–3 weeks" : "One of a kind"}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="mt-3 text-xs font-bold uppercase tracking-wider text-ink/50 hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-display shrink-0 text-lg">
                      {formatPrice(product.pricePence)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-between border-t-2 border-ink pt-6">
                <span className="text-sm font-bold uppercase tracking-widest">Subtotal</span>
                <span className="text-display text-2xl">{formatPrice(subtotalPence)}</span>
              </div>
              <p className="mt-2 text-sm text-ink/55">
                Shipping calculated at Stripe checkout.
                {lineItems.some(({ product }) => isPreorder(product)) &&
                  " Pre-order pieces ship in 2–3 weeks after payment."}
              </p>

              {checkoutError && (
                <p className="mt-4 rounded-lg border-2 border-coral/40 bg-coral/10 px-4 py-3 text-sm text-ink">
                  {checkoutError}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={checkingOut}
                  onClick={handleCheckout}
                  className="text-display flex-1 rounded-full bg-ink px-8 py-4 text-lg uppercase text-cream shadow-brutal transition-all hover:bg-purple-deep disabled:opacity-60"
                >
                  {checkingOut ? "Redirecting…" : "Checkout with Stripe"}
                </button>
                <button
                  type="button"
                  onClick={clearBasket}
                  className="rounded-full border-2 border-ink px-6 py-4 text-sm font-bold uppercase tracking-wider hover:bg-ink/5"
                >
                  Clear basket
                </button>
              </div>
            </>
          )}
        </section>

        <SiteFooter />
      </div>
    </ShopProductsState>
  );
}
