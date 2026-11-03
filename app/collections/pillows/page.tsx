import type { Metadata } from "next";
import { CollectionTabs } from "@/components/collection-tabs";
import { CatalogCard } from "@/components/catalog-card";
import type { CatalogItem } from "@/lib/catalog";
import { PillowCompare, PillowHelper } from "@/components/pillow-compare";
import { PILLOW_PATH, PILLOW_STANDALONE_FILLS, pillowFromPrice } from "@/lib/pillow";

export const metadata: Metadata = {
  title: "Pillows | The Ashwick Pillow",
  description:
    "Three organic bed pillows handmade in the USA: organic Living Wool with latex, organic Living Wool with horsehair, or 100% organic cotton. Removable organic cotton cover in four colors. Fast, free delivery.",
  alternates: { canonical: PILLOW_PATH },
};

const PHOTO = {
  "living-wool-latex": ["pillow-fill-latex", "pillow-fleece"],
  "living-wool-horse-hair": ["pillow-fill-horsehair", "pillow-sorrel"],
  "organic-cotton": ["pillow-fill-cotton", "pillow-flax"],
} as const;

export default function PillowsPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Shop</div>
        <h1 className="h1">Pillows</h1>
        <p className="body">Three fills, one pillow. Handmade to order in the USA, with a removable organic cotton cover in Fleece, Flint, Flax or Sorrel. Fast, free delivery, shipping within 1–2 business days.</p>
      </section>
      <CollectionTabs current="pillows" />
      <section className="wrap" style={{ paddingBottom: 140 }}>
        <div className="cc-grid cc-grid-3">
          {PILLOW_STANDALONE_FILLS.map((f, i) => {
            const [photo, hover] = PHOTO[f.id as keyof typeof PHOTO];
            const item: CatalogItem = { id: f.id, name: f.label, href: f.path, section: "sleep", group: "pillows", price: pillowFromPrice(f.id), from: true, photo, hover, fast: true };
            return <CatalogCard key={f.id} item={item} priority={i === 0} />;
          })}
        </div>
        <PillowHelper />
        <PillowCompare />
      </section>
    </main>
  );
}
