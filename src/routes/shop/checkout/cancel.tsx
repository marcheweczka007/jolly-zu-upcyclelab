import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/shop/checkout/cancel")({
  head: () => ({
    meta: [{ title: "Checkout cancelled — JollyZu" }],
  }),
  component: CheckoutCancel,
});

function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <h1 className="text-display text-4xl">Checkout cancelled</h1>
        <p className="mt-4 text-lg text-ink/75">
          No worries — your basket is still saved on this device.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/shop/basket"
            className="text-display rounded-full bg-ink px-8 py-4 text-lg uppercase text-cream shadow-brutal hover:bg-purple-deep"
          >
            Return to basket
          </Link>
          <Link
            to="/shop"
            className="text-sm font-bold uppercase tracking-wider underline-offset-4 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
