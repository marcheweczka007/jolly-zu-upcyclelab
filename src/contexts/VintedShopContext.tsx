import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { VintedShopModal } from "@/components/VintedShopModal";

type VintedShopContextValue = {
  openShop: () => void;
};

const VintedShopContext = createContext<VintedShopContextValue | null>(null);

export function VintedShopProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openShop = useCallback(() => setOpen(true), []);

  return (
    <VintedShopContext.Provider value={{ openShop }}>
      {children}
      <VintedShopModal open={open} onOpenChange={setOpen} />
    </VintedShopContext.Provider>
  );
}

export function useVintedShop() {
  const ctx = useContext(VintedShopContext);
  if (!ctx) {
    throw new Error("useVintedShop must be used within VintedShopProvider");
  }
  return ctx;
}
