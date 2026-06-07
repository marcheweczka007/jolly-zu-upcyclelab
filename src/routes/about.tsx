import { createFileRoute } from "@tanstack/react-router";
import { pageHead, SITE_FULL_NAME } from "@/lib/seo";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ShopCTA } from "@/components/ShopCTA";
import { Marquee } from "@/components/Marquee";
import maker from "@/assets/maker-portrait.jpg";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: `About — ${SITE_FULL_NAME} | The maker behind the bags`,
      description:
        "Meet Zuza, founder of JollyZu Upcycle Lab — turning rescued textiles into one-of-a-kind upcycled bags from her Edinburgh studio.",
      path: "/about",
    }),
  component: About,
});

const INSTAGRAM_URL = "https://instagram.com/upcycle.lab.jollyzu";

const STAMPS = [
  "One maker",
  "Edinburgh studio",
  "Rescued fabric only",
  "Nothing identical",
] as const;

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Rescued textiles",
    body: "Denim offcuts, pre-loved clothes, old rain coats, your nan's curtains - if it can be cut and stitched, it can become a bag.",
  },
  {
    n: "02",
    title: "Design around what I find",
    body: "Every piece is designed around the materials I find. The design has to bend to what's available - and honestly, that's where the best ideas come from.",
  },
  {
    n: "03",
    title: "Cut & sewn by me",
    body: "No two bags are identical, and none of them will ever exist again. I sew everything myself.",
  },
  {
    n: "04",
    title: "Pack & post",
    body: "100% recycled packaging, posted direct from Edinburgh - I package everything myself too.",
  },
] as const;

