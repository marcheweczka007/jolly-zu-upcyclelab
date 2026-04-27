import { cn } from "@/lib/utils";

/**
 * JollyZu wordmark.
 *
 * Custom SVG logo: chunky stencil-style wordmark where the "O" is replaced
 * by a hand-stitched circle (dashed ring), nodding to the handmade /
 * upcycled craft. The dot of the "i" / accent becomes a tiny mustard
 * stitch knot. Designed to feel bold, playful, and crafted — not generic.
 */
export function BrandMark({
  className,
  tone = "ink",
  showTag = true,
}: {
  className?: string;
  tone?: "ink" | "cream";
  showTag?: boolean;
}) {
  const fg = tone === "ink" ? "var(--ink)" : "var(--cream)";
  const accent = "var(--mustard)";
  const stitch = tone === "ink" ? "var(--purple-deep)" : "var(--mustard)";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} aria-label="JollyZu">
      <svg
        viewBox="0 0 220 56"
        role="img"
        aria-hidden="true"
        className="h-7 w-auto md:h-8"
      >
        {/* J */}
        <path
          d="M8 6 H28 V36 a14 14 0 0 1 -28 0 v-4 h10 v4 a4 4 0 0 0 8 0 V6 Z"
          fill={fg}
        />
        {/* O — stitched ring */}
        <g>
          <circle cx="48" cy="28" r="14" fill="none" stroke={fg} strokeWidth="6" />
          <circle
            cx="48"
            cy="28"
            r="14"
            fill="none"
            stroke={stitch}
            strokeWidth="2"
            strokeDasharray="3 4"
            strokeLinecap="round"
          />
        </g>
        {/* L */}
        <path d="M70 6 H80 V40 H94 V50 H70 Z" fill={fg} />
        {/* L */}
        <path d="M98 6 H108 V40 H122 V50 H98 Z" fill={fg} />
        {/* Y */}
        <path
          d="M126 6 H137 L143 22 L149 6 H160 L148 32 V50 H138 V32 Z"
          fill={fg}
        />
        {/* Z — slanted with mustard accent block */}
        <path d="M166 6 H198 V14 L180 42 H198 V50 H166 V42 L184 14 H166 Z" fill={fg} />
        {/* U */}
        <path
          d="M204 6 H214 V36 a4 4 0 0 0 8 0 V6 H214 Z"
          fill={fg}
          transform="translate(-2 0)"
        />
        {/* mustard stitch dot */}
        <circle cx="217" cy="10" r="3" fill={accent} />
      </svg>
      {showTag && (
        <span
          className="hidden h-1.5 w-1.5 rounded-full md:inline-block"
          style={{ background: "var(--leaf)" }}
        />
      )}
    </span>
  );
}
