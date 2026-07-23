import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShopCategoryPills } from "@/components/ShopCategoryPills";
import { ShopProductsState } from "@/components/ShopProductsState";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StructuredData } from "@/components/StructuredData";
import { DEFAULT_SHOP_CATEGORY } from "@/constants/shop-categories";
import { shopRouteGuard } from "@/constants/shop";
import { useProducts } from "@/contexts/ProductsContext";
import { fetchProducts } from "@/lib/products-api";
import { consumeCatalogFreshFlag } from "@/lib/refresh-catalog-after-checkout";
import { pageHead, SHOP_DESCRIPTION, SHOP_TITLE, shopItemListJsonLd } from "@/lib/seo";
import type { Product, ProductCategory } from "@/types/product";

export const Route = createFileRoute("/shop/")({
  beforeLoad: shopRouteGuard,
  loader: async () => ({ products: await fetchProducts() }),
  head: ({ loaderData }) =>
    pageHead({
      title: SHOP_TITLE,
      description: SHOP_DESCRIPTION,
      path: "/shop",
      jsonLd: shopItemListJsonLd(loaderData?.products ?? []),
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
  const { products: loaderProducts } = Route.useLoaderData() as { products: Product[] };
  const { products, refetchFresh } = useProducts();
  const displayProducts: Product[] = products.length > 0 ? products : loaderProducts;
  const [category, setCategory] = useState<ProductCategory>(DEFAULT_SHOP_CATEGORY);

  useEffect(() => {
    if (consumeCatalogFreshFlag()) {
      refetchFresh();
    }
  }, [refetchFresh]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ProductCategory, number>> = {};
    for (const product of displayProducts) {
      const key = product.category ?? DEFAULT_SHOP_CATEGORY;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [displayProducts]);

  const filteredProducts = useMemo(
    () =>
      displayProducts.filter(
        (product) => (product.category ?? DEFAULT_SHOP_CATEGORY) === category,
      ),
    [displayProducts, category],
  );

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
              <span className="bg-mustard px-3 inline-block -rotate-1">One of a kind.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl font-medium leading-snug text-ink/85 md:text-2xl">
              Each piece is its own story. Browse slowly - then take one home.
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
            {displayProducts.length > 0 && (
              <div className="mb-10 md:mb-12">
                <ShopCategoryPills
                  active={category}
                  onChange={setCategory}
                  counts={categoryCounts}
                />
              </div>
            )}

            {displayProducts.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-ink/25 p-12 text-center text-ink/70">
                No products in Stripe yet. Add products in your Stripe Dashboard.
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-ink/25 p-12 text-center text-ink/70">
                Nothing in this category right now — try another pill, or check back after the next
                drop.
              </p>
            ) : (
              <ul className="flex flex-col gap-10 md:gap-14">
                {filteredProducts.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
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
