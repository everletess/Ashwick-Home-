import type { Metadata } from "next";
import { CollectionTabs } from "@/components/collection-tabs";
import { CatalogCard } from "@/components/catalog-card";
import { itemsFor } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Dog Beds",
  description: "Organic dog beds, handmade to order in the USA: the Ashbury Dog Bed and The Nook.",
};

export default function DogBedsPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Shop</div>
        <h1 className="h1">Dog Beds</h1>
        <p className="body">Handmade to order in the USA from organic cotton, Living Wool and cashmere. Ships within 3–4 days.</p>
      </section>
      <CollectionTabs current="dog-beds" />
      <section className="wrap" style={{ paddingBottom: 140 }}>
        <div className="cc-grid cc-grid-3">
          {itemsFor("dog-beds").map((it, i) => <CatalogCard key={it.id} item={it} priority={i < 2} />)}
        </div>
      </section>
    </main>
  );
}
