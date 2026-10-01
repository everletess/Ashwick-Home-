import type { Metadata } from "next";
import { MadeByHand, MaterialsBlock } from "@/components/sections";

export const metadata: Metadata = {
  title: "Materials",
  description: "Solid hardwood, organic latex, organic wool, coconut coir, organic linen and natural oils. If we can't make a piece from materials we trust, we don't make it.",
};

export default function MaterialsPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Materials</div>
        <h1 className="h1">Materials you&apos;d recognize.</h1>
        <p className="body">If we can&apos;t make a piece from materials we trust, we don&apos;t make it.</p>
      </section>
      <section className="sec linen">
        <div className="wrap"><MaterialsBlock heading={false} /></div>
      </section>
      <MadeByHand />
    </main>
  );
}
