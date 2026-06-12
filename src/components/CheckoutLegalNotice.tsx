import { Link } from "@tanstack/react-router";
import { RETURNS_POLICY_PATH, TERMS_PATH } from "@/lib/legal";

export function CheckoutLegalNotice() {
  return (
    <p className="text-sm leading-relaxed text-ink/60">
      By completing checkout you agree to our{" "}
      <Link
        to={TERMS_PATH}
        className="font-semibold text-ink/75 underline underline-offset-2 hover:text-purple-deep"
      >
        Terms &amp; Conditions
      </Link>
      . You have a 14-day right to cancel online purchases under the Consumer Contracts
      Regulations — see our{" "}
      <Link
        to={RETURNS_POLICY_PATH}
        className="font-semibold text-ink/75 underline underline-offset-2 hover:text-purple-deep"
      >
        Returns Policy
      </Link>{" "}
      for how to cancel and return items.
    </p>
  );
}
