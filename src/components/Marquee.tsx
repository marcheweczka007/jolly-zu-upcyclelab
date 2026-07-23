import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
  trackClassName?: string;
  itemClassName?: string;
  /** Shown between items. Pass `null` to hide. */
  separator?: ReactNode;
};

export function Marquee({
  items,
  className,
  trackClassName,
  itemClassName,
  separator = <span className="text-purple-deep">✦</span>,
}: MarqueeProps) {
  const doubled = [...items, ...items];
  const label = items.join(" · ");

  return (
    <div
      className={cn("overflow-hidden border-y-2 border-ink bg-mustard py-4", className)}
      aria-label={label}
    >
      <div
        className={cn("marquee flex w-max gap-12 whitespace-nowrap", trackClassName)}
        aria-hidden="true"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn(
              "text-display flex items-center gap-12 text-2xl uppercase md:text-3xl",
              itemClassName,
            )}
          >
            {item}
            {separator}
          </span>
        ))}
      </div>
    </div>
  );
}
