import type { Metadata } from "next";
import { Suspense } from "react";
import { SwatchOrder } from "@/components/swatch-order";
import { PRODUCTS, SWATCH_MAX, type FabricId } from "@/lib/products";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/fabric-swatches" },
  title: "Fabric swatches",
  description: "Order free swatches of our fabrics before you choose, up to four per order.",
};

// Every fabric offered on a piece currently on the site, in first-seen order.
const FABRIC_IDS = [...new Set(PRODUCTS.flatMap((p) => p.fabrics))] as FabricId[];

export default function SwatchesPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Fabric swatches</div>
        <h1 className="h1">Feel the fabrics first.</h1>
        <p className="body">Swatches are free. Choose up to {SWATCH_MAX} and tell us where to send them.</p>
      </section>
      <section className="wrap" style={{ paddingBottom: 140, maxWidth: 1000 }}>
        <Suspense>
          <SwatchOrder fabrics={FABRIC_IDS} />
        </Suspense>
      </section>
    </main>
  );
}
