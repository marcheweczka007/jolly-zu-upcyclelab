import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { CONTACT_FORM_URL } from "@/constants/contact";
import { RETURNS_POLICY_PATH } from "@/lib/legal";
import { pageHead, SITE_FULL_NAME } from "@/lib/seo";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () =>
    pageHead({
      title: "Terms & Conditions — JollyZu Upcycle Lab",
      description:
        "Terms of sale for JollyZu Upcycle Lab online shop. Payment, delivery, cancellation rights, and UK consumer law.",
      path: "/terms-and-conditions",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms & Conditions"
      intro={`These terms apply when you buy from ${SITE_FULL_NAME} through jollyzu.com. By placing an order you confirm you are at least 18 years old and agree to these terms.`}
    >
      <LegalSection title="Who we are">
        <p>
          {SITE_FULL_NAME} is a small studio based in Edinburgh, United Kingdom, trading as
          JollyZu. Orders are sold directly by us — not through a marketplace intermediary.
        </p>
      </LegalSection>

      <LegalSection title="Contract">
        <p>
          When you complete checkout and payment is accepted, a contract is formed for the items in
          your order. We may decline or cancel an order before dispatch (for example, if an item
          sells out elsewhere or there is a pricing error). If that happens, we will refund any
          payment taken.
        </p>
      </LegalSection>

      <LegalSection title="Prices and payment">
        <p>
          Prices are shown in pounds sterling (GBP) and include UK VAT where applicable. Payment is
          processed securely by Stripe. We do not store your full card details.
        </p>
      </LegalSection>

      <LegalSection title="Delivery">
        <p>
          We post from Edinburgh using tracked services where possible. Delivery times and shipping
          costs are shown at Stripe checkout. Risk of loss passes to you when the goods are
          delivered to the address you provide.
        </p>
        <p>
          Pre-order items are made after you order and typically ship within 2–3 weeks unless
          otherwise stated on the product page.
        </p>
      </LegalSection>

      <LegalSection title="Cancellation and returns">
        <p>
          If you are a consumer buying online, you have a{" "}
          <strong>14-day right to cancel</strong> under the Consumer Contracts Regulations 2013,
          starting the day after you receive the goods. Full details — including how to cancel,
          return items, and receive a refund — are in our{" "}
          <Link
            to={RETURNS_POLICY_PATH}
            className="font-semibold underline underline-offset-2 hover:text-purple-deep"
          >
            Returns Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Your statutory rights">
        <p>
          Nothing in these terms affects your legal rights as a consumer under UK law, including
          the Consumer Rights Act 2015. If goods are faulty or not as described, you are entitled to
          a repair, replacement, or refund.
        </p>
      </LegalSection>

      <LegalSection title="Product descriptions">
        <p>
          Each bag is handmade from rescued textiles, so small variations in colour, texture, and
          finish are part of the product. We describe items accurately in listings and photographs;
          if something is not as described, contact us.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          All content on this website — including images, text, and designs — belongs to{" "}
          {SITE_FULL_NAME} unless stated otherwise. You may not copy or reuse it without permission.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          We are responsible for foreseeable loss or damage caused by our breach of these terms or
          failure to use reasonable care. We are not liable for indirect or consequential loss, or
          for delays outside our reasonable control.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of Scotland and England &amp; Wales (as applicable to
          consumers in the United Kingdom). Disputes may be brought in the courts of your country of
          residence if you are a consumer in the UK or EU.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about an order or these terms?{" "}
          <a
            href={CONTACT_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-2 hover:text-purple-deep"
          >
            Get in touch
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
