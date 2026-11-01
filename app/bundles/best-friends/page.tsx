import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BundleBuilder } from "@/components/bundle-view";
import { Photo } from "@/components/photo";
import { SALE, BUNDLE, BUNDLE_HERO } from "@/lib/sale";

export const metadata: Metadata = {
  title: "The Best Friends Bundle",
  description: "One Ashbury mattress and one Ashbury Dog Bed, chosen in the colors you like, with a Best Friends Bedding Set (two pillows and a Mattress Protector) and free white glove delivery for the mattress included.",
  alternates: { canonical: BUNDLE.path },
};

export default function BestFriendsPage() {
  if (!SALE.active) notFound();
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">{SALE.name} at Ashwick</div>
        <h1 className="h1">{BUNDLE.title}</h1>
        <p className="body">
          An Ashbury mattress for you and an Ashbury Dog Bed for the one who sleeps at the foot of it. Pick each in the colors you like. {SALE.percent}% off the bundle, free white glove delivery for the mattress, and a bedding set of two pillows and a Mattress Protector.
        </p>
      </section>
      {/* Hero slot: BUNDLE_HERO in lib/sale.ts. */}
      <section className="wrap bundle-hero" data-hero-final={BUNDLE_HERO.isFinal}>
        <div style={{ position: "relative", aspectRatio: "16 / 9", maxHeight: "min(60vh, max(45vw, 280px))", margin: "0 auto", overflow: "hidden", borderRadius: 4 }}>
          <Photo src={BUNDLE_HERO.photo} label={BUNDLE_HERO.alt} fill sizes="(max-width: 1280px) 100vw, 1200px" preload />
        </div>
      </section>
      <BundleBuilder />
    </main>
  );
}
