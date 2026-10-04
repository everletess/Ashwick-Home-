import type { Metadata } from "next";
import { Suspense } from "react";
import { SwatchOrder } from "@/components/swatch-order";
import { PRODUCTS, SWATCH_PRICE, fmt, type FabricId } from "@/lib/products";

export const metadata: Metadata = {
  title: "Fabric swatches",
  description: "Order swatches of our fabrics before you choose.",
};

// Every fabric offered on a piece currently on the site, in first-seen order.
const FABRIC_IDS = [...new Set(PRODUCTS.flatMap((p) => p.fabrics))] as FabricId[];

export default function SwatchesPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Fabric swatches</div>
        <h1 className="h1">Feel the fabrics first.</h1>
        <p className="body">Swatches are {fmt(SWATCH_PRICE)} each. Choose up to eight and tell us where to send them; we&apos;ll email you a payment link before they go out.</p>
      </section>
      <section className="wrap" style={{ paddingBottom: 140, maxWidth: 1000 }}>
        <Suspense>
          <SwatchOrder fabrics={FABRIC_IDS} />
        </Suspense>
      </section>
    </main>
  );
}
