import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ListingBasketActions } from "@/components/ListingBasketActions";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  canPurchase,
  formatPrice,
  getListingById,
  isPreorder,
  LISTINGS,
} from "@/data/listings";

export const Route = createFileRoute("/shop/$listingId")({
  loader: ({ params }) => {
    const listing = getListingById(params.listingId);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.listing.name} — JollyZu Shop` },
      { name: "description", content: loaderData.listing.description },
    ],
  }),
  component: ListingDetail,
});

function ListingDetail() {
  const { listing } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <article className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8 md:pt-14">
        <nav className="mb-8 text-sm font-bold uppercase tracking-wider">
          <Link to="/shop" className="text-ink/50 hover:text-purple-deep">
            ← Shop
          </Link>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-2xl border-2 border-ink bg-muted shadow-brutal-lg">
            <img
              src={listing.image}
              alt={listing.imageAlt}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">
              {listing.tagline}
            </p>
            <h1 className="text-display mt-3 text-4xl leading-[0.95] md:text-5xl">
              {listing.name}
            </h1>
            <p className="text-display mt-4 text-3xl">{formatPrice(listing.pricePence)}</p>

            <p className="mt-6 text-lg leading-relaxed text-ink/80">{listing.description}</p>

            <dl className="mt-8 space-y-4 rounded-2xl border-2 border-ink/15 bg-lilac/10 p-6">
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-purple-deep">
                  Materials
                </dt>
                <dd className="mt-2 text-ink/80">{listing.materials.join(" · ")}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-purple-deep">
                  Size
                </dt>
                <dd className="mt-2 text-ink/80">{listing.dimensions}</dd>
              </div>
            </dl>

            {canPurchase(listing) ? (
              <div className="mt-10 max-w-sm space-y-4">
                <ListingBasketActions listing={listing} />
                {isPreorder(listing) && listing.preorderNote && (
                  <p className="text-sm leading-relaxed text-ink/70">{listing.preorderNote}</p>
                )}
              </div>
            ) : (
              <p className="mt-10 inline-block rounded-full border-2 border-ink bg-muted px-5 py-3 text-sm font-black uppercase tracking-wider">
                Sold out — watch Instagram for the next drop
              </p>
            )}
          </div>
        </div>

        <section className="mt-20 border-t-2 border-ink/10 pt-12">
          <h2 className="text-display text-2xl">More from this drop</h2>
          <ul className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {LISTINGS.filter((l) => l.id !== listing.id)
              .slice(0, 3)
              .map((l) => (
                <li key={l.id} className="shrink-0">
                  <Link
                    to="/shop/$listingId"
                    params={{ listingId: l.id }}
                    className="block w-40 overflow-hidden rounded-xl border-2 border-ink"
                  >
                    <img src={l.image} alt="" className="aspect-square object-cover" />
                    <p className="p-2 text-xs font-bold">{l.name}</p>
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
