import type { Metadata } from "next";
import { PillowView } from "@/components/pillow-view";
import { PILLOW_PATH, PILLOW_STANDALONE_FILLS } from "@/lib/pillow";

export const metadata: Metadata = {
  title: "The Ashwick Pillow: organic bed pillows in color",
  description:
    "Organic bed pillows handmade in the USA, in three fills: organic Living Wool with latex, organic Living Wool with horsehair, or 100% organic cotton. Removable organic cotton cover in four colors.",
  alternates: { canonical: PILLOW_PATH },
};

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashwickhome.com";

function jsonLd() {
  const prices = PILLOW_STANDALONE_FILLS.map((f) => f.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "The Ashwick Pillow",
    description: "A handmade organic bed pillow in three fills, with a removable organic cotton cover in four colors.",
    brand: { "@type": "Brand", name: "Ashwick Home" },
    url: `${BASE}${PILLOW_PATH}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      availability: "https://schema.org/InStock",
    },
  };
}

export default function PillowPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <PillowView />
    </main>
  );
}
