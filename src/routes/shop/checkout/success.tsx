import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useBasket } from "@/contexts/BasketContext";

export const Route = createFileRoute("/shop/checkout/success")({
  head: () => ({
    meta: [{ title: "Order confirmed — JollyZu" }],
  }),
  component: CheckoutSuccess,
});

function CheckoutSuccess() {
  const { clearBasket } = useBasket();
  const queryClient = useQueryClient();

  useEffect(() => {
    clearBasket();
    void queryClient.invalidateQueries({ queryKey: ["products"] });
  }, [clearBasket, queryClient]);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-2xl">
          ✓
        </div>
        <h1 className="text-display text-4xl">Thank you!</h1>
        <p className="mt-4 text-lg text-ink/75">
          Payment received. Zuza will pack your order from Edinburgh — you&apos;ll get a
          confirmation email from Stripe shortly.
        </p>
        <Link
          to="/shop"
          className="text-display mt-10 inline-flex rounded-full bg-ink px-8 py-4 text-lg uppercase text-cream shadow-brutal hover:bg-purple-deep"
        >
          Back to shop
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}
