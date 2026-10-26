import type { Metadata } from "next";
import Link from "next/link";
import { Reviews } from "@/components/reviews";
import { DogBedView } from "@/components/dog-bed-view";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { PHOTOS } from "@/lib/photos";
import { abs } from "@/lib/mattress-feed";
import { reviewsFor } from "@/lib/reviews";

/** Product markup for Google. Ratings and reviews are included only when real reviews exist. */
function productJsonLd() {
  const { items, count, average } = reviewsFor("nook");
  const prices = NOOK.sizes.map((z) => z.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: NOOK.title,
    description: NOOK.lede,
    brand: { "@type": "Brand", name: "Ashwick Home" },
    url: abs(NOOK.path),
    image: NOOK.colors.flatMap((c) => c.photos).map((k) => abs(PHOTOS[k].src)),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: NOOK.sizes.length * NOOK.colors.length,
      availability: "https://schema.org/InStock",
      url: abs(NOOK.path),
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

export const metadata: Metadata = {
  title: NOOK.title,
  description: `${NOOK.soonLede} From Ashwick Home.`,
  // Out of search until it launches.
  robots: NOOK.comingSoon ? { index: false, follow: true } : undefined,
};

export default function NookPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd()).replace(/</g, "\\u003c") }} />
      <DogBedView bed={NOOK}>
        <Link href={DOG_BED.path} className="ulink">Shop {DOG_BED.title.replace(/^The /, "the ")}</Link>
      </DogBedView>
      <Reviews product="nook" name="Nook" />
    </main>
  );
}
