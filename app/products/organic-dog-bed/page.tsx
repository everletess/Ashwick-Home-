import type { Metadata } from "next";
import Link from "next/link";
import { Reviews } from "@/components/reviews";
import { DogBedView } from "@/components/dog-bed-view";
import { DOG_BED } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { PHOTOS } from "@/lib/photos";
import { abs } from "@/lib/mattress-feed";
import { reviewsFor } from "@/lib/reviews";

const D = DOG_BED;

export const metadata: Metadata = {
  title: D.collection,
  description: `${D.tagline} Organic dog beds from Ashwick Home, made to match the Ashbury.`,
  // Out of search until it launches.
  robots: D.comingSoon ? { index: false, follow: true } : undefined,
};

/** Product markup for Google. Ratings and reviews are included only when real reviews exist. */
function productJsonLd() {
  const { items, count, average } = reviewsFor("ashbury-dog-bed");
  const prices = D.sizes.map((z) => z.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: D.title,
    description: D.lede,
    brand: { "@type": "Brand", name: "Ashwick Home" },
    url: abs(D.path),
    image: D.colors.map((c) => abs(PHOTOS[c.photos[0]].src)),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: D.sizes.length * D.colors.length,
      availability: "https://schema.org/InStock",
      url: abs(D.path),
    },
    ...(count
      ? {
          aggregateRating: { "@type": "AggregateRating", ratingValue: average, reviewCount: count, bestRating: 5, worstRating: 1 },
          review: items.map((r) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
            author: { "@type": "Person", name: r.author },
            ...(r.date ? { datePublished: r.date } : {}),
            reviewBody: r.body,
          })),
        }
      : {}),
  };
}

// Prices, sizes, materials and buying come at launch.
export default function DogBedPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd()).replace(/</g, "\\u003c") }} />
      <DogBedView>
        <Link href={MATTRESS_PATH} className="ulink">Shop the {MATTRESS.shortName}</Link>
      </DogBedView>
      <Reviews product="ashbury-dog-bed" name="Ashbury dog bed" />
    </main>
  );
}
