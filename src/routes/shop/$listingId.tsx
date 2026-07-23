import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ListingAvailabilityBadge } from "@/components/ListingAvailabilityBadge";
import { ListingBasketActions } from "@/components/ListingBasketActions";
import { ProductGallery } from "@/components/ProductGallery";
import { ShopProductsState } from "@/components/ShopProductsState";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StructuredData } from "@/components/StructuredData";
import { shopRouteGuard } from "@/constants/shop";
import { useProducts } from "@/contexts/ProductsContext";
import { canPurchase, formatPrice, getProductById, isPreorder } from "@/lib/product-utils";
import { fetchProducts } from "@/lib/products-api";
import {
  productBreadcrumbJsonLd,
  productHead,
  productJsonLd,
} from "@/lib/seo";
import type { Product } from "@/types/product";

export const Route = createFileRoute("/shop/$listingId")({
  beforeLoad: shopRouteGuard,
  loader: async ({ params }) => {
    const products = await fetchProducts();
    const product = getProductById(products, params.listingId);
    if (!product) {
      throw notFound();
    }
    return { product };
  },
  head: ({ loaderData }) => productHead(loaderData.product),
  component: ListingDetail,
});

function ListingDetail() {
  const { product } = Route.useLoaderData();
  const { products } = useProducts();

  return (
    <ShopProductsState>
      <ListingDetailContent product={product} products={products} />
    </ShopProductsState>
  );
}

function ListingDetailContent({
  product,
  products,
}: {
  product: Product;
  products: Product[];
}) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <StructuredData data={[productJsonLd(product), productBreadcrumbJsonLd(product)]} />
      <SiteHeader />

      <article className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8 md:pt-14">
        <nav className="mb-8 text-sm font-bold uppercase tracking-wider" aria-label="Breadcrumb">
          <Link to="/shop" className="text-ink/50 hover:text-purple-deep">
            ← Shop
          </Link>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <ProductGallery
              images={
                product.images.length > 0 ? product.images : product.image ? [product.image] : []
              }
              alt={product.imageAlt}
            />
            <ListingAvailabilityBadge product={product} />
          </div>

          <div>
            {product.tagline && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">
                {product.tagline}
              </p>
            )}
            <h1 className="text-display mt-3 text-4xl md:text-5xl">{product.name}</h1>
            <p className="text-display mt-4 text-3xl">{formatPrice(product.pricePence)}</p>

            <p className="mt-6 text-lg leading-relaxed text-ink/80">{product.description}</p>

            {(product.materials.length > 0 || product.dimensions) && (
              <dl className="mt-8 space-y-4 rounded-2xl border-2 border-ink/15 bg-lilac/10 p-6">
                {product.materials.length > 0 && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-purple-deep">
                      Materials
                    </dt>
                    <dd className="mt-2 text-ink/80">{product.materials.join(" · ")}</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-purple-deep">
                      Size
                    </dt>
                    <dd className="mt-2 text-ink/80">{product.dimensions}</dd>
                  </div>
                )}
              </dl>
            )}

            {canPurchase(product) ? (
              <div className="mt-10 max-w-sm space-y-4">
                <ListingBasketActions product={product} />
                {isPreorder(product) && product.preorderNote && (
                  <p className="text-sm leading-relaxed text-ink/70">{product.preorderNote}</p>
                )}
              </div>
            ) : (
              <p className="mt-10 inline-block rounded-full border-2 border-ink bg-muted px-5 py-3 text-sm font-black uppercase tracking-wider">
                Sold out — watch{" "}
                <a
                  href="https://instagram.com/upcycle.lab.jollyzu"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-purple-deep"
                >
                  Instagram
                </a>{" "}
                for the next drop
              </p>
            )}
          </div>
        </div>

        <section className="mt-20 border-t-2 border-ink/10 pt-12">
          <h2 className="text-display text-2xl">More from this drop</h2>
          <ul className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((p) => (
                <li key={p.id} className="shrink-0">
                  <Link
                    to="/shop/$listingId"
                    params={{ listingId: p.id }}
                    className="block w-40 overflow-hidden rounded-xl border-2 border-ink"
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.imageAlt || p.name}
                        className="aspect-square object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="aspect-square bg-muted" />
                    )}
                    <p className="p-2 text-xs font-bold">{p.name}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </article>

      <SiteFooter />
    </div>
  );
}
