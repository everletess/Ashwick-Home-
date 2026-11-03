import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { Price, SaleTag } from "@/components/sale";
import { PillowCompare, PillowHelper } from "@/components/pillow-compare";
import { PILLOW_COMPARE, PILLOW_PATH, PILLOW_STANDALONE_FILLS } from "@/lib/pillow";

export const metadata: Metadata = {
  title: "Pillows | The Ashwick Pillow",
  description:
    "Three organic bed pillows handmade in the USA: organic Living Wool with latex, organic Living Wool with horsehair, or 100% organic cotton. Removable organic cotton cover in four colors. Fast, free delivery.",
  alternates: { canonical: PILLOW_PATH },
};

const PHOTO = {
  "living-wool-latex": ["pillow-fleece", "pillow-covers"],
  "living-wool-horse-hair": ["pillow-sorrel", "pillow-covers"],
  "organic-cotton": ["pillow-flax", "pillow-covers"],
} as const;

export default function PillowsPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Shop</div>
        <h1 className="h1">Pillows</h1>
        <p className="body">Three fills, one pillow. Handmade to order in the USA, with a removable organic cotton cover in Fleece, Flint, Flax or Sorrel. Fast, free delivery, shipping within 1–2 business days.</p>
      </section>
      <section className="wrap pillows-hero">
        <div className="pillows-hero-grid">
          <div className="pillows-hero-img"><Photo src="pillow-stack-ledge" label="Four pillows stacked on a travertine ledge in Fleece, Flax, Sorrel and Flint, beside a bowl of raw fill" fill sizes="(max-width: 960px) 100vw, 640px" preload /></div>
          <div className="pillows-hero-img"><Photo src="pillow-stack-meadow" label="Four pillows stacked in a sunlit meadow in Fleece, Flax, Sorrel and Flint" fill sizes="(max-width: 960px) 100vw, 640px" /></div>
        </div>
      </section>
      <section className="wrap" style={{ paddingBottom: 140 }}>
        <div className="grid3 pillows-grid coll-grid">
          {PILLOW_STANDALONE_FILLS.map((f) => {
            const [a, b] = PHOTO[f.id as keyof typeof PHOTO];
            return (
              <Link key={f.id} href={f.path} className="card">
                <div className="card-img">
                  <Photo src={a} label={`${f.label} pillow`} sizes="(max-width: 960px) 100vw, 33vw" preload />
                  <Photo src={b} label="" className="alt" sizes="(max-width: 960px) 100vw, 33vw" />
                  <SaleTag />
                  <span className="card-cta">View</span>
                </div>
                <div className="card-row">
                  <span className="card-name">{f.label}</span>
                  <span className="card-price"><Price price={f.price} from /></span>
                </div>
                <p className="body small" style={{ marginTop: 8 }}>{PILLOW_COMPARE[f.id].fill}. {PILLOW_COMPARE[f.id].feel}.</p>
              </Link>
            );
          })}
        </div>
        <PillowHelper />
        <PillowCompare />
      </section>
    </main>
  );
}
