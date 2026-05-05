import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ShopCTA } from "@/components/ShopCTA";
import { Marquee } from "@/components/Marquee";
import maker from "@/assets/maker-portrait.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — JollyZu | The maker behind the bags" },
      {
        name: "description",
        content:
          "Meet Zuza, the indie maker turning rescued textiles into one-of-a-kind upcycled bags from her Edinburgh studio.",
      },
      { property: "og:title", content: "About JollyZu — Meet the maker" },
      { property: "og:description", content: "One person. One studio. Zero new fabric." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 md:px-8 md:pb-20 md:pt-16">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-deep">About</p>
        <h2 className="text-display text-[10vw] leading-[0.85] md:text-[5rem]">
          One person, stitching every piece.
          <br />
          <span className="bg-mustard px-3 inline-block -rotate-1">No new fabric - ever.</span>
        </h2>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:grid md:grid-cols-12 md:gap-16 md:px-8 md:pb-32">
        <div className="md:col-span-5">
          <div className="relative">
            <img
              src={maker}
              alt="Zuza, the maker behind JollyZu, working at her sewing machine in Edinburgh"
              width={1024}
              height={1280}
              className="w-full rounded-2xl border-2 border-ink object-cover shadow-brutal-lg"
            />
            <div className="absolute -bottom-5 -left-5 rotate-[-6deg] bg-leaf px-4 py-2 text-xs font-black uppercase tracking-wider text-ink shadow-brutal">
              Hi, I'm Zuza 👋
            </div>
          </div>
        </div>
        <div className="mt-12 space-y-6 text-lg text-ink/80 md:col-span-7 md:mt-0">
          <p className="text-display text-3xl text-ink md:text-4xl ">
            JollyZu started quietly - with a simple idea: if the fabric is still good, it deserves
            another life.
          </p>
          <p>
            What began as a side project - sewing rave fanny packs for friends - turned into a small
            studio in Edinburgh making bags entirely from rescued textiles. Denim offcuts, pre-loved
            clothes, old rain coats, your nan's curtains. If it can be cut and stitched, it can
            become a bag.
          </p>
          <p>
            Every piece is designed around the materials I find. That means no two bags are
            identical, and none of them will ever exist again. It also means the design has to bend
            to what's available - and honestly, that's where the best ideas come from.
          </p>
          <p>
            I sew everything myself. I package everything myself. 100% recycled packaging, posted
            direct from Edinburgh.
          </p>
          <div className="pt-4">
            <ShopCTA variant="huge" label="Shop the Drop" />
          </div>
        </div>
      </section>

      <Marquee
        items={["Edinburgh Studio", "Hand Cut", "Hand Sewn", "Hand Packed", "Slow Fashion"]}
      />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-32">
        <h2 className="text-display text-5xl md:text-7xl">What I believe.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Less, but better.",
              d: "Small batches. No restocks. Quality over volume — every single time.",
            },
            {
              t: "Waste is a design brief.",
              d: "Constraints from rescued materials make the bags weirder, bolder, more honest.",
            },
            {
              t: "Made by humans.",
              d: "No factories, no faceless brands. Just one person and a sewing machine.",
            },
          ].map((v) => (
            <div key={v.t} className="rounded-2xl border-2 border-ink bg-cream p-8 shadow-brutal">
              <p className="text-display text-2xl text-purple-deep">{v.t}</p>
              <p className="mt-3 text-ink/70">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-24 text-cream md:py-32">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
          <h2 className="text-display text-5xl md:text-8xl">
            Wear something
            <br />
            <span className="text-mustard">no one else has.</span>
          </h2>
          <div className="mt-12 flex justify-center">
            <ShopCTA variant="huge" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
