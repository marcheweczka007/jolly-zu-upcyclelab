import { Link } from "@tanstack/react-router";
import { TakeMeHomeButton } from "@/components/TakeMeHomeButton";
import { isBatchProduct, formatPrice, stockLabel } from "@/lib/product-utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const DEFAULT_FEATURES = [
  { emoji: "✨", label: "Only One Available" },
  { emoji: "💨", label: "Lightweight" },
  { emoji: "🌧", label: "Rain Proof" },
  { emoji: "🏕", label: "Adventure Ready" },
] as const;

function featureStrip(product: Product) {
  const stock = stockLabel(product);
  const uniqueLabel = stock
    ? stock
    : isBatchProduct(product)
      ? "Small Batch"
      : "Only One Available";

  const features = [
    { emoji: "✨", label: uniqueLabel },
    ...DEFAULT_FEATURES.slice(1),
  ];

  // Chalk bags aren't rain-proof — omit that highlight
  if (product.category === "chalk-bags") {
    return features.filter((feature) => feature.label !== "Rain Proof");
  }

  return features;
}

function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : product.image ? [product.image] : [];
  const hero = images[0];
  const supporting = images.slice(1, 3);
  const soldOut = product.availability === "sold_out";

  if (!hero) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-ink bg-muted text-sm text-ink/40">
        No image
      </div>
    );
  }

  // Single image — full-width hero
  if (supporting.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-muted">
        <img
          src={hero}
          alt={product.imageAlt}
          className={cn("aspect-[4/3] w-full object-cover", soldOut && "opacity-75 saturate-50")}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  // One supporting image — tall side panel with brand bars (mockup fallback)
  if (supporting.length === 1) {
    return (
      <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-4">
        <div className="overflow-hidden rounded-2xl border-2 border-ink bg-muted">
          <img
            src={hero}
            alt={product.imageAlt}
            className={cn(
              "aspect-[4/3] h-full w-full object-cover md:aspect-auto md:min-h-[320px]",
              soldOut && "opacity-75 saturate-50",
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex min-h-[200px] flex-col overflow-hidden rounded-2xl border-2 border-ink md:min-h-[320px]">
          <div className="h-8 shrink-0 bg-hot-pink md:h-10" aria-hidden />
          <div className="min-h-0 flex-1 bg-muted">
            <img
              src={supporting[0]}
              alt=""
              className={cn("h-full w-full object-cover", soldOut && "opacity-75 saturate-50")}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="h-8 shrink-0 bg-hot-pink md:h-10" aria-hidden />
        </div>
      </div>
    );
  }

  // Hero + two supporting images
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-4">
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-muted">
        <img
          src={hero}
          alt={product.imageAlt}
          className={cn(
            "aspect-[4/3] h-full w-full object-cover md:aspect-auto md:min-h-[360px]",
            soldOut && "opacity-75 saturate-50",
          )}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
        {supporting.map((src, i) => (
          <div key={src} className="overflow-hidden rounded-2xl border-2 border-ink bg-muted">
            <img
              src={src}
              alt=""
              className={cn(
                "aspect-square w-full object-cover md:aspect-[4/3] md:h-full",
                soldOut && "opacity-75 saturate-50",
              )}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Full-width premium listing card — gallery-first, one piece per row. */
export function ProductCard({ product }: { product: Product }) {
  const features = featureStrip(product);
  const shortDescription =
    product.description?.trim() ||
    product.tagline ||
    "Handmade from rescued textiles in Edinburgh.";

  return (
    <article className="overflow-hidden rounded-2xl border-2 border-ink bg-cream shadow-brutal">
      {/* Feature banner */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 bg-hot-pink px-4 py-3.5 text-center text-sm font-black uppercase tracking-wider text-cream sm:gap-x-8 sm:py-4 sm:text-base md:justify-between md:px-6 md:text-lg"
        aria-label="Product highlights"
      >
        {features.map((feature) => (
          <span key={feature.label} className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span aria-hidden>{feature.emoji}</span>
            {feature.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-6 p-5 md:gap-8 md:p-8">
        {/* Mobile: gallery first; desktop: info then gallery via order */}
        <div className="order-2 md:order-1">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="text-display text-3xl uppercase leading-[0.95] text-ink md:text-4xl lg:text-5xl">
                  <Link
                    to="/shop/$listingId"
                    params={{ listingId: product.id }}
                    className="hover:text-purple-deep"
                  >
                    {product.name}
                  </Link>
                </h2>
                <p className="text-display text-2xl text-ink md:text-3xl">
                  {formatPrice(product.pricePence, product.currency)}
                </p>
              </div>
              {product.tagline && (
                <p className="mt-2 text-sm font-semibold text-ink/70 md:text-base">{product.tagline}</p>
              )}
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/80 line-clamp-3 md:text-lg">
                {shortDescription}
              </p>
              <Link
                to="/shop/$listingId"
                params={{ listingId: product.id }}
                className="mt-3 inline-flex text-sm font-bold uppercase tracking-wider text-purple-deep underline-offset-4 hover:underline"
              >
                See full details →
              </Link>
            </div>

            <div className="hidden shrink-0 md:block">
              <TakeMeHomeButton product={product} className="min-w-[11rem]" />
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <Link
            to="/shop/$listingId"
            params={{ listingId: product.id }}
            className="block"
            aria-label={`View ${product.name}`}
          >
            <ProductGallery product={product} />
          </Link>
        </div>

        {/* Mobile CTA — full width under gallery/info */}
        <div className="order-3 md:hidden">
          <TakeMeHomeButton product={product} className="w-full" />
        </div>
      </div>
    </article>
  );
}
