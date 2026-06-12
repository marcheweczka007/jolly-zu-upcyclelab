import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { CONTACT_FORM_URL } from "@/constants/contact";
import { TERMS_PATH } from "@/lib/legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/returns-policy")({
  head: () =>
    pageHead({
      title: "Returns Policy — JollyZu Upcycle Lab",
      description:
        "14-day cancellation and returns for UK online orders under the Consumer Contracts Regulations. How to cancel, return, and get a refund from JollyZu.",
      path: "/returns-policy",
    }),
  component: ReturnsPolicyPage,
});

function ReturnsPolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Returns"
      title="Returns Policy"
      intro="This policy applies to items bought through jollyzu.com by consumers in the United Kingdom. It explains your statutory right to cancel under the Consumer Contracts Regulations 2013 and how returns work in practice."
    >
      <LegalSection title="Your 14-day cancellation right">
        <p>
          When you buy online, you have the right to cancel your order within{" "}
          <strong>14 days</strong> without giving a reason. The cancellation period starts the day
          after you receive the goods (or after a third party you nominate receives them).
        </p>
        <p>
          To exercise this right, contact us clearly before the 14-day period ends — for example via
          our{" "}
          <a
            href={CONTACT_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-purple-deep"
          >
            contact form
          </a>{" "}
          or Instagram{" "}
          <a
            href="https://instagram.com/upcycle.lab.jollyzu"
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-purple-deep"
          >
            @upcycle.lab.jollyzu
          </a>
          . Include your name, order details, and a clear statement that you wish to cancel.
        </p>
      </LegalSection>

      <LegalSection title="Returning items">
        <p>
          If you cancel, you must send the goods back within 14 days of telling us. Please pack
          items securely so they are not damaged in transit. We recommend using a tracked service
          and keeping proof of postage.
        </p>
        <p>
          Unless the item is faulty or not as described, <strong>you pay the cost of return postage</strong>.
          We are not required to collect goods from you.
        </p>
      </LegalSection>

      <LegalSection title="Refunds">
        <p>
          If you cancel within the 14-day period, we will refund all payments received from you,
          including standard delivery costs (if any were charged). We will process the refund within
          14 days of receiving the returned goods, or within 14 days of you providing evidence that
          you have sent them back — whichever is earlier.
        </p>
        <p>
          Refunds are made using the same payment method you used at checkout, unless we agree
          otherwise. You will not be charged a fee for the refund itself.
        </p>
        <p>
          We may deduct an amount for any diminished value of the goods if handling goes beyond what
          is necessary to establish their nature, characteristics, and functioning (for example,
          wearing a bag outdoors).
        </p>
      </LegalSection>

      <LegalSection title="Pre-orders">
        <p>
          For pre-order items, the 14-day cancellation period begins when you receive the finished
          piece, not when you place the order. Until dispatch, you may cancel by contacting us as
          above and we will refund any payment already taken.
        </p>
      </LegalSection>

      <LegalSection title="Faulty or misdescribed items">
        <p>
          Your statutory rights under the Consumer Rights Act 2015 are separate from the
          cancellation right. If an item is faulty, not as described, or not of satisfactory
          quality, contact us and we will put things right — including repair, replacement, or
          refund as appropriate. In these cases we will cover reasonable return postage.
        </p>
      </LegalSection>

      <LegalSection title="When the cancellation right does not apply">
        <p>
          The 14-day right does not apply to goods made to your personal specifications or clearly
          personalised (for example, a bespoke commission agreed outside the standard shop listing).
          It also does not apply to sealed goods that are not suitable for return due to health
          protection or hygiene reasons if unsealed after delivery.
        </p>
        <p>
          Items bought from our standard online shop listings are ready-made pieces, not made to your
          individual order, so the cancellation right normally applies.
        </p>
      </LegalSection>

      <LegalSection title="More information">
        <p>
          For full terms of sale, see our{" "}
          <Link to={TERMS_PATH} className="font-semibold underline underline-offset-2 hover:text-purple-deep">
            Terms &amp; Conditions
          </Link>
          . For questions about a specific order, use the{" "}
          <a
            href={CONTACT_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-purple-deep"
          >
            contact form
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
