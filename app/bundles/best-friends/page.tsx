import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BundleBuilder } from "@/components/bundle-view";
import { SALE, BUNDLE } from "@/lib/sale";

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
      <BundleBuilder />
    </main>
  );
}
