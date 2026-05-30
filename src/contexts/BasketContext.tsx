import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useProducts } from "@/contexts/ProductsContext";
import { canPurchase } from "@/lib/product-utils";
import type { Product } from "@/types/product";

const STORAGE_KEY = "jollyzu-basket-v2";

export type BasketItems = Record<string, number>;

type BasketContextValue = {
  items: BasketItems;
  checkoutItems: BasketItems;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearBasket: () => void;
  totalItems: number;
  lineItems: { product: Product }[];
  subtotalPence: number;
};

const BasketContext = createContext<BasketContextValue | null>(null);

const LEGACY_STORAGE_KEY = "jollyzu-basket";

function readStorage(): BasketItems {
  if (typeof window === "undefined") return {};
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
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

function pruneItems(items: BasketItems, productIds: Set<string>): BasketItems {
  const pruned: BasketItems = {};
  for (const [id, qty] of Object.entries(items)) {
    if (productIds.has(id) && qty > 0) pruned[id] = 1;
  }
  return pruned;
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const { products, getProductById, isLoading } = useProducts();
  const [items, setItems] = useState<BasketItems>(readStorage);

  // Drop ids from the old hardcoded catalog once Stripe products are loaded
  useEffect(() => {
    if (isLoading || products.length === 0) return;
    const validIds = new Set(products.map((p) => p.id));
    setItems((prev) => {
      const next = pruneItems(prev, validIds);
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, [isLoading, products]);

  useEffect(() => {
    writeStorage(items);
  }, [items]);

  const addItem = useCallback(
    (id: string) => {
      const product = getProductById(id);
      if (!product || !canPurchase(product)) return;
      setItems((prev) => ({ ...prev, [id]: 1 }));
    },
    [getProductById],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const hasItem = useCallback((id: string) => (items[id] ?? 0) > 0, [items]);

  const clearBasket = useCallback(() => setItems({}), []);

  /** Only ids that exist in the current Stripe catalog — use for checkout */
  const lineItems = useMemo(() => {
    return Object.keys(items)
      .map((id) => {
        const product = getProductById(id);
        if (!product) return null;
        return { product };
      })
      .filter((row): row is { product: Product } => row !== null);
  }, [items, getProductById]);

  const checkoutItems = useMemo(() => {
    const valid: BasketItems = {};
    for (const { product } of lineItems) {
      valid[product.id] = 1;
    }
    return valid;
  }, [lineItems]);

  const totalItems = useMemo(() => lineItems.length, [lineItems]);

  const subtotalPence = useMemo(
    () => lineItems.reduce((sum, { product }) => sum + product.pricePence, 0),
    [lineItems],
  );

  const value = useMemo(
    () => ({
      items,
      checkoutItems,
      addItem,
      removeItem,
      hasItem,
      clearBasket,
      totalItems,
      lineItems,
      subtotalPence,
    }),
    [
      items,
      checkoutItems,
      addItem,
      removeItem,
      hasItem,
      clearBasket,
      totalItems,
      lineItems,
      subtotalPence,
    ],
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
