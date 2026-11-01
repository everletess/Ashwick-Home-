import Link from "next/link";
import { Photo } from "@/components/photo";
import { Price, SaleTag } from "@/components/sale";
import { DOG_BED, NOOK, type DogBed } from "@/lib/dog-bed";
import { BUNDLE, SALE } from "@/lib/sale";

/** Homepage banner for the event, under the hero. Renders nothing when the sale is off. */
export function BlackFridayBanner() {
  if (!SALE.active) return null;
  return (
    <section className="bf-banner">
      <div className="bf-banner-in">
        <Link href={SALE.path} className="bf-banner-img" aria-label={`${SALE.name} at Ashwick`}>
          <Photo src="bf-banner" label="A terracotta Ashbury mattress, a boucle chair and a cream sofa on a rug in an autumn hillside landscape" sizes="(max-width: 960px) 100vw, 50vw" />
        </Link>
        <div className="bf-banner-t">
          <div className="eyebrow">{SALE.name} at Ashwick</div>
          <h2 className="h2">{SALE.percent}% off everything. Free white glove with the bundle.</h2>
          <p className="body">
            The whole collection, mattresses included. Pair an Ashbury with an Ashbury Dog Bed in the Best Friends Bundle and white glove delivery for the mattress is included, along with a Best Friends Bedding Set (two pillows and a Mattress Protector).
          </p>
          <div className="btns">
            <Link href={SALE.path} className="btn light">Shop {SALE.name}</Link>
            <Link href={BUNDLE.path} className="btn outline-light">The Best Friends Bundle</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A dog bed in the same card style as the furniture, with its sale price. */
export function DogBedCard({ bed, photo, alt, blurb }: { bed: DogBed; photo: Parameters<typeof Photo>[0]["src"]; alt: Parameters<typeof Photo>[0]["src"]; blurb: string }) {
  const from = Math.min(...bed.sizes.map((z) => z.price));
  return (
    <Link href={bed.path} className="card">
      <div className="card-img">
        <Photo src={photo} label={bed.title} fill sizes="(max-width: 620px) 100vw, (max-width: 1180px) 50vw, 460px" />
        {alt && <Photo src={alt} label="" className="alt" fill sizes="(max-width: 620px) 100vw, (max-width: 1180px) 50vw, 460px" />}
        <SaleTag />
        <span className="card-cta">Shop now</span>
      </div>
      <div className="card-row">
        <span className="card-name">{bed.title}</span>
        <span className="card-price"><Price price={from} from /></span>
      </div>
      <p className="card-line">{blurb}</p>
    </Link>
  );
}

export const DOG_BED_CARDS = [
  { bed: DOG_BED, photo: "dog-bed-sorrel-room-golden", alt: "dog-bed-flint-room", blurb: "Flat and low, in the Ashbury's four colors." },
  { bed: NOOK, photo: "nook-olive-room", alt: "nook-oat", blurb: "A deep, curved bolster to curl up in." },
] as const;
