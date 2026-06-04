import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { fetchProducts } from "@/lib/products-api";
import { getProductById as findProduct } from "@/lib/product-utils";
import { SHOW_SHOP } from "@/constants/shop";
import type { Product } from "@/types/product";

type ProductsContextValue = {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  /** Refetch from Stripe, bypassing CDN and server catalog cache. */
  refetchFresh: () => void;
  getProductById: (id: string) => Product | undefined;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 60_000,
    enabled: SHOW_SHOP,
  });

  const products = query.data ?? [];

  const getProductById = useCallback((id: string) => findProduct(products, id), [products]);

  const refetchFresh = useCallback(() => {
    void query.refetch({ queryFn: () => fetchProducts({ fresh: true }) });
  }, [query]);

  const value = useMemo(
    () => ({
      products,
      isLoading: query.isLoading,
      isError: query.isError,
      error: query.error ?? null,
      refetch: () => {
        void query.refetch();
      },
      refetchFresh,
      getProductById,
    }),
    [
      products,
      query.isLoading,
      query.isError,
      query.error,
      query.refetch,
      refetchFresh,
      getProductById,
    ],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return ctx;
}
