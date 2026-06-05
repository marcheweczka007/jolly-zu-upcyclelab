import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useProducts } from "@/contexts/ProductsContext";

export function ShopProductsState({ children }: { children: ReactNode }) {
  const { isLoading, isError, error, refetch } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-deep">Loading shop…</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="aspect-[3/4] animate-pulse rounded-2xl border-2 border-ink/10 bg-muted"
              />
            ))}
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
          <p className="text-display text-2xl">Couldn&apos;t load the shop</p>
          <p className="mt-4 text-ink/70">{error?.message ?? "Stripe catalog unavailable."}</p>
          <p className="mt-2 text-sm text-ink/55">
            Locally, run <code className="text-ink/80">npm run dev</code> (Netlify dev) and open{" "}
            <code className="text-ink/80">http://localhost:8888</code>. Check STRIPE_SECRET_KEY in{" "}
            <code className="text-ink/80">.env</code>.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-display mt-8 rounded-full bg-ink px-8 py-4 text-lg uppercase text-cream shadow-brutal hover:bg-purple-deep"
          >
            Try again
          </button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return children;
}
