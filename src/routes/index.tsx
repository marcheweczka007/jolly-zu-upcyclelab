import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SHOP_URL } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Marquee } from "@/components/Marquee";
import { ShopCTA } from "@/components/ShopCTA";
import heroBag from "@/assets/hero-bag.jpg";
import bagsFlatlay from "@/assets/bags-flatlay.jpg";
import fabricStack from "@/assets/fabric-stack.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JollyZu — Upcycled Handmade Bags from Edinburgh" },
      { name: "description", content: "Handmade upcycled bags built from rescued textiles. Bold, durable, one-of-a-kind. Shop the latest drop." },
      { property: "og:title", content: "JollyZu — Upcycled Handmade Bags" },
      { property: "og:description", content: "Bold handmade bags from rescued textiles. Slow fashion with serious attitude." },
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
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-8 md:grid-cols-12 md:gap-6 md:px-8 md:pb-20 md:pt-16">
          <div className="md:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-cream px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-leaf" />
              Made in Edinburgh · 0% new fabric
            </div>
            <h1 className="text-display text-[14vw] leading-[0.85] md:text-[9rem]">
              BAGS<br />
              <span className="text-purple-deep">WITH A</span><br />
              <span className="bg-mustard px-3 inline-block -rotate-1">PAST.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg text-ink/70 md:text-xl">
              Handmade in small batches from textiles the world threw away. Built bold. Built to last. Built by one person — Zuza.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ShopCTA variant="huge" />
              <a href="#story" className="text-sm font-bold uppercase tracking-wider underline-offset-4 hover:underline">
                Read the story →
              </a>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="absolute -left-4 -top-4 z-10 hidden h-24 w-24 rotate-12 items-center justify-center rounded-full bg-leaf text-center text-xs font-black uppercase leading-tight text-ink md:flex">
              Zero<br />Waste<br />Promise
            </div>
            <div className="absolute -bottom-4 -right-4 z-10 rotate-[8deg] bg-purple-deep px-4 py-2 text-xs font-bold uppercase tracking-wider text-cream shadow-brutal">
              New drop · live now
            </div>
            <img
              src={heroBag}
              alt="Model wearing a handmade upcycled patchwork crossbody bag in mustard and purple"
              width={1536}
              height={1536}
              className="h-full w-full rounded-2xl border-2 border-ink object-cover shadow-brutal-lg"
            />
          </div>
        </div>
      </section>

      <Marquee items={["Slow Fashion", "Edinburgh Made", "One of One", "Zero Waste", "Handmade by Zuza"]} />

      {/* MANIFESTO STATS */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-deep">The Manifesto</p>
            <h2 className="text-display text-5xl md:text-7xl">
              Fashion is broken.<br />
              <span className="text-purple-deep">We're stitching it back together.</span>
            </h2>
          </div>
          <div className="space-y-6 text-lg text-ink/80">
            <p>
              Every year, the world dumps <strong className="bg-mustard px-1">92 million tonnes</strong> of textile waste into landfill. We rescue scraps, offcuts, and forgotten fabrics — and turn them into bags you'll actually want to wear.
            </p>
            <p>
              No two are the same. None will end up in a bin. Every piece is cut, sewn, and finished by hand in a small studio in Edinburgh.
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
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-mustard">The Drop</p>
              <h2 className="text-display text-5xl md:text-7xl">
                Pick your<br />weapon.
              </h2>
            </div>
            <ShopCTA variant="huge" label="Shop Now" />
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            <div className="relative md:col-span-7">
              <img
                src={bagsFlatlay}
                alt="Flatlay of four upcycled fanny pack bags in purple, mustard, denim and blue wave fabric"
                width={1536}
                height={1024}
                loading="lazy"
                className="h-full w-full rounded-2xl border-2 border-cream object-cover"
              />
              <div className="absolute -bottom-4 left-4 rotate-[-3deg] bg-mustard px-4 py-2 text-xs font-black uppercase tracking-wider text-ink">
                Waterproof Festival Bags
              </div>
            </div>
            <div className="grid gap-6 md:col-span-5">
              <div className="flex flex-col justify-between rounded-2xl bg-purple-deep p-8">
                <div>
                  <p className="text-display text-3xl">Crossbodies</p>
                  <p className="mt-2 text-sm text-cream/70">Patchwork denim. Hits different.</p>
                </div>
                <span className="mt-6 text-display text-2xl text-mustard">£40+</span>
              </div>
              <div className="flex flex-col justify-between rounded-2xl bg-mustard p-8 text-ink">
                <div>
                  <p className="text-display text-3xl">Festival Packs</p>
                  <p className="mt-2 text-sm text-ink/70">Waterproof. Rave-ready.</p>
                </div>
                <span className="mt-6 text-display text-2xl text-purple-deep">£35+</span>
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
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-deep">How it's made</p>
            <h2 className="text-display text-5xl md:text-7xl">From scrap<br />to statement.</h2>
            <ol className="mt-10 space-y-6">
              {[
                ["01", "Rescue", "Offcuts from local tailors, factory rejects, your old jeans. Nothing new gets bought."],
                ["02", "Design", "Each bag is sketched around the materials I have. Limits make the design."],
                ["03", "Sew", "Cut, stitched, finished. By hand. By me. In Edinburgh."],
                ["04", "Ship", "Plastic-free packaging. Direct to your door."],
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

      {/* BIG FINAL CTA */}
      <section className="relative overflow-hidden bg-purple-deep text-cream">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-40">
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-mustard">Last call</p>
          <h2 className="text-display text-[16vw] leading-[0.85] md:text-[12rem]">
            Ready<br />
            to wear<br />
            <span className="text-mustard">something real?</span>
          </h2>
          <p className="mt-8 max-w-xl text-lg text-cream/80 md:text-xl">
            Drops are small. They sell out fast. Get in before it's gone.
          </p>
          <div className="mt-12">
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noreferrer"
              className="text-display group inline-flex items-center gap-4 rounded-full bg-mustard px-10 py-6 text-2xl uppercase text-ink shadow-brutal transition-all hover:-translate-y-1 hover:bg-cream hover:shadow-brutal-lg md:px-14 md:py-8 md:text-4xl"
            >
              Shop the Drop
              <span className="text-purple-deep transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
