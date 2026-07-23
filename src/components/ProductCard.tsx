import { Link } from "@tanstack/react-router";
import { Marquee } from "@/components/Marquee";
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

  // Omit rain-proof when it doesn't apply (chalk bags, Green OG, etc.)
  const hideRainProof =
    product.category === "chalk-bags" ||
    product.stripeProductId === "prod_Ut9LpKVSUVvF6B" ||
    /\bgreen og\b/i.test(product.name);

  if (hideRainProof) {
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

  // One supporting image — tall side panel
  if (supporting.length === 1) {
    return (
      <div className="grid gap-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-4">
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
        <div className="overflow-hidden rounded-2xl border-2 border-ink bg-muted">
          <img
            src={supporting[0]}
            alt=""
            className={cn(
              "aspect-square h-full w-full object-cover md:aspect-auto md:min-h-[320px]",
              soldOut && "opacity-75 saturate-50",
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    );
  }

  // Hero + two supporting images (mockup bento)
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] md:gap-4">
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-muted">
        <img
          src={hero}
          alt={product.imageAlt}
          className={cn(
            "aspect-[4/3] h-full w-full object-cover md:aspect-auto md:min-h-[380px]",
            soldOut && "opacity-75 saturate-50",
          )}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
        {supporting.map((src) => (
          <div key={src} className="overflow-hidden rounded-2xl border-2 border-ink bg-muted">
            <img
              src={src}
              alt=""
              className={cn(
                "aspect-square w-full object-cover md:aspect-[5/4] md:h-full",
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

/** Full-width premium listing card — matches shop mockup. */
export function ProductCard({ product }: { product: Product }) {
  const features = featureStrip(product);
  const marqueeItems = features.map((feature) => `${feature.emoji} ${feature.label}`);
  const shortDescription =
    product.description?.trim() ||
    product.tagline ||
    "Handmade from rescued textiles in Edinburgh.";

  return (
    <article className="overflow-hidden rounded-2xl border-2 border-ink bg-cream shadow-brutal">
      <Marquee
        items={marqueeItems}
        className="border-0 border-b-2 border-ink bg-hot-pink py-5 md:py-6"
        trackClassName="gap-10 md:gap-14"
        itemClassName="text-display gap-10 text-lg font-black tracking-[0.06em] text-ink [-webkit-text-stroke:1.15px_currentColor] [paint-order:stroke_fill] md:gap-14 md:text-2xl lg:text-3xl"
        separator={<span className="select-none text-ink/30">·</span>}
      />

      <div className="flex flex-col gap-8 p-5 md:gap-10 md:p-8 lg:p-10">
        <div className="flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-condensed text-[clamp(2.35rem,5.2vw,4.75rem)] uppercase text-ink">
              <Link
                to="/shop/$listingId"
                params={{ listingId: product.id }}
                className="hover:text-purple-deep"
              >
                {product.name}
              </Link>
            </h2>
            {product.tagline && (
              <p className="mt-3 text-base font-bold text-ink/80 md:mt-4 md:text-lg">
                {product.tagline}
              </p>
            )}
            <p className="mt-2 max-w-xl text-[0.95rem] leading-snug text-ink/70 md:mt-3 md:text-base md:leading-relaxed">
              {shortDescription}
            </p>
          </div>

          <div className="flex shrink-0 items-start gap-5 sm:gap-6">
            <p className="text-condensed pt-1 text-[clamp(2rem,3.5vw,3.25rem)] uppercase leading-none text-ink">
              {formatPrice(product.pricePence, product.currency)}
            </p>
            <TakeMeHomeButton product={product} className="min-w-[11.5rem] sm:min-w-[13rem]" />
          </div>
        </div>

        <Link
          to="/shop/$listingId"
          params={{ listingId: product.id }}
          className="block"
          aria-label={`View ${product.name}`}
        >
          <ProductGallery product={product} />
        </Link>
      </div>
    </article>
  );
}
