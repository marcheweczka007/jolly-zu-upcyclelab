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
import { canPurchase, maxPurchaseQty } from "@/lib/product-utils";
import type { Product } from "@/types/product";

const STORAGE_KEY = "jollyzu-basket-v2";

export type BasketItems = Record<string, number>;

type BasketContextValue = {
  items: BasketItems;
  checkoutItems: BasketItems;
  addItem: (id: string) => void;
  setItemQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearBasket: () => void;
  totalItems: number;
  lineItems: { product: Product; qty: number }[];
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
        items[id] = Math.floor(qty);
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

function capQtyForProduct(product: Product, qty: number): number {
  const max = maxPurchaseQty(product);
  if (max <= 0) return 0;
  return Math.min(Math.max(1, Math.floor(qty)), max);
}

function pruneItems(items: BasketItems, productsById: Map<string, Product>): BasketItems {
  const pruned: BasketItems = {};
  for (const [id, qty] of Object.entries(items)) {
    const product = productsById.get(id);
    if (!product || !canPurchase(product)) continue;
    const capped = capQtyForProduct(product, qty);
    if (capped > 0) pruned[id] = capped;
  }
  return pruned;
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const { products, getProductById, isLoading } = useProducts();
  const [items, setItems] = useState<BasketItems>(readStorage);

  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  useEffect(() => {
    if (isLoading || products.length === 0) return;
    setItems((prev) => {
      const next = pruneItems(prev, productsById);
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, [isLoading, products, productsById]);

  useEffect(() => {
    writeStorage(items);
  }, [items]);

  const setItemQty = useCallback(
    (id: string, qty: number) => {
      const product = getProductById(id);
      if (!product) return;
      if (qty <= 0) {
        setItems((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        return;
      }
      const capped = capQtyForProduct(product, qty);
      if (capped <= 0) return;
      setItems((prev) => ({ ...prev, [id]: capped }));
    },
    [getProductById],
  );

  const addItem = useCallback(
    (id: string) => {
      const product = getProductById(id);
      if (!product || !canPurchase(product)) return;
      setItems((prev) => {
        const current = prev[id] ?? 0;
        const capped = capQtyForProduct(product, current + 1);
        if (capped <= 0) return prev;
        return { ...prev, [id]: capped };
      });
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

  const lineItems = useMemo(() => {
    return Object.entries(items)
      .map(([id, qty]) => {
        const product = getProductById(id);
        if (!product || qty <= 0) return null;
        return { product, qty };
      })
      .filter((row): row is { product: Product; qty: number } => row !== null);
  }, [items, getProductById]);

  const checkoutItems = useMemo(() => {
    const valid: BasketItems = {};
    for (const { product, qty } of lineItems) {
      valid[product.id] = qty;
    }
    return valid;
  }, [lineItems]);

  const totalItems = useMemo(
    () => lineItems.reduce((sum, { qty }) => sum + qty, 0),
    [lineItems],
  );

  const subtotalPence = useMemo(
    () => lineItems.reduce((sum, { product, qty }) => sum + product.pricePence * qty, 0),
    [lineItems],
  );

  const value = useMemo(
    () => ({
      items,
      checkoutItems,
      addItem,
      setItemQty,
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
      setItemQty,
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
