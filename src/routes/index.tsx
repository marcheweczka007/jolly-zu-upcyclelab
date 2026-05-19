import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Marquee } from "@/components/Marquee";
import { ShopCTA } from "@/components/ShopCTA";
// HERO IMAGE — replace src/assets/hero-product.jpg with your own product photo
// (portrait orientation works best, ~1200x1600). Keep the filename to avoid edits here.
import heroProduct from "@/assets/hero-product.jpg";
import bagsFlatlay from "@/assets/bags-flatlay.jpg";
import collectionFlatlay from "@/assets/collection-flatlay.jpg";
import fabricStack from "@/assets/fabric-stack.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JollyZu — Upcycled Handmade Bags from Scotland" },
      {
        name: "description",
        content:
          "Handmade upcycled bags built from rescued textiles. Bold, durable, one-of-a-kind. Shop the latest drop.",
      },
      { property: "og:title", content: "JollyZu — Upcycled Handmade Bags" },
      {
        property: "og:description",
        content: "Bold handmade bags from rescued textiles. Slow fashion with serious attitude.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-12 md:gap-12 md:px-8 md:pb-28 md:pt-20">
          <div className="md:col-span-7">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-cream px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-leaf" />
              Made in Scotland · 0% new fabric
            </div>
            <h1 className="text-display text-[11vw] leading-[0.9] md:text-[5.5rem] lg:text-[6.5rem]">
              One-of-kind bags
              <br />
              made from{" "}
              <span className="bg-mustard px-3 inline-block -rotate-1">pre-loved textiles.</span>
              <br />
              {/* <span className="text-purple-deep">for everyday use.</span> */}
            </h1>
            <p className="mt-8 max-w-lg text-lg text-ink/70 md:text-xl">
              Handmade in Scotland from upcycled materials. Durable, practical, and one of a kind.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <ShopCTA variant="huge" label="Shop bags" />
              <a
                href="#story"
                className="text-sm font-bold uppercase tracking-wider underline-offset-4 hover:underline"
              >
                See how they're made →
              </a>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="absolute -left-4 -top-4 z-10 hidden h-24 w-24 rotate-12 items-center justify-center rounded-full bg-leaf text-center text-xs font-black uppercase leading-tight text-ink md:flex">
              Zero
              <br />
              Waste
              <br />
              Promise
            </div>
            <div className="absolute -bottom-4 -right-4 z-10 rotate-[8deg] bg-purple-deep px-4 py-2 text-xs font-bold uppercase tracking-wider text-cream shadow-brutal">
              New drop · live now
            </div>
            {/* Replace src/assets/hero-product.jpg with your own product photo */}
            <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-ink bg-muted shadow-brutal-lg">
              <img
                src={heroProduct}
                alt="Handmade JollyZu waterproof crossbody bag in magenta with orange rope strap"
                width={1200}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          "Slow Fashion",
          "Made in Scotland",
          "One of A Kind",
          "Zero Waste",
          "Handmade by Zuza",
        ]}
      />

      {/* MANIFESTO STATS */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-deep">
              What drives the JollyZu
            </p>
            <h2 className="text-display text-5xl md:text-7xl">
              Fast fashion doesn’t end - it becomes waste.
              <br />
              <span className="text-purple-deep">I redesign it into something new.</span>
            </h2>
          </div>
          <div className="space-y-6 text-lg text-ink/80">
            <p>
              Every year, the world dumps{" "}
              <strong className="bg-mustard px-1">92 million tonnes</strong> of textile waste into
              landfill. I rescue scraps, offcuts, and forgotten fabrics - and turn them into bags
              built to be used - and kept.
            </p>
            <p>
              No two are the same. None will end up in a bin. Every piece is cut, sewn, and finished
              by hand in a small studio in Edinburgh.
            </p>
            <ShopCTA variant="outline" label="See the latest drop" />
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            { n: "100%", l: "Rescued textiles" },
            { n: "1 of 1", l: "Every bag is unique" },
            { n: "0", l: "Mass production" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border-2 border-ink bg-cream p-8 shadow-brutal">
              <p className="text-display text-6xl text-purple-deep md:text-7xl">{s.n}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wider">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section id="story" className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-32">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-mustard">
                The Collection
              </p>
              <h2 className="text-display text-5xl md:text-7xl">
                Bags built
                <br />
                for everyday.
              </h2>
              <p className="mt-5 max-w-md text-cream/70">
                Small-batch crossbodies and waterproof packs - sewn one at a time from rescued
                fabrics. No two are the same.
              </p>
            </div>
            <ShopCTA variant="huge" label="Shop the collection" />
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            {/* Replace src/assets/collection-flatlay.jpg with your own collection photo (3:2 landscape works best) */}
            <div className="relative md:col-span-7">
              <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl border-2 border-cream bg-cream/5">
                <img
                  src={collectionFlatlay}
                  alt="Flatlay of five handmade upcycled JollyZu bags in magenta, denim patchwork, mustard and recycled jeans"
                  width={1536}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-4 rotate-[-3deg] bg-mustard px-4 py-2 text-xs font-black uppercase tracking-wider text-ink shadow-brutal">
                Latest pieces · 1 of 1
              </div>
            </div>
            <div className="grid gap-6 md:col-span-5">
              <div className="flex flex-col justify-between rounded-2xl border-2 border-cream/10 bg-purple-deep p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-mustard">
                    Crossbodies
                  </p>
                  <p className="mt-3 text-display text-3xl text-cream">
                    Patchwork textiles,
                    <br />
                    reborn.
                  </p>
                </div>
                <div className="mt-8 flex items-end justify-between gap-4 border-t border-cream/15 pt-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-cream/60">
                    Starting from
                  </span>
                  <span className="text-display text-3xl text-mustard">£40</span>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-2xl border-2 border-ink/10 bg-mustard p-8 text-ink">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-deep">
                    Waterproof packs
                  </p>
                  <p className="mt-3 text-display text-3xl">
                    Built for rain,
                    <br />
                    rave & trail.
                  </p>
                </div>
                <div className="mt-8 flex items-end justify-between gap-4 border-t border-ink/15 pt-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink/60">
                    Starting from
                  </span>
                  <span className="text-display text-3xl text-purple-deep">£45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <img
              src={fabricStack}
              alt="Stack of colorful recycled fabric scraps in mustard, purple and blue"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-full w-full rounded-2xl border-2 border-ink object-cover shadow-brutal"
            />
          </div>
          <div className="md:col-span-7">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-deep">
              How it's made
            </p>
            <h2 className="text-display text-5xl md:text-7xl">
              From scrap
              <br />
              to statement.
            </h2>
            <ol className="mt-10 space-y-6">
              {[
                [
                  "01",
                  "Rescue",
                  "Unwanted textiles, old clothes, forgotten fabrics. All fabrics are rescued - only essential components are new.",
                ],
                [
                  "02",
                  "Design",
                  "Each bag is sketched around the materials I have. Limits make the design.",
                ],
                ["03", "Sew", "Cut, stitched, finished. By hand. By me. In Scotland."],
                ["04", "Ship", "100% recycled packaging. Direct to your door."],
              ].map(([n, t, d]) => (
                <li key={n} className="grid grid-cols-[60px_1fr] gap-6 border-b border-ink/10 pb-6">
                  <span className="text-display text-3xl text-purple-deep">{n}</span>
                  <div>
                    <p className="text-display text-2xl">{t}</p>
                    <p className="mt-1 text-ink/70">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t-2 border-ink bg-lilac/20 px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-deep">
                Loved by their owners
              </p>

              <h2 className="text-display text-5xl md:text-7xl">
                Bags with a story.
                <br />
                <span className="text-purple-deep">Made for people who want something real.</span>
              </h2>
            </div>

            <p className="max-w-md text-lg text-ink/70">
              Every JollyZu piece ends up with someone who values craftsmanship, individuality, and
              giving textiles a second life.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Aga",
                title: "Very lightweight & colorful",
                image: "src/assets/testimonials/aga.jpg",
                testimonial:
                  "The seller was quick to send me the bag I ordered and it arrived packed in a lovely tissue paper within the postage bag. It appears to be made well and is very lightweight with several compartments. My little boy immediately was drawn to the beautiful colours and wanted to play with it. would recommend.",
              },
              {
                name: "Joey",
                title: "I am obsessed with this bag!",
                image: "src/assets/testimonials/joey.jpg",
                testimonial:
                  "It’s hard to find upcycled gear that feels this durable and high-quality, but this exceeded all my expectations. It’s been through the ‘field test’ on our daily walks and handles treats and poop bags perfectly. I love knowing it’s sustainable without sacrificing style or function. Truly the perfect designated doggy bag!",
              },
              {
                name: "Ana",
                title: "Practical little purse!",
                image: "src/assets/testimonials/ana.jpg",
                testimonial:
                  "I recommend both the seller and the shop without hesitation. The process was straightforward, the communication was great, and I’m very pleased with the quality of my purchase. I would happily buy again. ",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="group rounded-3xl border-2 border-ink bg-cream p-8 shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg"
              >
                <div className="mb-6 flex items-center gap-4">
                  {/* <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-ink">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div> */}

                  <div>
                    <p className="font-bold text-ink">{item.name}</p>
                    <p className="text-sm uppercase tracking-wide text-ink/60">{item.title}</p>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-ink/80">“{item.testimonial}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG FINAL CTA */}
      <section className="relative overflow-hidden bg-purple-deep text-cream">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-40">
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-mustard">Last call</p>
          <h2 className="text-display text-[16vw] leading-[0.85] md:text-[12rem]">
            Ready
            <br />
            to wear
            <br />
            <span className="text-mustard">something real?</span>
          </h2>
          <p className="mt-8 max-w-xl text-lg text-cream/80 md:text-xl">
            Drops are small. They sell out fast. Get in before it's gone.
          </p>
          <div className="mt-12">
            <ShopCTA variant="mustard" label="Shop the Drop" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
