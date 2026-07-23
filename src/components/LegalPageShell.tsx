import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function LegalPageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-5 pb-20 pt-8 md:px-8 md:pt-14">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">
          {eyebrow}
        </p>
        <h1 className="text-display text-4xl md:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink/75">{intro}</p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-ink/80">{children}</div>

        <p className="mt-16 border-t-2 border-ink/10 pt-8 text-sm text-ink/55">
          Last updated: June 2026 · JollyZu Upcycle Lab, Edinburgh, United Kingdom
        </p>
      </article>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
