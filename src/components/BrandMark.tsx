import { cn } from "@/lib/utils";

/**
 * JollyZu wordmark.
 *
 * Typographic logo: tight Archivo Black wordmark where the "O" in JOLLY is
 * swapped for a hand-stitched dashed circle (nod to the handmade craft),
 * and a small mustard "knot" sits as the accent. Reads bold, crafted, and
 * unmistakably JollyZu — works on cream or ink backgrounds.
 */
export function BrandMark({
  className,
  tone = "ink",
  size = "md",
}: {
  className?: string;
  tone?: "ink" | "cream";
  size?: "sm" | "md" | "lg";
}) {
  const fg = tone === "ink" ? "text-ink" : "text-cream";
  const stitch = tone === "ink" ? "text-purple-deep" : "text-mustard";

  const sizeMap = {
    sm: { text: "text-xl", ring: 14, stroke: 2.2 },
    md: { text: "text-2xl md:text-[26px]", ring: 18, stroke: 2.6 },
    lg: { text: "text-4xl md:text-5xl", ring: 28, stroke: 3.4 },
  } as const;

  const { text, ring, stroke } = sizeMap[size];
  const dim = ring * 2 + 4;

  return (
    <span
      aria-label="JollyZu"
      className={cn(
        "text-display inline-flex items-center leading-none tracking-[-0.04em]",
        text,
        fg,
        className,
      )}
    >
      <span>J</span>
      {/* O → stitched ring */}
      <span
        className="relative inline-flex items-center justify-center"
        style={{ width: dim, height: dim, marginInline: -2 }}
      >
        <svg
          viewBox={`0 0 ${dim} ${dim}`}
          width={dim}
          height={dim}
          aria-hidden="true"
          className="absolute inset-0"
        >
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={ring}
            fill="none"
            className={fg}
            stroke="currentColor"
            strokeWidth={stroke + 1.4}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={ring}
            fill="none"
            className={stitch}
            stroke="currentColor"
            strokeWidth={stroke - 0.6}
            strokeDasharray="2.5 3.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span>LLYZU</span>
      {/* mustard accent dot — like a stitch knot */}
      <span
        aria-hidden="true"
        className="ml-1 inline-block rounded-full bg-mustard"
        style={{
          width: size === "lg" ? 8 : 5,
          height: size === "lg" ? 8 : 5,
          alignSelf: "flex-start",
          marginTop: size === "lg" ? 6 : 4,
        }}
      />
    </span>
  );
}
