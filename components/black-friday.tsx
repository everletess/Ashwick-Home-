import Link from "next/link";
import { Photo } from "@/components/photo";
import { Price, SaleTag } from "@/components/sale";
import { DOG_BED, NOOK, type DogBed } from "@/lib/dog-bed";
import { Stars } from "@/components/reviews";
import { fmt } from "@/lib/products";
import { BUNDLE, SALE, salePrice } from "@/lib/sale";

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
          <h2 className="h2">{SALE.percent}% off everything.</h2>
          <p className="body">No code needed. Two bundles with free white glove delivery for the mattress.</p>
          <div className="btns">
            <Link href={SALE.path} className="btn light">Shop {SALE.name}</Link>
            <Link href={SALE.path + "#bundles"} className="btn outline-light">See the bundles</Link>
          </div>
          <p className="bf-banner-links"><Link href={BUNDLE.path}>Best Friends Bundle</Link> · <Link href={SLEEP_SUITE_PATH}>Complete Sleep Suite</Link></p>
        </div>
      </div>
    </section>
  );
}

export const SLEEP_SUITE_PATH = "/bundles/sleep-suite";

/** Compact bundle card: thumbnail left, copy right. */
export function BundleTile({ href, photo, alt, title, desc, was, now }: { href: string; photo: Parameters<typeof Photo>[0]["src"]; alt: string; title: string; desc: string; was: number; now: number }) {
  return (
    <Link href={href} className="bf-bun">
      <div className="bf-bun-img">
        <Photo src={photo} label={alt} fill sizes="(max-width: 620px) 40vw, 260px" />
        <span className="sale-tag">{SALE.percent}% off</span>
      </div>
      <div className="bf-bun-t">
        <h3 className="bf-bun-h">{title}</h3>
        <p className="bf-bun-d">{desc}</p>
        <div className="bf-bun-p">From <s className="price-was">{fmt(was)}</s> <strong className="price-now">{fmt(now)}</strong></div>
        <span className="btn bf-bun-cta">Shop the bundle</span>
      </div>
    </Link>
  );
}

/** Small square product tile for the dense sale grid. */
export function MiniCard({ href, photo, name, price, from }: { href: string; photo: Parameters<typeof Photo>[0]["src"]; name: string; price: number; from?: boolean }) {
  return (
    <Link href={href} className="bf-mini">
      <div className="bf-mini-img">
        <Photo src={photo} label={name} fill sizes="(max-width: 620px) 50vw, (max-width: 1180px) 33vw, 300px" />
        <span className="sale-tag">{SALE.percent}% off</span>
      </div>
      <div className="bf-mini-name">{name}</div>
      <div className="bf-mini-price">{from ? "From " : ""}<s className="price-was">{fmt(price)}</s> <span className="price-now">{fmt(salePrice(price))}</span></div>
    </Link>
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

/** Compact mobile product card for the swipe rows. Stars only where real reviews exist. */
export function SwipeCard({ href, photo, name, price, from, rating, count, wide }: { href: string; photo: Parameters<typeof Photo>[0]["src"]; name: string; price: number; from?: boolean; rating?: number; count?: number; wide?: boolean }) {
  const now = salePrice(price);
  return (
    <Link href={href} className={"bf-sw" + (wide ? " wide" : "")}>
      <div className="bf-sw-img"><Photo src={photo} label={name} fill sizes="(max-width: 760px) 46vw, 300px" /></div>
      <div className="bf-sw-name">{name}</div>
      {count ? <div className="bf-sw-rt"><Stars rating={rating ?? 0} /> <span>{rating?.toFixed(1)} ({count})</span></div> : null}
      <div className="bf-sw-p">{from && <span className="bf-from">From </span>}<strong>{fmt(now)}</strong> <s>{fmt(price)}</s></div>
      <div className="bf-save">Save {fmt(Math.round((price - now) * 100) / 100)}</div>
    </Link>
  );
}

/** Mobile bundle card: sale price big, list struck through, bold dollar saving. */
export function BundleCard({ href, photo, alt, title, desc, was, now }: { href: string; photo: Parameters<typeof Photo>[0]["src"]; alt: string; title: string; desc: string; was: number; now: number }) {
  return (
    <Link href={href} className="bf-bc">
      <div className="bf-bc-img"><Photo src={photo} label={alt} fill sizes="(max-width: 760px) 80vw, 300px" /></div>
      <div className="bf-bc-t">
        <h3 className="bf-bc-h">{title}</h3>
        <p className="bf-bc-d">{desc}</p>
        <div className="bf-bc-p"><span className="bf-from">From </span><strong>{fmt(now)}</strong> <s>{fmt(was)}</s></div>
        <div className="bf-bc-save">You save {fmt(Math.round((was - now) * 100) / 100)}</div>
        <span className="btn bf-bc-cta">Shop the bundle</span>
      </div>
    </Link>
  );
}
