import type { Metadata } from "next";
import Link from "next/link";
import { TradeTerms } from "@/components/trade-terms";

export const metadata: Metadata = {
  title: "Trade terms",
  description: "Pricing, ordering, delivery and returns for members of the Ashwick Trade Program.",
};

export default function TradeTermsPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Ashwick Trade</div>
        <h1 className="h1">Trade terms</h1>
        <p className="body">
          For eligibility and to apply, see the <Link href="/pages/trade" className="inl">trade program</Link>.
        </p>
      </section>
      <section className="sec terms-sec">
        <div className="wrap"><TradeTerms /></div>
      </section>
    </main>
  );
}
