import type { ProductCategory } from "@/types/product";

export const SHOP_CATEGORIES = [
  { id: "bags" as const, label: "Bags" },
  { id: "backpacks" as const, label: "Backpacks" },
  { id: "chalk-bags" as const, label: "Chalk Bags" },
] satisfies ReadonlyArray<{ id: ProductCategory; label: string }>;

export const DEFAULT_SHOP_CATEGORY: ProductCategory = "bags";
