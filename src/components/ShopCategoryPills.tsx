import { DEFAULT_SHOP_CATEGORY, SHOP_CATEGORIES } from "@/constants/shop-categories";
import type { ProductCategory } from "@/types/product";
import { cn } from "@/lib/utils";

type ShopCategoryPillsProps = {
  active: ProductCategory;
  onChange: (category: ProductCategory) => void;
  /** Hide pills that have zero products (still always show Bags). */
  counts?: Partial<Record<ProductCategory, number>>;
};

export function ShopCategoryPills({ active, onChange, counts }: ShopCategoryPillsProps) {
  return (
    <div
      className="flex flex-wrap gap-3"
      role="tablist"
      aria-label="Product category"
    >
      {SHOP_CATEGORIES.map((category) => {
        const count = counts?.[category.id];
        const isActive = active === category.id;
        // Always show Bags; hide empty secondary categories when counts provided
        if (
          category.id !== DEFAULT_SHOP_CATEGORY &&
          counts &&
          (count == null || count === 0)
        ) {
          return null;
        }

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category.id)}
            className={cn(
              "rounded-full border-2 border-ink px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-brutal transition-all hover:-translate-y-0.5",
              isActive
                ? "bg-ink text-cream"
                : "bg-cream text-ink hover:bg-mustard",
            )}
          >
            {category.label}
            {typeof count === "number" && count > 0 ? (
              <span className="ml-2 opacity-70">({count})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
