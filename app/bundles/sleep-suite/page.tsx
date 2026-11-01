import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SleepSuiteBuilder } from "@/components/bundle-view";
import { SALE, SLEEP_SUITE } from "@/lib/sale";

export const metadata: Metadata = {
  title: SLEEP_SUITE.name,
  description: "One Ashbury organic mattress, chosen in your size, feel and color, with a Best Friends Bedding Set (two pillows and a Mattress Protector). Free white glove delivery for the mattress is included.",
  alternates: { canonical: SLEEP_SUITE.path },
};

export default function SleepSuitePage() {
  if (!SALE.active) notFound();
  return (
    <main>
      <section className="page-head wrap" style={{ paddingBottom: 12 }}>
        <div className="eyebrow">{SALE.name} at Ashwick</div>
        <h1 className="h1" style={{ marginBottom: 8 }}>{SLEEP_SUITE.name}</h1>
        <p className="body" style={{ margin: 0 }}>An Ashbury organic mattress with two pillows and a Mattress Protector. {SALE.percent}% off the bundle.</p>
      </section>
      <SleepSuiteBuilder />
    </main>
  );
}
