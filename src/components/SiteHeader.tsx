import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { SHOW_SHOP } from "@/constants/shop";
import { useBasket } from "@/contexts/BasketContext";
import { useVintedShop } from "@/contexts/VintedShopContext";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useBasket();
  const { openShop } = useVintedShop();

  const dropButtonClass =
    "rounded-full bg-ink px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5 hover:bg-purple-deep";

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="group flex items-center gap-2">
          <span className="text-display text-2xl tracking-tighter">JOLLYZU</span>
          <span className="hidden h-2 w-2 rounded-full bg-leaf md:block" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium uppercase tracking-wider hover:text-purple-deep"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-purple-deep" }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium uppercase tracking-wider hover:text-purple-deep"
            activeProps={{ className: "text-purple-deep" }}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium uppercase tracking-wider hover:text-purple-deep"
            activeProps={{ className: "text-purple-deep" }}
          >
            Contact
          </Link>
          {SHOW_SHOP && (
            <Link
              to="/shop"
              className="text-sm font-medium uppercase tracking-wider hover:text-purple-deep"
              activeProps={{ className: "text-purple-deep" }}
            >
              Shop
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {SHOW_SHOP && (
            <Link
              to="/shop/basket"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-cream"
              aria-label={`Basket${totalItems > 0 ? `, ${totalItems} items` : ""}`}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={2.25} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-mustard px-1 text-[10px] font-black text-ink">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
          )}
          {SHOW_SHOP ? (
            <Link to="/shop" className={dropButtonClass}>
              Shop the Drop
            </Link>
          ) : (
            <button type="button" onClick={openShop} className={dropButtonClass}>
              Shop the Drop
            </button>
          )}
        </div>

        <button aria-label="Menu" onClick={() => setOpen(!open)} className="md:hidden">
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-6 bg-ink" />
            <span className="h-0.5 w-6 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-cream md:hidden">
          <nav className="flex flex-col gap-4 px-5 py-6">
            <Link to="/" onClick={() => setOpen(false)} className="text-display text-2xl">
              Home
            </Link>
            <Link to="/about" onClick={() => setOpen(false)} className="text-display text-2xl">
              About
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="text-display text-2xl">
              Contact
            </Link>
            {SHOW_SHOP && (
              <>
                <Link to="/shop" onClick={() => setOpen(false)} className="text-display text-2xl">
                  Shop
                </Link>
                <Link
                  to="/shop/basket"
                  onClick={() => setOpen(false)}
                  className="text-display text-2xl"
                >
                  Basket{totalItems > 0 ? ` (${totalItems})` : ""}
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className={`mt-2 inline-flex w-fit ${dropButtonClass}`}
                >
                  Shop the Drop
                </Link>
              </>
            )}
            {!SHOW_SHOP && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openShop();
                }}
                className={`mt-2 inline-flex w-fit ${dropButtonClass}`}
              >
                Shop the Drop
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
