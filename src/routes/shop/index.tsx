import { createFileRoute } from "@tanstack/react-router";
import { ListingCard } from "@/components/ListingCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LISTINGS } from "@/data/listings";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — JollyZu | Upcycled bags" },
      {
        name: "description",
        content:
          "Browse one-of-a-kind upcycled bags handmade in Edinburgh. Small batches, no restocks.",
      },
    ],
  }),
  component: ShopIndex,
});

function ShopIndex() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8 md:pt-14">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">Shop</p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="text-display max-w-3xl text-[10vw] leading-[0.88] md:text-[4rem]">
            The current drop.
            <br />
            <span className="bg-mustard px-3 inline-block -rotate-1">One of each — mostly.</span>
          </h1>
          <p className="max-w-md text-lg text-ink/70">
            Tap a piece for full details. Add to basket — checkout is secure via Stripe.
          </p>
        </div>

        <ul className="mt-12 grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {LISTINGS.map((listing) => (
            <li key={listing.id} className="h-full min-h-0">
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-sm text-ink/55">
          Also on{" "}
          <a
            href="https://www.vinted.co.uk/member/128740025"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline-offset-2 hover:underline"
          >
            Vinted
          </a>{" "}
          — same studio, different platform.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
