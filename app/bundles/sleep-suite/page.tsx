import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SleepSuiteBuilder } from "@/components/bundle-view";
import { SALE, SLEEP_SUITE } from "@/lib/sale";

export const metadata: Metadata = {
  title: SLEEP_SUITE.name,
  description: "One Ashbury organic mattress, chosen in your size, feel and color, with a bedding set (two pillows and a Mattress Protector). Free white glove delivery for the mattress is included.",
  alternates: { canonical: SLEEP_SUITE.path },
};

export default function SleepSuitePage() {
  if (!SALE.active) notFound();
  return (
    <main>
      <SleepSuiteBuilder />
    </main>
  );
}
