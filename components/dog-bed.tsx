import Link from "next/link";
import { Photo } from "@/components/photo";
import { DOG_BED, DOG_BED_PATH } from "@/lib/dog-bed";

const D = DOG_BED;

/** Home page: "Now introducing" the dog bed collection, mirroring the Ashbury feature. */
export function DogBedFeature() {
  return (
    <section className="sec dog-feature">
      <div className="wrap m-feature-in dog-feature-in">
        <div className="m-feature-t">
          <div className="m-feature-new"><span>New</span>Now introducing</div>
          <h2 className="h2">{D.collection}</h2>
          <p className="m-feature-tag">{D.tagline}</p>
          <p className="body">A bed for the newest member of the family, made to match the Ashbury.</p>
          <div className="btns">
            <Link href={DOG_BED_PATH} className="btn">Shop the dog beds</Link>
          </div>
        </div>
        <Link href={DOG_BED_PATH} className="dog-feature-img" aria-label={D.collection}>
          {/* The second fades in over the first and back (CSS only); with reduced motion only the first shows. */}
          {D.editorial.map(({ photo, alt }, i) => (
            <Photo key={photo} src={photo} label={alt} className={i ? "dog-fade" : undefined} sizes="(max-width: 960px) 100vw, 50vw" />
          ))}
        </Link>
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
