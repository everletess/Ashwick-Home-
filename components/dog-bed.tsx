import Link from "next/link";
import { Photo } from "@/components/photo";
import { DOG_BED, DOG_BED_PATH, NOOK } from "@/lib/dog-bed";
import { fmt } from "@/lib/products";

const D = DOG_BED;

/** Home page: "Introducing dog beds", the Ashbury and the Nook side by side, each linking to its page. */
export function DogBedFeature() {
  const beds = [
    { bed: D, photo: D.editorial[0], line: "Tufted, in the Ashbury's four colors." },
    { bed: NOOK, photo: NOOK.editorial[0], line: "A curved bolster to curl up in." },
  ];
  return (
    <section className="sec dog-feature">
      <div className="wrap">
        <div className="m-feature-t dog-feature-head">
          <div className="m-feature-new"><span>New</span>Introducing dog beds</div>
          <h2 className="h2">The Ashbury and the Nook.</h2>
          <p className="m-feature-tag">{D.tagline}</p>
        </div>
        <div className="dog-pair">
          {beds.map(({ bed, photo, line }) => (
            <Link key={bed.id} href={bed.path} className="dog-pair-card">
              <div className="dog-pair-img"><Photo src={photo.photo} label={photo.alt} sizes="(max-width: 960px) 100vw, 50vw" /></div>
              <p className="dog-pair-name">{bed.title}{bed.comingSoon && <span className="dog-pair-soon">Coming soon</span>}</p>
              <p className="body small">{line}</p>
              <p className="body small">From {fmt(Math.min(...bed.sizes.map((z) => z.price)))}</p>
              <span className="ulink">{bed.comingSoon ? "Take a look" : "Shop now"}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Mattress page, under the gallery: a teaser of the matching dog beds. */
export function DogBedTeaser() {
  return (
    <Link href={DOG_BED_PATH} className="dog-teaser">
      <div className="dog-teaser-imgs">
        {D.editorial.map(({ photo, alt }) => (
          <div className="dog-teaser-img" key={photo}><Photo src={photo} label={alt} sizes="(max-width: 640px) 50vw, 300px" /></div>
        ))}
      </div>
      <div className="dog-teaser-t">
        <div className="eyebrow">New · For the whole family</div>
        <p className="dog-teaser-h">{D.tagline}</p>
        <p className="body small">Matching organic dog beds, made to sit beside the Ashbury.</p>
        <span className="ulink">Meet the dog beds</span>
      </div>
    </Link>
  );
}
