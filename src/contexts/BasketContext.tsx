import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { canPurchase, getListingById, type Listing } from "@/data/listings";

const STORAGE_KEY = "jollyzu-basket";

export type BasketItems = Record<string, number>;

type BasketContextValue = {
  items: BasketItems;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearBasket: () => void;
  totalItems: number;
  lineItems: { listing: Listing }[];
  subtotalPence: number;
};

const BasketContext = createContext<BasketContextValue | null>(null);

function readStorage(): BasketItems {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const items: BasketItems = {};
    for (const [id, qty] of Object.entries(parsed)) {
      if (typeof id === "string" && typeof qty === "number" && qty > 0) {
        items[id] = 1;
      }
    }
    return items;
  } catch {
    return {};
  }
}

function writeStorage(items: BasketItems) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItems>(readStorage);

  useEffect(() => {
    writeStorage(items);
  }, [items]);

  const addItem = useCallback((id: string) => {
    const listing = getListingById(id);
    if (!listing || !canPurchase(listing)) return;
    setItems((prev) => ({ ...prev, [id]: 1 }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const hasItem = useCallback((id: string) => (items[id] ?? 0) > 0, [items]);

  const clearBasket = useCallback(() => setItems({}), []);

  const lineItems = useMemo(() => {
    return Object.keys(items)
      .map((id) => {
        const listing = getListingById(id);
        if (!listing) return null;
        return { listing };
      })
      .filter((row): row is { listing: Listing } => row !== null);
  }, [items]);

  const totalItems = useMemo(() => lineItems.length, [lineItems]);

  const subtotalPence = useMemo(
    () => lineItems.reduce((sum, { listing }) => sum + listing.pricePence, 0),
    [lineItems],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      hasItem,
      clearBasket,
      totalItems,
      lineItems,
      subtotalPence,
    }),
    [items, addItem, removeItem, hasItem, clearBasket, totalItems, lineItems, subtotalPence],
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) {
    throw new Error("useBasket must be used within BasketProvider");
  }
  return ctx;
}
