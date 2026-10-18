import type { Metadata } from "next";
import Link from "next/link";
import { GUARANTEE_PATH } from "@/lib/mattress";
import { STUDIO_EMAIL } from "@/lib/site";
import { TRADE_TERMS } from "@/lib/trade-terms";

export const metadata: Metadata = {
  title: "Furniture warranty",
  description: "Every piece of Ashwick furniture is warranted against defects in materials and workmanship for as long as the original purchaser owns it.",
};

// Wording is deliberate: don't reword. Furniture only; the Ashbury's guarantee and warranty are on /pages/guarantee-warranty.
export default function WarrantyPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Policies</div>
        <h1 className="h1">Furniture warranty</h1>
      </section>
      <section className="sec terms-sec">
        <div className="wrap terms terms-page">
          <div className="terms-block">
            <h2 className="eyebrow terms-h">Our promise</h2>
            <p className="body">
              Every piece of Ashwick furniture is made to be lived with for years. We warrant each piece against defects in materials and workmanship for as long as the original purchaser owns it.
            </p>
            <p className="body">
              This page covers our furniture. For the Ashbury mattress, see{" "}
              <Link href={GUARANTEE_PATH} className="inl">Guarantee &amp; Warranty</Link>.
            </p>
          </div>
          <div className="terms-block">
            <h2 className="eyebrow terms-h">What is covered</h2>
            <p className="body">
              The warranty applies to the entire piece: frame, joinery, suspension, cushion fill and fabric. If a defect in materials or workmanship appears under normal residential use, we will repair or replace the piece at our discretion. If the original piece or fabric is no longer available, we will offer a comparable replacement or a credit toward a new piece.
            </p>
            <p className="body">Repairs and replacements are free. You cover the cost of shipping the piece to and from our workshop.</p>
          </div>
          <div className="terms-block">
            <h2 className="eyebrow terms-h">What is not covered</h2>
            <ul className="body terms-list">
              <li>Normal wear, including the natural softening of cushions, gradual fading and fabric pilling</li>
              <li>Stains, spills and soiling</li>
              <li>Misuse, accidents, or damage from improper cleaning or care</li>
              <li>Repairs or alterations made by anyone other than Ashwick</li>
              <li>Natural variation in organic materials, such as wood grain and the tone of undyed fabrics</li>
            </ul>
          </div>
          <div className="terms-block">
            <h2 className="eyebrow terms-h">Who is covered</h2>
            <p className="body">The warranty belongs to the original purchaser and is not transferable. Proof of purchase is required.</p>
          </div>
          <div className="terms-block">
            <h2 className="eyebrow terms-h">Making a claim</h2>
            <p className="body">
              Email <a href={`mailto:${STUDIO_EMAIL}`} className="inl">{STUDIO_EMAIL}</a> with your order number, a description of the issue and photographs. We will respond within {TRADE_TERMS.warrantyClaimResponseDays} business days.
            </p>
          </div>
          <p className="body">This warranty gives you specific legal rights, and you may also have other rights which vary from state to state.</p>
        </div>
      </section>
    </main>
  );
}
