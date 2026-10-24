import type { Metadata } from "next";
import Link from "next/link";
import { DogBedNotify } from "@/components/dog-bed-notify";
import { Photo } from "@/components/photo";
import { DOG_BED } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";

const D = DOG_BED;

export const metadata: Metadata = {
  title: D.collection,
  description: `${D.tagline} Organic dog beds from Ashwick Home, made to match the Ashbury.`,
  // Out of search until it launches.
  robots: D.comingSoon ? { index: false, follow: true } : undefined,
};

// Layout is ready for launch; copy beyond the name and tagline, prices, sizes and photos are still to come.
export default function DogBedPage() {
  return (
    <main>
      <section className="pdp wrap">
        <div className="gal">
          <div className="gal-main"><div className="gal-photo"><Photo src={D.photos.hero} label="Dog bed" /></div></div>
          <div className="gal-thumbs dog-thumbs">
            {D.photos.gallery.map((src, i) => (
              <div className="dog-thumb" key={i}><Photo src={src} label="" sizes="84px" /></div>
            ))}
          </div>
        </div>
        <div className="info">
          <div className="eyebrow">{D.comingSoon ? "Coming soon" : "Dog bed · Made to order"}</div>
          <h1 className="pdp-name">{D.title}</h1>
          <div className="pdp-collection">{D.collection}</div>
          <p className="m-feature-tag dog-tag">{D.tagline}</p>
          <p className="body">A bed for the newest member of the family, made to match the {MATTRESS.shortName}.</p>
          {D.comingSoon && (
            <div className="dog-soon">
              <p className="body small">Launching soon. Sign up and we&apos;ll let you know the day it&apos;s here, with 15% off your first order.</p>
              <DogBedNotify />
            </div>
          )}
          <Link href={MATTRESS_PATH} className="ulink">Shop the {MATTRESS.shortName}</Link>
        </div>
      </section>
    </main>
  );
}
