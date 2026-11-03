import Link from "next/link";
import { Photo } from "@/components/photo";
import { Price, SaleTag } from "@/components/sale";
import { Stars } from "@/components/reviews";
import { DOG_BED } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { pillowFromPrice } from "@/lib/pillow";
import { PILLOW_PATH } from "@/lib/pillow";
import { cardPrice, getProduct } from "@/lib/products";
import { reviewsFor, type ProductKey } from "@/lib/reviews";
import { BUNDLE, BUNDLE_CONFIG, BUNDLE_HERO, SALE, SLEEP_SUITE, bundlePrice, salePrice } from "@/lib/sale";
import { fmt } from "@/lib/products";
import type { PhotoKey } from "@/lib/photos";

const first = (id: string): PhotoKey => {
  const p = getProduct(id)!;
  return (p.cardPhoto ?? p.photos[0]) as PhotoKey;
};

/** Shop by category: a swipeable row of 4:5 tiles on a phone (a peek of the next one), a row of six on desktop. */
export function CategoryRail() {
  const tiles: { name: string; href: string; photo: PhotoKey; alt: string }[] = [
    { name: "The Ashbury", href: MATTRESS_PATH, photo: "mattress-mocha-room", alt: "The Ashbury mattress in Sorrel in a sunlit bedroom" },
    { name: "Pillows", href: PILLOW_PATH, photo: "pillow-sorrel", alt: "Two Sorrel pillows stacked on a travertine ledge" },
    { name: "Dog Beds", href: "/collections/dog-beds", photo: "dog-bed-sorrel-room-golden", alt: "A Sorrel Ashbury dog bed with a golden dog resting on it" },
    { name: "Sofas", href: "/collections/sofas", photo: first("marlowe"), alt: "The Marlowe sofa" },
    { name: "Chairs", href: "/collections/chairs", photo: first("pembroke"), alt: "The Pembroke chair" },
    { name: "Bespoke", href: "/pages/bespoke", photo: "bespoke-hero", alt: "Ashwick Bespoke" },
  ];
  return (
    <section className="home-cats" aria-label="Shop by category">
      <div className="wrap">
        <div className="eyebrow">Shop by category</div>
      </div>
      <ul className="rail home-cats-rail">
        {tiles.map((t) => (
          <li key={t.name}>
            <Link href={t.href} className="home-cat">
              <span className="home-cat-img"><Photo src={t.photo} label={t.alt} fill sizes="(max-width: 640px) 44vw, (max-width: 1180px) 22vw, 220px" /></span>
              <span className="home-cat-name">{t.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Black Friday: one compact band with both bundles as swipeable cards. Renders nothing when the sale ends. */
export function BlackFridayBand() {
  if (!SALE.active) return null;
  const m0 = MATTRESS.sizes[0].price;
  const bed = BUNDLE_CONFIG.beddingSet.price;
  const bfList = m0 + DOG_BED.sizes[0].price + bed;
  const bfNow = bundlePrice(m0) + bundlePrice(DOG_BED.sizes[0].price) + bundlePrice(bed);
  const ssList = m0 + 200;
  const ssNow = salePrice(ssList);
  const cards = [
    { href: BUNDLE.path, photo: BUNDLE_HERO.photo, alt: BUNDLE_HERO.alt, title: BUNDLE.title, desc: "Ashbury, Ashbury Dog Bed and a bedding set.", was: bfList, now: bfNow },
    { href: SLEEP_SUITE.path, photo: "sleep-suite-flint" as PhotoKey, alt: "The Complete Sleep Suite: an Ashbury mattress in Flint with matching pillows and a folded bedding set", title: SLEEP_SUITE.name, desc: "Ashbury and a bedding set.", was: ssList, now: ssNow },
  ];
  return (
    <section className="home-bf">
      <div className="wrap home-bf-in">
        <div className="home-bf-head">
          <div className="eyebrow light">{SALE.name} at Ashwick</div>
          <h2 className="h2">{SALE.percent}% off everything.</h2>
          <p className="home-bf-sub">No code needed. Free white glove delivery on the mattress in both bundles.</p>
          <Link href={SALE.path} className="btn light">Shop {SALE.name}</Link>
        </div>
        <ul className="rail home-bf-rail">
          {cards.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="home-bf-card">
                <span className="home-bf-img"><Photo src={c.photo} label={c.alt} fill sizes="(max-width: 640px) 78vw, 360px" /><span className="sale-tag">{SALE.percent}% off</span></span>
                <span className="home-bf-t">{c.title}</span>
                <span className="home-bf-d">{c.desc}</span>
                <span className="home-bf-p">From <s className="price-was">{fmt(c.was)}</s> <strong className="price-now">{fmt(c.now)}</strong></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type Fav = { name: string; href: string; photo: PhotoKey; alt: PhotoKey; price: number; from: boolean; review?: ProductKey };

/** The collection as a two-column grid of no more than six products, each with image, name, price and stars (stars only where real reviews exist). */
export function Favorites() {
  const sofa = getProduct("marlowe")!, cots = getProduct("cotswold")!, chair = getProduct("pembroke")!;
  const items: Fav[] = [
    { name: MATTRESS.title, href: MATTRESS_PATH, photo: "mattress-mocha-room", alt: "mattress-studio-mocha", price: Math.min(...MATTRESS.sizes.map((s) => s.price)), from: true, review: "ashbury" },
    { name: "The Ashwick Pillow", href: PILLOW_PATH, photo: "pillow-fleece", alt: "pillow-covers", price: pillowFromPrice("organic-cotton"), from: true },
    { name: DOG_BED.title, href: DOG_BED.path, photo: "dog-bed-sorrel-room-golden", alt: "dog-bed-flint-room", price: Math.min(...DOG_BED.sizes.map((s) => s.price)), from: true, review: "ashbury-dog-bed" },
    { name: sofa.name, href: "/products/" + sofa.id, photo: first(sofa.id), alt: (sofa.photos[1] ?? sofa.photos[0]) as PhotoKey, price: cardPrice(sofa).price, from: !!cardPrice(sofa).from },
    { name: cots.name, href: "/products/" + cots.id, photo: first(cots.id), alt: (cots.photos[1] ?? cots.photos[0]) as PhotoKey, price: cardPrice(cots).price, from: !!cardPrice(cots).from },
    { name: chair.name, href: "/products/" + chair.id, photo: first(chair.id), alt: (chair.photos[1] ?? chair.photos[0]) as PhotoKey, price: cardPrice(chair).price, from: !!cardPrice(chair).from },
  ];
  return (
    <section className="sec home-fav">
      <div className="wrap">
        <div className="split-head">
          <div>
            <div className="eyebrow">The collection</div>
            <h2 className="h2">Made one at a time.</h2>
          </div>
          <Link href="/collections/all" className="ulink">Shop all →</Link>
        </div>
        <div className="coll-grid home-fav-grid">
          {items.map((it) => {
            const rv = it.review ? reviewsFor(it.review) : null;
            return (
              <Link key={it.name} href={it.href} className="card">
                <div className="card-img">
                  <Photo src={it.photo} label={it.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 440px" />
                  <Photo src={it.alt} label="" className="alt" fill sizes="(max-width: 640px) 50vw, 33vw" />
                  <SaleTag />
                </div>
                <div className="card-row">
                  <span className="card-name">{it.name}</span>
                  <span className="card-price"><Price price={it.price} from={it.from} /></span>
                </div>
                {rv && rv.count > 0 && (
                  <div className="card-stars"><Stars rating={rv.average} /><span>{rv.average.toFixed(1)} · {rv.count}</span></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
