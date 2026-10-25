import type { Metadata } from "next";
import Link from "next/link";
import { DogBedView } from "@/components/dog-bed-view";
import { DOG_BED, NOOK } from "@/lib/dog-bed";

export const metadata: Metadata = {
  title: NOOK.title,
  description: `${NOOK.soonLede} From Ashwick Home.`,
  // Out of search until it launches.
  robots: NOOK.comingSoon ? { index: false, follow: true } : undefined,
};

export default function NookPage() {
  return (
    <main>
      <DogBedView bed={NOOK}>
        <Link href={DOG_BED.path} className="ulink">Shop {DOG_BED.title.replace(/^The /, "the ")}</Link>
      </DogBedView>
    </main>
  );
}