function About() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 md:px-8 md:pb-16 md:pt-14">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">About</p>
        <div className="max-w-5xl">
          <h1 className="text-display text-[10vw] leading-[0.88] md:text-[4.75rem] lg:text-[5.25rem]">
            One person, stitching every piece.
            <br />
            <span className="bg-mustard px-3 inline-block -rotate-1">No new fabric - ever.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-medium leading-snug text-ink/85 md:text-2xl">
            If the fabric is still good, it deserves another life - that&apos;s the whole idea.
          </p>
        </div>

        <ul
          className="mt-10 flex flex-wrap gap-3 md:mt-12"
          aria-label="What makes JollyZu different"
        >
          {STAMPS.map((label) => (
            <li
              key={label}
              className="rounded-full border-2 border-ink bg-cream px-4 py-2 text-xs font-black uppercase tracking-wider shadow-brutal"
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-10 md:mt-12">
          <ShopCTA variant="huge" label="Shop the Drop" />
        </div>
      </section>

      {/* Story + portrait */}
      <section className="border-t-2 border-ink/10 bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 md:grid md:grid-cols-12 md:gap-16 md:px-8 md:py-24">
          <div className="md:col-span-5 md:order-2">
            <div className="relative mx-auto max-w-md md:mx-0 md:max-w-none">
              <img
                src={maker}
                alt="Zuza, the maker behind JollyZu, working at her sewing machine in Edinburgh"
                width={1024}
                height={1280}
                className="w-full rounded-2xl border-2 border-ink object-cover shadow-brutal-lg"
              />
              <div className="absolute -bottom-4 -left-2 rotate-[-5deg] bg-leaf px-4 py-2 text-xs font-black uppercase tracking-wider text-ink shadow-brutal md:-left-4">
                Hi, I&apos;m Zuza 👋
              </div>
            </div>
          </div>

          <div className="mt-14 space-y-6 text-lg leading-relaxed text-ink/80 md:col-span-7 md:order-1 md:mt-0">
            <p className="text-display text-3xl text-ink md:text-4xl">
              JollyZu Upcycle Lab started quietly — with a simple idea: if the fabric is still good,
              it deserves another life.
            </p>
            <p>
              What began as a side project - sewing rave fanny packs for friends - turned into a
              small studio in Edinburgh making bags entirely from rescued textiles. Denim offcuts,
              pre-loved clothes, old rain coats, your nan&apos;s curtains. If it can be cut and
              stitched, it can become a bag.
            </p>
            <p>
              Every piece is designed around the materials I find. That means no two bags are
              identical, and none of them will ever exist again. It also means the design has to
              bend to what&apos;s available - and honestly, that&apos;s where the best ideas come
              from.
            </p>
            <p>
              I sew everything myself. I package everything myself. 100% recycled packaging, posted
              direct from Edinburgh.
            </p>
            <div className="pt-6">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-display group inline-flex w-full items-center justify-center gap-3 rounded-full border-2 border-ink bg-cream px-8 py-5 text-xl uppercase tracking-wide text-ink shadow-brutal transition-all hover:-translate-y-1 hover:bg-purple-deep hover:text-cream hover:shadow-brutal-lg sm:w-auto sm:px-10 sm:py-6 sm:text-2xl md:px-14 md:py-8 md:text-3xl"
                aria-label="JollyZu on Instagram (opens in a new tab)"
              >
                Follow on Instagram
                <span
                  className="text-purple-deep transition-transform group-hover:translate-x-1 group-hover:text-mustard md:text-4xl"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
              <p className="mt-3 text-sm text-ink/55">
                Day-to-day studio mess, new pieces, and drop hints —{" "}
                <span className="font-semibold text-ink/80">@upcycle.lab.jollyzu</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fabrics — same stories as above, tighter framing */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mustard">
              Where the fabrics come from
            </p>
            <h2 className="text-display mt-4 text-4xl leading-[0.95] md:text-6xl">
              Rescued textiles - not rolls from a warehouse.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/75 md:text-xl">
              Same story as the bags: offcuts, clothes, coats, curtains. Nothing fancy on the label
              - just fabric that still had life in it.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Denim offcuts",
              "Pre-loved clothes",
              "Old rain coats",
              "Your nan\u2019s curtains",
              "Whatever else turns up in the scrap pile",
            ].map((line) => (
              <li
                key={line}
                className="flex gap-3 rounded-xl border-2 border-cream/15 bg-cream/5 px-5 py-4 text-base leading-snug text-cream/90"
              >
                <span className="text-mustard" aria-hidden="true">
                  →
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-2xl text-lg text-cream/70">
            If it can be cut and stitched, it can become a bag.
          </p>
        </div>
      </section>

      {/* One-of-one */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">
              Why every bag is different
            </p>
            <h2 className="text-display mt-4 text-4xl leading-[0.95] md:text-6xl">
              Designed around the materials - not the other way around.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-ink/80">
            <p>
              No two bags are identical, and none of them will ever exist again. It also means the
              design has to bend to what&apos;s available - and honestly, that&apos;s where the best
              ideas come from.
            </p>
            <div className="inline-block rotate-[1deg] rounded-2xl border-2 border-ink bg-mustard px-5 py-3 shadow-brutal">
              <p className="text-display text-lg text-ink md:text-xl">
                Small batches. No restocks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process + no new fabric */}
      <section className="border-y-2 border-ink/10 bg-lilac/15">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">
                No new fabric
              </p>
              <h2 className="text-display mt-4 text-4xl leading-[0.95] md:text-5xl">
                Bags entirely from rescued textiles.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-ink/80">
                That&apos;s the rule. It keeps things honest - and it&apos;s why every drop looks a
                bit different from the last one.
              </p>
            </div>

            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">
                How it gets made
              </p>
              <ol className="mt-6 space-y-0 divide-y-2 divide-ink/10 rounded-2xl border-2 border-ink bg-cream shadow-brutal">
                {PROCESS_STEPS.map((step) => (
                  <li
                    key={step.n}
                    className="grid gap-3 p-6 sm:grid-cols-[auto_1fr] sm:gap-6 sm:p-8"
                  >
                    <span className="text-display text-3xl text-purple-deep">{step.n}</span>
                    <div>
                      <p className="text-display text-xl text-ink">{step.title}</p>
                      <p className="mt-2 text-base leading-relaxed text-ink/75">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-display text-5xl md:text-7xl">What I believe.</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Less, but better.",
              d: "Small batches. No restocks. Quality over volume - every single time.",
            },
            {
              t: "Creativity beyond all.",
              d: "Constraints from rescued materials make the bags special, unique, more honest.",
            },
            {
              t: "Made by humans.",
              d: "No factories, no faceless brands. Just one person and a sewing machine.",
            },
          ].map((v) => (
            <div
              key={v.t}
              className="flex flex-col rounded-2xl border-2 border-ink bg-cream p-7 shadow-brutal md:p-8"
            >
              <p className="text-display text-2xl text-purple-deep">{v.t}</p>
              <p className="mt-4 flex-1 text-base leading-relaxed text-ink/75">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <Marquee
        items={["Edinburgh Studio", "Hand Cut", "Hand Sewn", "Hand Packed", "Slow Fashion"]}
      />

      {/* Closing */}
      <section className="bg-ink py-20 text-cream md:py-28">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <h2 className="text-display text-5xl leading-[0.92] md:text-7xl lg:text-8xl">
            Wear something
            <br />
            <span className="text-mustard">no one else has.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-cream/75">
            Small studio, small drops—have a look at what&apos;s on the bench.
          </p>
          <div className="mt-10 flex justify-center">
            <ShopCTA variant="mustard" label="Shop the Drop" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
