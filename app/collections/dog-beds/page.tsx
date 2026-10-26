import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/photo";
import { RatingLink } from "@/components/reviews";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import type { DogBed } from "@/lib/dog-bed";
import type { PhotoKey } from "@/lib/photos";
import type { ProductKey } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Dog Beds",
  description: "Organic dog beds, handmade to order in the USA: the Ashbury Dog Bed and The Nook.",
};

const BEDS: { bed: DogBed; key: ProductKey; photo: PhotoKey; alt: PhotoKey; blurb: string }[] = [
  { bed: DOG_BED, key: "ashbury-dog-bed", photo: "dog-bed-sorrel-room-golden", alt: "dog-bed-moss-room", blurb: "Flat and low, in the Ashbury's five colors." },
  { bed: NOOK, key: "nook", photo: "nook-olive-room", alt: "nook-oat", blurb: "A deep, curved bolster to curl up in." },
];

export default function DogBedsPage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Shop</div>
        <h1 className="h1">Dog Beds</h1>
        <p className="body">Handmade to order in the USA from organic cotton, Living Wool and cashmere. Ships within 3\u20134 days.</p>
      </section>
      <section className="wrap" style={{ paddingBottom: 140 }}>
        <div className="grid3 dogbeds-grid">
          {BEDS.map(({ bed, key, photo, alt, blurb }) => {
            const from = Math.min(...bed.sizes.map((z) => z.price));
            return (
              <div key={bed.id}>
                <Link href={bed.path} className="card">
                  <div className="card-img">
                    <Photo src={photo} label={bed.title} sizes="(max-width: 960px) 100vw, 33vw" />
                    <Photo src={alt} label="" className="alt" sizes="(max-width: 960px) 100vw, 33vw" />
                    <span className="card-cta">View</span>
                  </div>
                  <div className="card-row">
                    <span className="card-name">{bed.title}</span>
                    <span className="card-price">From ${from}</span>
                  </div>
                  <p className="body small" style={{ marginTop: 8 }}>{blurb}</p>
                </Link>
                <RatingLink product={key} />
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
