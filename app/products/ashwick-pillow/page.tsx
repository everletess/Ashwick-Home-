import type { Metadata } from "next";
import { PillowView } from "@/components/pillow-view";
import { PILLOW_PATH } from "@/lib/pillow";

export const metadata: Metadata = {
  title: "The Ashwick Pillow",
  description: "The Ashwick Pillow in four fills and three sizes, handmade, with a removable cover in a mattress color. From Ashwick Home.",
  alternates: { canonical: PILLOW_PATH },
  // Not launched: out of search, not in the sitemap or navigation until the owner approves.
  robots: { index: false, follow: false },
};

export default function PillowPage() {
  return (
    <main>
      <PillowView />
    </main>
  );
}
