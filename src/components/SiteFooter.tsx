import { Link } from "@tanstack/react-router";
import { SHOP_URL } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="text-display text-5xl leading-[0.9] md:text-7xl">
              Wear
              <br />
              the
              <br />
              <span className="text-mustard">change.</span>
            </p>
            <p className="mt-6 max-w-sm text-sm text-cream/70">
              JollyZu - handmade upcycled bags from Edinburgh. Slow fashion. Small batch. Built to
              last.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-cream/50">Site</p>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-mustard">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-mustard">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-mustard">
                  Contact
                </Link>
              </li>
              <li>
                <a href={SHOP_URL} target="_blank" rel="noreferrer" className="hover:text-mustard">
                  Shop ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-cream/50">Follow</p>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://instagram.com/upcycle.lab.jollyzu"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-mustard"
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href={SHOP_URL} target="_blank" rel="noreferrer" className="hover:text-mustard">
                  Vinted ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} JollyZu Upcycled Studio · Edinburgh</p>
          <p>Made from what was thrown away.</p>
        </div>
      </div>
    </footer>
  );
}
