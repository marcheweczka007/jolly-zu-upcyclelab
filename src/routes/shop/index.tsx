import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ListingCard } from "@/components/ListingCard";
import { ShopProductsState } from "@/components/ShopProductsState";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StructuredData } from "@/components/StructuredData";
import { shopRouteGuard } from "@/constants/shop";
import { useProducts } from "@/contexts/ProductsContext";
import { fetchProducts } from "@/lib/products-api";
import { consumeCatalogFreshFlag } from "@/lib/refresh-catalog-after-checkout";
import { pageHead, SHOP_DESCRIPTION, SHOP_TITLE, shopItemListJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/shop/")({
  beforeLoad: shopRouteGuard,
  loader: async () => ({ products: await fetchProducts() }),
  head: ({ loaderData }) =>
    pageHead({
      title: SHOP_TITLE,
      description: SHOP_DESCRIPTION,
      path: "/shop",
      jsonLd: shopItemListJsonLd(loaderData.products),
    }),
  component: ShopIndex,
});

const SHOP_STAMPS = [
  "Handmade in Edinburgh",
  "Rescued fabric only",
  "Secure Stripe checkout",
  "One of a kind",
] as const;

function ShopIndex() {
  const { products: loaderProducts } = Route.useLoaderData();
  const { products, refetchFresh } = useProducts();
  const displayProducts = products.length > 0 ? products : loaderProducts;

  useEffect(() => {
    if (consumeCatalogFreshFlag()) {
      refetchFresh();
    }
  }, [refetchFresh]);

  return (
    <ShopProductsState>
      <div className="min-h-screen bg-cream text-ink">
        <StructuredData data={shopItemListJsonLd(displayProducts)} />
        <SiteHeader />

        <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 md:px-8 md:pb-16 md:pt-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">Shop</p>
          <div className="max-w-5xl">
            <h1 className="text-display text-[10vw] leading-[0.88] md:text-[3.75rem] lg:text-[4.25rem]">
              The current drop.
              <br />
              <span className="bg-mustard px-3 inline-block -rotate-1">One of each - mostly.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl font-medium leading-snug text-ink/85 md:text-2xl">
              Tap a piece for full details. Add to basket - checkout is secure via Stripe.
            </p>
          </div>

          <ul
            className="mt-10 flex flex-wrap gap-3 md:mt-12"
            aria-label="What you get when you shop JollyZu"
          >
            {SHOP_STAMPS.map((label) => (
              <li
                key={label}
                className="rounded-full border-2 border-ink bg-cream px-4 py-2 text-xs font-black uppercase tracking-wider shadow-brutal"
              >
                {label}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t-2 border-ink/10">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          {displayProducts.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-ink/25 p-12 text-center text-ink/70">
              No products in Stripe yet. Add products in your Stripe Dashboard.
            </p>
          ) : (
            <ul className="grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayProducts.map((product) => (
                <li key={product.id} className="h-full min-h-0">
                  <ListingCard product={product} />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-12 text-center text-sm text-ink/55">
            Also on{" "}
            <a
              href="https://upcyclelabjollyzu.etsy.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline-offset-2 hover:underline"
            >
              Etsy
            </a>{" "}
            — same studio, different platform.
          </p>
          </div>
        </section>

        <SiteFooter />
      </div>
    </ShopProductsState>
  );
}
