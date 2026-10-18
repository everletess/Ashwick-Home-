import type { Metadata } from "next";
import Link from "next/link";
import { Block, InfoPage } from "@/components/info-page";
import { BESPOKE_PATH } from "@/lib/bespoke";
import { GUARANTEE_PATH, MATTRESS } from "@/lib/mattress";
import { SWATCH_PRICE, fmt } from "@/lib/products";
import { STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ordering",
  description: "How to order from Ashwick Home: made to order, customizing a piece, swatches, payment and Bespoke.",
};

export default function OrderingPage() {
  return (
    <InfoPage eyebrow="Help" title="Ordering" intro="Every piece is made for you once you order it.">
      <Block title="Made to order">
        <p className="body">
          Order any piece as we designed it, or make it yours: choose the fabric, and on some pieces the seat depth, length or wood finish. Use the Customize option on the product page to send us your request.{" "}
          <Link href="/collections/all" className="inl">Shop the collection</Link>
        </p>
      </Block>
      <Block title="Fabric swatches">
        <p className="body">
          See and feel our fabrics at home before you choose. Swatches are {fmt(SWATCH_PRICE)} each.{" "}
          <Link href="/pages/fabric-swatches" className="inl">Order swatches</Link>
        </p>
      </Block>
      <Block title="Returns & cancellations">
        <p className="body">
          Every piece is made to order. Pieces ordered as designed can be returned within 14 days of delivery, minus return shipping and a 15% restocking fee. Customized and bespoke pieces are final sale unless they arrive damaged. You can change or cancel any order within 12 hours of placing it.{" "}
          <Link href="/pages/terms#returns" className="inl">Full details →</Link>
        </p>
      </Block>
      <Block title="Payment">
        <p className="body">Pay in full at checkout. For the {MATTRESS.shortName} mattress, you can also pay over time with Affirm at checkout.</p>
      </Block>
      <Block title={`The ${MATTRESS.shortName} mattress`}>
        <p className="body">
          {MATTRESS.customSize} Every standard size comes with the {MATTRESS.guaranteeNights}-night guarantee.{" "}
          <Link href={GUARANTEE_PATH} className="inl">Guarantee &amp; warranty</Link>
        </p>
      </Block>
      <Block title="Bespoke">
        <p className="body">
          For something entirely your own, start a Bespoke commission. Commissions are paid in full when commissioned.{" "}
          <Link href={BESPOKE_PATH} className="inl">About Bespoke</Link>
        </p>
      </Block>
      <Block title="Trade">
        <p className="body">
          Interior designers and trade professionals can apply for trade pricing.{" "}
          <Link href="/pages/trade" className="inl">The Trade program</Link>
        </p>
      </Block>
      <Block title="Questions">
        <p className="body">
          Email <a href={`mailto:${STUDIO_EMAIL}`} className="inl">{STUDIO_EMAIL}</a> and the team will help.
        </p>
      </Block>
    </InfoPage>
  );
}
