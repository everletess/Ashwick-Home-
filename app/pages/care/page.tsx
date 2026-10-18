import type { Metadata } from "next";
import Link from "next/link";
import { Block, InfoPage } from "@/components/info-page";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { STUDIO_EMAIL } from "@/lib/site";
import { WARRANTY_PATH } from "@/lib/trade-terms";

export const metadata: Metadata = {
  title: "Care",
  description: "Caring for your Ashbury mattress, topper and Ashwick furniture.",
};

// Mattress and topper care repeat the mattress page's Care rows (app/products/luxury-organic-mattress/page.tsx).
export default function CarePage() {
  return (
    <InfoPage eyebrow="Help" title="Care" intro="Natural materials, looked after simply, last for years.">
      <Block title={`The ${MATTRESS.shortName} mattress`}>
        <p className="body">
          Single-sided; no flipping needed. Rotate 180° every 3–6 months. Air it occasionally by removing the bedding for an hour. Spot clean only; do not saturate. Use a professional cleaner for deeper care. We recommend a breathable mattress protector from the first night.
        </p>
        <p className="body">Wool and horsehair gently settle to you over the first months. This is normal.</p>
      </Block>
      <Block title="The topper">
        <p className="body">Rotate regularly and air when you can. Do not machine wash. Spot clean only; use a professional cleaner for deeper care. Store flat if removed.</p>
      </Block>
      <Block title="Foundation and sheets">
        <p className="body">
          The {MATTRESS.shortName} needs a firm, flat base that lets it breathe: a solid platform, or slats no more than 3&quot; apart. For Queen, King and Cal King, choose a base with a center support rail and legs. Avoid old box springs and placing it directly on the floor for long periods. Use deep-pocket sheets: 15&quot;+ pocket depth with the topper, 12&quot;+ without.{" "}
          <Link href={MATTRESS_PATH} className="inl">Mattress details</Link>
        </p>
      </Block>
      <Block title="Furniture">
        <p className="body">
          Every fabric and finish is a little different. Email <a href={`mailto:${STUDIO_EMAIL}`} className="inl">{STUDIO_EMAIL}</a> with your piece and fabric and we&apos;ll tell you exactly how to care for it. Damage from improper cleaning isn&apos;t covered by the{" "}
          <Link href={WARRANTY_PATH} className="inl">lifetime warranty</Link>, so please ask before trying anything new.
        </p>
      </Block>
    </InfoPage>
  );
}
