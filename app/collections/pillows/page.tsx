import type { Metadata } from "next";
import { CollectionTabs } from "@/components/collection-tabs";
import { CompareFills, CompleteBedPair, CoverSection, FieldStrip, PillowCards, PillowFaq, PillowHero, PillowMaterials, PillowQuiz } from "@/components/pillow-landing";
import { PILLOW_PATH } from "@/lib/pillow";

export const metadata: Metadata = {
  title: "Organic Pillows: Living Wool, Horsehair & Cotton",
  description:
    "Three organic bed pillows handmade in the USA: organic Living Wool with latex, organic Living Wool with horsehair, or 100% organic cotton. Removable organic cotton cover in four colors. Fast, free delivery.",
  alternates: { canonical: PILLOW_PATH },
};

/** The Pillows landing page (Tessa's brief, round 2): its own template rather than the standard collection grid. */
export default function PillowsPage() {
  return (
    <main className="pl">
      <PillowHero />
      <CollectionTabs current="pillows" />
      <PillowQuiz />
      <PillowCards />
      <PillowMaterials />
      <FieldStrip />
      <CompareFills />
      <CoverSection />
      <CompleteBedPair />
      <PillowFaq />
    </main>
  );
}
