import { SHOP_CATEGORIES } from "@/constants/shop-categories";
import type { ProductCategory } from "@/types/product";
import { cn } from "@/lib/utils";

type ShopCategoryPillsProps = {
  active: ProductCategory;
  onChange: (category: ProductCategory) => void;
  counts?: Partial<Record<ProductCategory, number>>;
  /** Categories that currently include at least one new product. */
  newCategories?: Partial<Record<ProductCategory, boolean>>;
};

export function ShopCategoryPills({
  active,
  onChange,
  counts,
  newCategories,
}: ShopCategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-3" role="tablist" aria-label="Product category">
      {SHOP_CATEGORIES.map((category) => {
        const count = counts?.[category.id] ?? 0;
        const isActive = active === category.id;
        const hasNew = Boolean(newCategories?.[category.id]);

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category.id)}
            className={cn(
              "relative rounded-full border-2 border-ink px-5 py-2.5 text-xs font-black uppercase tracking-wider shadow-brutal transition-all hover:-translate-y-0.5",
              isActive ? "bg-ink text-cream" : "bg-cream text-ink hover:bg-mustard",
            )}
          >
            {category.label}
            <span className="ml-2 opacity-70">({count})</span>
            {hasNew && (
              <span
                className={cn(
                  "ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
                  isActive ? "bg-mustard text-ink" : "bg-hot-pink text-ink",
                )}
              >
                New
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
