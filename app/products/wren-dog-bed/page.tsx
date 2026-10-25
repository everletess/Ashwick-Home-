import type { Metadata } from "next";
import Link from "next/link";
import { DogBedView } from "@/components/dog-bed-view";
import { DOG_BED, WREN } from "@/lib/dog-bed";

export const metadata: Metadata = {
  title: WREN.title,
  description: `${WREN.soonLede} From Ashwick Home.`,
  // Out of search until it launches.
  robots: WREN.comingSoon ? { index: false, follow: true } : undefined,
};

export default function WrenPage() {
  return (
    <main>
      <DogBedView bed={WREN}>
        <Link href={DOG_BED.path} className="ulink">Shop {DOG_BED.title.replace(/^The /, "the ")}</Link>
      </DogBedView>
    </main>
  );
}
