import type { Metadata } from "next";
import Link from "next/link";
import { Block, InfoPage } from "@/components/info-page";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { LEAD_TIME, PRODUCTS, fmt } from "@/lib/products";
import { BESPOKE_PATH } from "@/lib/bespoke";
import { STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery",
  description: "How and when your Ashwick furniture and Ashbury mattress arrive.",
};

const whiteGlove = PRODUCTS.find((p) => p.delivery)?.delivery;

export default function DeliveryPage() {
  return (
    <InfoPage eyebrow="Help" title="Delivery" intro="Everything we make is made to order, by hand, in the USA. Here is how it reaches you.">
      <Block title="Furniture">
        <p className="body">{LEAD_TIME} For pieces available to pre-order, we confirm your order and estimated ship date by email.</p>
        {whiteGlove && (
          <p className="body">
            {whiteGlove.label} is {fmt(whiteGlove.price)} per piece, shown on each product page.
          </p>
        )}
      </Block>
      <Block title={`The ${MATTRESS.shortName} mattress`}>
        <p className="body">
          {MATTRESS.leadTime} Standard delivery is included in the price; white-glove delivery is available for an additional fee. Every mattress arrives wrapped in biodegradable paper.{" "}
          <Link href={MATTRESS_PATH} className="inl">Shop the {MATTRESS.shortName}</Link>
        </p>
      </Block>
      <Block title="Bespoke">
        <p className="body">
          Lead time depends on the project, and we&apos;ll confirm it with your quote. Bespoke pieces arrive by white-glove delivery.{" "}
          <Link href={BESPOKE_PATH} className="inl">About Bespoke</Link>
        </p>
      </Block>
      <Block title="Questions">
        <p className="body">
          Email <a href={`mailto:${STUDIO_EMAIL}`} className="inl">{STUDIO_EMAIL}</a> with your order number and we&apos;ll help.
        </p>
      </Block>
    </InfoPage>
  );
}
