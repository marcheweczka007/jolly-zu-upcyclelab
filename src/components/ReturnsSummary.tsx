import { Link } from "@tanstack/react-router";
import { RETURNS_POLICY_PATH, RETURNS_SUMMARY } from "@/lib/legal";
import { cn } from "@/lib/utils";

export function ReturnsSummary({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={cn(
        "leading-relaxed text-ink/60",
        compact ? "text-[11px]" : "text-sm",
      )}
    >
      {RETURNS_SUMMARY}{" "}
      <Link
        to={RETURNS_POLICY_PATH}
        className="font-semibold text-ink/75 underline underline-offset-2 hover:text-purple-deep"
      >
        Returns Policy
      </Link>
      .
    </p>
  );
}
