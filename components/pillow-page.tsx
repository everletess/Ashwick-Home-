import type { Metadata } from "next";
import { PillowView } from "@/components/pillow-view";
import { CompleteTheBed } from "@/components/home-extras";
import { PILLOW_PRICES, PILLOW_STANDALONE_FILLS } from "@/lib/pillow";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashwickhome.com";
const fillOf = (id: string) => PILLOW_STANDALONE_FILLS.find((f) => f.id === id)!;

export function pillowMetadata(id: string): Metadata {
  const f = fillOf(id);
  return {
    title: `${f.label} Pillow | The Ashwick Pillow`,
    description: `${f.story} Handmade in the USA, with a removable organic cotton cover in four colors. Fast, free delivery.`,
    alternates: { canonical: f.path },
  };
}

export function PillowProductPage({ id }: { id: string }) {
  const f = fillOf(id);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `The Ashwick Pillow, ${f.label}`,
    description: f.story,
    brand: { "@type": "Brand", name: "Ashwick Home" },
    url: `${BASE}${f.path}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...Object.values(PILLOW_PRICES[id])),
      highPrice: Math.max(...Object.values(PILLOW_PRICES[id])),
      offerCount: 3,
      availability: "https://schema.org/InStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "USD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
        deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" } },
      },
    },
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PillowView fillId={id} />
      <CompleteTheBed skip="pillow" />
    </main>
  );
}
