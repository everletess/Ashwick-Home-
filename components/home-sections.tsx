import Link from "next/link";
import { NewBadge } from "@/components/bf-push";
import { Photo } from "@/components/photo";
import { CatalogCard } from "@/components/catalog-card";
import { homeRows, type CatalogItem } from "@/lib/catalog";
import { DOG_BED } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { PILLOW_PATH } from "@/lib/pillow";
import { getProduct } from "@/lib/products";
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
    ...(SALE.active ? [{ name: "Sleep Suite", href: SLEEP_SUITE.path, photo: "mattress-room-fleece" as PhotoKey, alt: "The Ashbury in Fleece on a light oak bed with two pillows" }] : []),
    { name: "The Ashbury", href: MATTRESS_PATH, photo: "mattress-room-flint", alt: "The Ashbury mattress in Flint on a light oak bed in a sunlit bedroom" },
    { name: "Pillows", href: PILLOW_PATH, photo: "pillow-covers", alt: "Two cream pillows on a travertine ledge beside a stack of removable covers in Sorrel, Fleece, Flint and Flax" },
    { name: "Dog Beds", href: "/collections/dog-beds", photo: "dog-bed-sorrel-card", alt: "The Ashbury Dog Bed in Sorrel" },
    { name: "Sofas", href: "/collections/sofas", photo: first("marlowe"), alt: "The Marlowe sofa" },
    { name: "Chairs", href: "/collections/chairs", photo: first("pembroke"), alt: "The Pembroke chair" },
    ...(SALE.active ? [{ name: "Gifts under $300", href: SALE.path + "#gifts", photo: "pillow-stack-ledge" as PhotoKey, alt: "A stack of Ashwick pillows on a stone ledge" }] : [{ name: "Bespoke", href: "/pages/bespoke", photo: "bespoke-hero" as PhotoKey, alt: "Ashwick Bespoke" }]),
  ];
  return (
    <section className="home-cats" aria-label="Shop by category">
      <div className="wrap">
        <div className="eyebrow">Shop</div>
      </div>
      <ul className="rail home-cats-rail">
        {tiles.map((t) => (
          <li key={t.name}>
            <Link href={t.href} className="home-cat">
              <span className="home-cat-img"><Photo src={t.photo} label={t.alt} fill sizes="(max-width: 640px) 44vw, (max-width: 1180px) 22vw, 220px" /></span>
              <span className="home-cat-name">{t.name}{t.name === "Pillows" && <NewBadge />}</span>
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

function Row({ eyebrow, title, items, href, cta }: { eyebrow: string; title: string; items: CatalogItem[]; href: string; cta: string }) {
  return (
    <section className="sec home-row">
      <div className="wrap">
        <div className="split-head">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h2 className="h2">{title}</h2>
          </div>
          <Link href={href} className="ulink">{cta}</Link>
        </div>
        <div className="cc-grid">
          {items.map((it) => <CatalogCard key={it.id} item={it} />)}
        </div>
      </div>
    </section>
  );
}

/** Two rows, grouped by room: the bedroom first (what we're selling now), then the living room. */
export function Favorites() {
  const { bedroom, living } = homeRows();
  return (
    <>
      <Row eyebrow="Sleep" title="For the bedroom" items={bedroom} href="/collections/bedroom" cta="Shop bedroom →" />
      <Row eyebrow="Living" title="For the living room" items={living} href="/collections/sofas" cta="Shop living room →" />
    </>
  );
}
