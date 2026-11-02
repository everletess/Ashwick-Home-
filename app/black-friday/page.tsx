import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BundleCard, BundleTile, MiniCard, SLEEP_SUITE_PATH, SwipeCard } from "@/components/black-friday";
import { BfStickyCta } from "@/components/bf-mobile";
import { Photo } from "@/components/photo";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { Stars } from "@/components/reviews";
import { cardPrice, fmt, productsIn } from "@/lib/products";
import { REVIEWS, reviewsFor } from "@/lib/reviews";
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

  const mFrom = salePrice(minPrice(MATTRESS.sizes));
  const rvAll = REVIEWS.filter((r) => ["ashbury", "ashbury-dog-bed", "nook"].includes(r.product));
  const rvCount = rvAll.length;
  const avg = Math.round((rvAll.reduce((a, r) => a + r.rating, 0) / rvCount) * 10) / 10;
  const quote = (product: "ashbury", frag: string) => {
    const r = reviewsFor(product).items.find((x) => x.body.includes(frag));
    if (!r) throw new Error("review quote not found: " + frag);
    return { t: frag + "\u2026", by: r.author };
  };
  const quotes = [
    quote("ashbury", "The Ashbury is not only gorgeous it\u2019s the most comfortable mattress I\u2019ve ever slept on"),
    quote("ashbury", "The Ashbury has been game changing in sleep, comfort, breathability and support"),
  ];
  quotes[1].t = "\u2026" + quotes[1].t;
  const rate = (key: string) => (key === "mattress" ? "ashbury" : key === "dog" ? "ashbury-dog-bed" : key === "nook" ? "nook" : null);
  const card = (it: (typeof items)[number]) => {
    const k = rate(it.key);
    const rv = k ? reviewsFor(k as "ashbury") : null;
    return <SwipeCard key={it.key} href={it.href} photo={it.photo} name={it.name} price={it.price} from={it.from} rating={rv?.average} count={rv?.count} />;
  };
  const gifts = items.filter((i) => i.cat === "dog-beds" && salePrice(i.price) < 300);
  const mchips = [["m-bundles", "All"], ["m-bundles", "Bundles"], ["m-gifts", "Gifts"], ["m-mattress", "Mattress"], ["m-sofas", "Sofas"], ["m-chairs", "Chairs"]];
  const trust: [React.ReactNode, string][] = [
    [<><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></>, "100-night trial"],
    [<><path d="M3 21h18M5 21V9l7-5 7 5v12M10 21v-6h4v6" /></>, "Handmade in the USA"],
    [<><rect x="2" y="7" width="12" height="9" /><path d="M14 10h4l3 3v3h-7M6 19.5a1.5 1.5 0 1 0 0 .01M17 19.5a1.5 1.5 0 1 0 0 .01" /></>, "Free white glove on bundles"],
    [<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>, "Lifetime limited warranty"],
  ];
  const faq: [string, string][] = [
    ["When will it ship?", "Mattresses and dog beds ship within 3\u20134 days of your order. Furniture as designed ships within 3\u20134 weeks; customized furniture within 8\u201312 weeks."],
    ["What is the return policy?", "Mattress: a 100-night trial, with a 30-night minimum before you request a return. Dog beds: 30 days from delivery. Furniture as designed: 14 days from delivery, unused, less return shipping and a 15% restocking fee. Customized furniture is final sale."],
    ["What does white glove delivery cost?", `$${BUNDLE_CONFIG.whiteGloveValue} per mattress and $750 per piece of furniture. It is free for the mattress in a bundle.`],
    ["Can I pay in installments?", "Yes. Shop Pay Installments is available at checkout, subject to approval."],
  ];

  return (
    <main className="bf-page">
      <section className="bf-hero">
        <Photo src="bf-banner" label="A terracotta Ashbury mattress, a boucle chair and a cream sofa on a rug in an autumn hillside landscape" fill preload />
        <div className="bf-hero-scrim"></div>
        <div className="bf-hero-txt bf-d">
          <h1 className="h1">{SALE.percent}% off everything.</h1>
          <p className="hero-body">No code needed. Prices below already show the discount.</p>
          <div className="btns">
            <a href="#shop" className="btn light">Shop the sale</a>
            <a href="#bundles" className="btn outline-light">See the bundles</a>
          </div>
        </div>
        <div className="bf-hero-txt bf-m">
          <h1 className="h1">The organic Ashbury, from {fmt(mFrom)}</h1>
          <p className="hero-body">{SALE.percent}% off everything. No code needed.</p>
          <a href={MATTRESS_PATH} className="btn light">Shop the Ashbury</a>
        </div>
      </section>

      <div className="bf-m bf-rs">
        <div className="bf-rs-top"><Stars rating={avg} /> <strong>{avg.toFixed(1)}</strong> <span>from {rvCount} customer reviews</span></div>
        <ul className="bf-rs-q">
          {quotes.map((q) => <li key={q.by}>&ldquo;{q.t}&rdquo; <span>{q.by}</span></li>)}
        </ul>
      </div>

      <nav className="bf-m bf-mchips" aria-label="Jump to a category">
        {mchips.map(([id, label]) => <a key={label} href={"#" + id} className="bf-chip">{label}</a>)}
      </nav>

      <div className="bf-m">
        <section className="bf-msec" id="m-bundles">
          <h2 className="bf-mh">Bundles</h2>
          <p className="bf-msub">Free white glove delivery for the mattress.</p>
          <div className="bf-rail bf-rail-b">
            <BundleCard href={BUNDLE.path} photo={BUNDLE_HERO.photo} alt={BUNDLE_HERO.alt} title={BUNDLE.title}
              desc="Ashbury mattress, Ashbury Dog Bed, and a bedding set of two pillows and a Mattress Protector." was={bfList} now={bfNow} />
            <BundleCard href={SLEEP_SUITE_PATH} photo="sleep-suite-hero" alt="The Complete Sleep Suite: an Ashbury mattress with a bedding set" title="The Complete Sleep Suite"
              desc="Ashbury mattress and a bedding set of two pillows and a Mattress Protector." was={ssList} now={ssNow} />
          </div>
        </section>
        <section className="bf-msec" id="m-gifts">
          <h2 className="bf-mh">Gifts under $300</h2>
          <div className="bf-rail">{gifts.map(card)}</div>
        </section>
        <section className="bf-msec" id="m-mattress">
          <h2 className="bf-mh">Mattress</h2>
          <div className="bf-rail">{items.filter((i) => i.cat === "mattress").map(card)}</div>
        </section>
        <section className="bf-msec" id="m-sofas">
          <h2 className="bf-mh">Sofas</h2>
          <div className="bf-rail">{items.filter((i) => i.cat === "sofas").map(card)}</div>
        </section>
        <section className="bf-msec" id="m-chairs">
          <h2 className="bf-mh">Chairs and ottoman</h2>
          <div className="bf-rail">{items.filter((i) => i.cat === "chairs").map(card)}</div>
        </section>
        <section className="bf-msec bf-mtrust">
          <ul className="bf-tr">
            {trust.map(([icon, t]) => <li key={t}><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg><span>{t}</span></li>)}
          </ul>
        </section>
        <section className="bf-msec">
          <h2 className="bf-mh">Good to know</h2>
          <div className="bf-faq">
            {faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
          <p className="bf-fine">Discount applied automatically at checkout. Taxes calculated at checkout. <Link href="/collections/all">All products</Link></p>
        </section>
      </div>
      <BfStickyCta href="#m-bundles" label="Shop the sale" />

      <section className="bf-sec bf-d" id="bundles">
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

      <section className="bf-sec bf-d" id="shop">
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

      <section className="bf-reassure bf-d">
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
