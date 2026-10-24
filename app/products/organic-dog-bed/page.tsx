import type { Metadata } from "next";
import Link from "next/link";
import { DogBedView } from "@/components/dog-bed-view";
import { DOG_BED } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";

const D = DOG_BED;

export const metadata: Metadata = {
  title: D.collection,
  description: `${D.tagline} Organic dog beds from Ashwick Home, made to match the Ashbury.`,
  // Out of search until it launches.
  robots: D.comingSoon ? { index: false, follow: true } : undefined,
};

// Prices, sizes, materials and buying come at launch.
export default function DogBedPage() {
  return (
    <main>
      <DogBedView>
        <Link href={MATTRESS_PATH} className="ulink">Shop the {MATTRESS.shortName}</Link>
      </DogBedView>
    </main>
  );
}
