import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BundleTile, MiniCard, SLEEP_SUITE_PATH } from "@/components/black-friday";
import { Photo } from "@/components/photo";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { cardPrice, productsIn } from "@/lib/products";
import { BUNDLE, BUNDLE_CONFIG, BUNDLE_HERO, SALE, bundlePrice, salePrice } from "@/lib/sale";

export const metadata: Metadata = {
  title: "Black Friday at Ashwick: 20% off everything",
  description: "20% off the whole collection, mattresses included. Plus two bundles with free white glove delivery for the mattress: the Best Friends Bundle and the Complete Sleep Suite.",
  alternates: { canonical: SALE.path },
};

const minPrice = (sizes: { price: number }[]) => Math.min(...sizes.map((z) => z.price));

export default function BlackFridayPage() {
  if (!SALE.active) notFound();
  const m0 = MATTRESS.sizes[0].price;
  const bfList = m0 + DOG_BED.sizes[0].price + BUNDLE_CONFIG.beddingSet.price;
  const bfNow = bundlePrice(m0) + bundlePrice(DOG_BED.sizes[0].price) + bundlePrice(BUNDLE_CONFIG.beddingSet.price);
  const ssList = m0 + 200;
  const ssNow = salePrice(ssList);

  const items: { key: string; cat: string; href: string; photo: Parameters<typeof Photo>[0]["src"]; name: string; price: number; from?: boolean }[] = [
    { key: "mattress", cat: "mattress", href: MATTRESS_PATH, photo: "mattress-mocha-room", name: MATTRESS.title, price: minPrice(MATTRESS.sizes), from: true },
    { key: "dog", cat: "dog-beds", href: DOG_BED.path, photo: "dog-bed-sorrel-room-golden", name: DOG_BED.title, price: minPrice(DOG_BED.sizes), from: true },
    { key: "nook", cat: "dog-beds", href: NOOK.path, photo: "nook-olive-room", name: NOOK.title, price: minPrice(NOOK.sizes), from: true },
    ...productsIn("sofas").map((p) => ({ key: p.id, cat: "sofas", href: "/products/" + p.id, photo: p.cardPhoto ?? p.photos[0], name: p.name, price: cardPrice(p).price, from: cardPrice(p).from })),
    ...productsIn("chairs").map((p) => ({ key: p.id, cat: "chairs", href: "/products/" + p.id, photo: p.cardPhoto ?? p.photos[0], name: p.name, price: cardPrice(p).price, from: cardPrice(p).from })),
  ];
  const chips = [["all", "All"], ["mattress", "Mattress"], ["dog-beds", "Dog beds"], ["sofas", "Sofas"], ["chairs", "Chairs and ottoman"]];

  return (
    <main className="bf-page">
      <section className="bf-hero">
        <Photo src="bf-banner" label="A terracotta Ashbury mattress, a boucle chair and a cream sofa on a rug in an autumn hillside landscape" fill preload />
        <div className="bf-hero-scrim"></div>
        <div className="bf-hero-txt">
          <h1 className="h1">{SALE.percent}% off everything.</h1>
          <p className="hero-body">No code needed. Prices below already show the discount.</p>
          <div className="btns">
            <a href="#shop" className="btn light">Shop the sale</a>
            <a href="#bundles" className="btn outline-light">See the bundles</a>
          </div>
        </div>
      </section>

      <section className="bf-sec" id="bundles">
        <div className="wrap">
          <h2 className="bf-h">Black Friday bundles</h2>
          <div className="bf-bundles">
            <BundleTile href={BUNDLE.path} photo={BUNDLE_HERO.photo} alt={BUNDLE_HERO.alt} title={BUNDLE.title}
              desc="Ashbury mattress + Ashbury Dog Bed + bedding set (two pillows and a Mattress Protector). Free white glove delivery for the mattress." was={bfList} now={bfNow} />
            <BundleTile href={SLEEP_SUITE_PATH} photo="sleep-suite-hero" alt="The Complete Sleep Suite: an Ashbury mattress with a bedding set"
              title="The Complete Sleep Suite" desc="Ashbury mattress + bedding set (two pillows and a Mattress Protector). Free white glove delivery for the mattress." was={ssList} now={ssNow} />
          </div>
        </div>
      </section>

      <section className="bf-sec" id="shop">
        <div className="wrap">
          <div className="bf-shop-head">
            <h2 className="bf-h">Shop everything {SALE.percent}% off</h2>
            <nav className="bf-chips" aria-label="Jump to a category">
              {chips.map(([id, label]) => <a key={id} href={id === "all" ? "#shop" : "#cat-" + id} className="bf-chip">{label}</a>)}
            </nav>
          </div>
          <div className="bf-grid">
            {items.map((it, i) => (
              <div key={it.key} className="bf-cell" id={i === 0 || items[i - 1].cat !== it.cat ? "cat-" + it.cat : undefined}>
                <MiniCard href={it.href} photo={it.photo} name={it.name} price={it.price} from={it.from} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bf-reassure">
        <div className="wrap">
          <ul className="bf-trust">
            <li>100-night trial</li>
            <li>Handmade in the USA</li>
            <li>No code needed</li>
            <li>Free white glove with a bundle</li>
          </ul>
          <p className="bf-fine">
            Discount applied automatically at checkout. White glove delivery is free for the mattress in a bundle; otherwise $200 per mattress and $750 per piece of furniture. Taxes calculated at checkout.{" "}
            <Link href="/collections/all">All products</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
