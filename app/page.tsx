import Link from "next/link";
import { BrandStory } from "@/components/brand-story";
import { Newsletter } from "@/components/forms";
import { Photo, SwatchGrid } from "@/components/photo";
import { MadeByHand, MaterialsBlock, ProductGrid } from "@/components/sections";
import { PRODUCTS } from "@/lib/products";

function HomeHero() {
  return (
    <section className="hero">
      <Photo src="hero" label="Ashwick Home living room" fill preload />
      <div className="hero-scrim"></div>
      <div className="hero-txt">
        <div className="eyebrow">Organic furniture · Handmade in the USA</div>
        <h1 className="h1">Made of nature. Built to last.</h1>
        <p className="hero-body">
          Sofas and chairs made by hand, one at a time, from solid hardwood, organic latex, organic wool, coconut coir and linen. Nothing synthetic.
        </p>
        <div className="btns">
          <Link href="/collections/all" className="btn light">Shop the collection</Link>
          <Link href="/pages/design-your-own" className="btn outline-light">Design your own</Link>
        </div>
      </div>
    </section>
  );
}

const VALUES: [string, string][] = [
  ["Handmade in the USA", "Built to order in our American workshop."],
  ["Organic, all natural", "Solid hardwood, organic latex, organic wool and coconut coir."],
  ["Nothing synthetic", "No polyurethane foam, no chemical flame retardants, no plastic."],
  ["As designed, or yours", "Choose fabric, seat depth, length and finish."],
];

function ValueStrip() {
  return (
    <section className="values">
      <div className="values-in">
        {VALUES.map(([t, d]) => (
          <div className="val" key={t}>
            <div className="val-t">{t}</div>
            <div className="val-d">{d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeStatement() {
  return (
    <section className="statement">
      <p>Most furniture is built to be replaced.</p>
      <div className="gap"></div>
      <p>We build ours to be inherited.</p>
      <Link href="/pages/our-story" className="ulink light">Read our story</Link>
    </section>
  );
}

function HomeCollection() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="split-head">
          <div>
            <div className="eyebrow">The collection</div>
            <h2 className="h2">Every piece, made one at a time.</h2>
          </div>
          <p className="body">Sofas, chairs and an ottoman. Order each as we designed it, or make it yours.</p>
        </div>
        <ProductGrid products={PRODUCTS} />
      </div>
    </section>
  );
}

function HomeWays() {
  return (
    <section className="sec tint">
      <div className="wrap">
        <div className="split-head">
          <div>
            <div className="eyebrow">Two ways to own it</div>
            <h2 className="h2">As designed, or as you&apos;d like it.</h2>
          </div>
          <p className="body">Choose a piece exactly as we designed it, or make it your own. Either way, it&apos;s made once, for one home.</p>
        </div>
        <div className="grid2">
          <div className="panel">
            <div className="panel-img">
              <Photo src="marlowe-2" label="The Marlowe as designed" sizes="(max-width: 960px) 100vw, 50vw" />
            </div>
            <div className="eyebrow">As designed</div>
            <p className="body">Our fabrics, proportions and finishes, chosen to work together. The simplest way to begin.</p>
            <Link href="/collections/all" className="ulink">Shop the collection</Link>
          </div>
          <div className="panel">
            <SwatchGrid className="panel-img swgrid" />
            <div className="eyebrow">Made your way</div>
            <p className="body">Choose the fabric, seat depth, length and wood finish.</p>
            <Link href="/pages/design-your-own" className="ulink">Design your own</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeName() {
  return (
    <section className="sec">
      <div className="wrap name">
        <div>
          <div className="eyebrow">Where the name comes from</div>
          <h2 className="h2">Named for the English countryside.</h2>
          <p className="body" style={{ marginTop: 28 }}>
            Stone villages, hedgerows and old houses, where a good chair outlived the person who bought it. We took the spirit of
            those places, not the address. Everything we make is made here, in America.
          </p>
        </div>
        <div className="names">
          {PRODUCTS.filter((p) => !p.hideInNames).map((p) => <Link key={p.id} href={"/products/" + p.id}>{p.name}</Link>)}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <ValueStrip />
      <HomeStatement />
      <BrandStory />
      <HomeCollection />
      <HomeWays />
      <MadeByHand />
      <section className="sec linen">
        <div className="wrap"><MaterialsBlock /></div>
      </section>
      <HomeName />
      <Newsletter />
    </main>
  );
}
