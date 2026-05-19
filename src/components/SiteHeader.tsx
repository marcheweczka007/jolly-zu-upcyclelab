import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useVintedShop } from "@/contexts/VintedShopContext";

const SHOP_URL = "https://www.vinted.co.uk/member/128740025";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { openShop } = useVintedShop();
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
        </nav>

        <button
          type="button"
          onClick={openShop}
          className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5 hover:bg-purple-deep md:inline-flex"
        >
          Shop the Drop ↗
        </button>

        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-6 bg-ink" />
            <span className="h-0.5 w-6 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-cream md:hidden">
          <nav className="flex flex-col gap-4 px-5 py-6">
            <Link to="/" onClick={() => setOpen(false)} className="text-display text-2xl">Home</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="text-display text-2xl">About</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="text-display text-2xl">Contact</Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openShop();
              }}
              className="mt-2 inline-flex w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-cream"
            >
              Shop the Drop ↗
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export { SHOP_URL };
