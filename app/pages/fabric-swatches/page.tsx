import type { Metadata } from "next";
import { Suspense } from "react";
import { SwatchOrder } from "@/components/swatch-order";
import { FABRIC_LIBRARY } from "@/lib/fabric-library";
import { SWATCH_MAX } from "@/lib/products";

export const metadata: Metadata = {
  alternates: { canonical: "/pages/fabric-swatches" },
  title: "Fabrics and free swatches",
  description: "Every fabric we make with, from Irish Linen to the Ashbury's organic cotton twill. Order up to four free swatches.",
};


export default function SwatchesPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Our fabrics</div>
        <h1 className="h1">Feel the fabrics first.</h1>
        <p className="body">Swatches are free. Choose up to {SWATCH_MAX} and tell us where to send them.</p>
        <nav className="fl-jump" aria-label="Fabrics">
          {FABRIC_LIBRARY.map((F) => <a key={F.id} href={"#" + F.id}>{F.name}</a>)}
        </nav>
      </section>
      <section className="wrap" style={{ paddingBottom: 140, maxWidth: 1000 }}>
        <Suspense>
          <SwatchOrder />
        </Suspense>
      </section>
    </main>
  );
}
