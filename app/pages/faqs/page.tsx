import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { Accordion } from "@/components/mattress";
import { BESPOKE_PATH, BESPOKE_REPLY } from "@/lib/bespoke";
import { GUARANTEE_PATH, MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { LEAD_TIME } from "@/lib/products";
import { STUDIO_EMAIL, STUDIO_PHONE, STUDIO_PHONE_HREF } from "@/lib/site";
import { TRADE_TERMS, WARRANTY_PATH } from "@/lib/trade-terms";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about Ashwick furniture, the Ashbury mattress, delivery, returns and Bespoke.",
};

const M = MATTRESS;
const a = (children: React.ReactNode) => <p className="body small">{children}</p>;

const FAQS: [string, React.ReactNode][] = [
  ["What are your pieces made of?", a(<>Solid hardwood, organic wool, linen, coconut coir, organic agave and natural oils. Nothing synthetic: no polyurethane foam, no latex and no chemical flame retardants. <Link href="/pages/furniture-materials" className="inl">Furniture materials</Link></>)],
  ["Where is everything made?", a("Every piece is made to order by hand in the USA.")],
  ["How long does delivery take?", a(<>Furniture: {LEAD_TIME} The {M.shortName} mattress: {M.leadTime} <Link href="/pages/delivery" className="inl">Delivery</Link></>)],
  ["Is delivery included?", a(<>For the {M.shortName}, standard delivery is included and white-glove delivery is extra. For furniture, white-glove delivery is charged per piece and shown on each product page.</>)],
  ["Can I customize a piece?", a(<>Yes. Choose the fabric, and on some pieces the seat depth, length or wood finish, using the Customize option on the product page. For something entirely new, see <Link href={BESPOKE_PATH} className="inl">Bespoke</Link>; we reply {BESPOKE_REPLY}.</>)],
  ["Can I see fabrics before I order?", a(<>Yes. <Link href="/pages/fabric-swatches" className="inl">Order fabric swatches</Link> to see and feel them at home.</>)],
  [`Can I return the ${M.shortName} mattress?`, a(<>Yes. {M.guarantee}: sleep on it for at least {M.guaranteeMinNights} nights, and if it isn&apos;t right within {M.guaranteeNights} nights of delivery, we collect it at no cost and refund you in full. Custom sizes aren&apos;t covered. <Link href={GUARANTEE_PATH} className="inl">Guarantee &amp; warranty</Link></>)],
  ["Soft or firm?", a(<>Soft has a deeper, more cushioned top, for side sleepers and anyone who likes to sink in. Firm is more supportive and even, for back and stomach sleepers. Same price and materials. <Link href={MATTRESS_PATH} className="inl">The {M.shortName}</Link></>)],
  ["Do you make custom mattress sizes?", a(M.customSize)],
  ["What warranty do you offer?", a(<>Furniture and the {M.shortName} are covered against defects in materials and workmanship for as long as the original purchaser owns them. <Link href={WARRANTY_PATH} className="inl">Lifetime warranty</Link></>)],
  ["How do I pay?", a(<>Pay in full at checkout. For the {M.shortName}, you can also pay over time with Affirm.</>)],
  ["Do you work with interior designers?", a(<>Yes. Designers and trade professionals can apply to the <Link href="/pages/trade" className="inl">Trade program</Link>; applications are reviewed within {TRADE_TERMS.reviewDays} business days.</>)],
  ["How do I reach you?", a(<>Email <a href={`mailto:${STUDIO_EMAIL}`} className="inl">{STUDIO_EMAIL}</a> or call <a href={STUDIO_PHONE_HREF} className="inl">{STUDIO_PHONE}</a>. The team usually replies to email within one business day.</>)],
];

export default function FaqsPage() {
  return (
    <InfoPage eyebrow="Help" title="FAQs">
      <Accordion items={FAQS} />
    </InfoPage>
  );
}
