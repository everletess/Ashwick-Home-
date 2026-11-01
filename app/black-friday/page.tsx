import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOG_BED_CARDS, DogBedCard } from "@/components/black-friday";
import { Price } from "@/components/sale";
import { MattressCard, ProductGrid } from "@/components/sections";
import { Photo } from "@/components/photo";
import { DOG_BED } from "@/lib/dog-bed";
import { MATTRESS } from "@/lib/mattress";
import { fmt, productsIn } from "@/lib/products";
import { BUNDLE, BUNDLE_CONFIG, SALE, bundlePrice, salePrice } from "@/lib/sale";

export const metadata: Metadata = {
  title: "Black Friday at Ashwick: 20% off everything",
  description: "20% off the whole collection, mattresses included, Plus the Best Friends Bundle: an Ashbury, an Ashbury Dog Bed and a Best Friends Bedding Set, with free white glove delivery.",
  alternates: { canonical: SALE.path },
};

export default function BlackFridayPage() {
  if (!SALE.active) notFound();
  const pairFrom = MATTRESS.sizes[0].price + DOG_BED.sizes[0].price + BUNDLE_CONFIG.beddingSet.price;
  return (
    <main className="bf-page">
      <section className="bf-hero">
        <Photo src="hero-bedroom" label="A sunlit bedroom with an upholstered bed in rust linen bedding and a pair of textured cream wingback chairs" fill preload />
        <div className="bf-hero-scrim"></div>
        <div className="bf-hero-txt">
          <div className="eyebrow">{SALE.name} at Ashwick</div>
          <h1 className="h1">{SALE.percent}% off everything.</h1>
          <p className="hero-body">Sofas, chairs, dog beds and the Ashbury mattress. And the Best Friends Bundle, with free white glove delivery.</p>
          <div className="btns">
            <a href="#collections" className="btn light">Shop the sale</a>
            <Link href={BUNDLE.path} className="btn outline-light">The Best Friends Bundle</Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">How it works</div>
              <h2 className="h2">One offer, across the whole collection.</h2>
            </div>
            <p className="body">Prices on this page already show {SALE.percent}% off. The discount is applied automatically at checkout: there is no code to enter.</p>
          </div>
          <div className="bf-terms">
            <div className="val"><div className="val-t">{SALE.percent}% off sitewide</div><div className="val-d">Every sofa, chair, dog bed and the Ashbury mattress.</div></div>
            <div className="val"><div className="val-t">Free white glove with the bundle</div><div className="val-d">Buy the Best Friends Bundle and white glove delivery for the mattress is included. Otherwise white glove is $200 for a mattress and $750 per piece of furniture.</div></div>
            <div className="val"><div className="val-t">Handmade to order</div><div className="val-d">Every piece is made by hand in the USA. Mattresses and dog beds ship within 3–4 days.</div></div>
          </div>
        </div>
      </section>

      <section className="sec tint bf-bundle" id="bundle">
        <div className="wrap bf-bundle-in">
          <Link href={BUNDLE.path} className="bf-bundle-img" aria-label={BUNDLE.title}>
            <Photo src="dog-bed-sorrel-room" label="A chocolate doodle curled up on the Ashbury Dog Bed in Sorrel beside a bed" sizes="(max-width: 960px) 100vw, 50vw" />
          </Link>
          <div className="bf-bundle-t">
            <div className="eyebrow">Only at Ashwick</div>
            <h2 className="h2">{BUNDLE.title}</h2>
            <p className="body">
              An Ashbury mattress and an Ashbury Dog Bed, in colors that match: Fleece, Flint, Flax or Sorrel. Organic doesn&apos;t have to be beige, and neither does the dog&apos;s corner of the room.
            </p>
            <ul className="bf-list">
              <li>{SALE.percent}% off the bundle</li>
              <li>Free white glove delivery for the mattress is included</li>
              <li>A Best Friends Bedding Set: two pillows sized to your mattress and a Mattress Protector, {fmt(BUNDLE_CONFIG.beddingSet.price)}</li>
              <li>Choose each size and color, and add all three to your cart in one tap</li>
            </ul>
            <p className="body">
              From <s className="price-was">{fmt(pairFrom)}</s> <strong>{fmt(bundlePrice(MATTRESS.sizes[0].price) + bundlePrice(DOG_BED.sizes[0].price) + bundlePrice(BUNDLE_CONFIG.beddingSet.price))}</strong> for a Twin XL, a Small and the bedding set
            </p>
            <div className="btns"><Link href={BUNDLE.path} className="btn">Build your bundle</Link></div>
          </div>
        </div>
      </section>

      <section className="sec" id="collections">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">Mattress</div>
              <h2 className="h2">The Ashbury.</h2>
            </div>
            <p className="body">An all-natural mattress, hand-tufted and made in four colors. From <Price price={Math.min(...MATTRESS.sizes.map((z) => z.price))} />.</p>
          </div>
          <div className="grid3"><MattressCard /></div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">Dog beds</div>
              <h2 className="h2">For the one at the foot of the bed.</h2>
            </div>
            <p className="body">Organic cotton, Living Wool and cashmere, handmade to order. Free delivery on dog beds.</p>
          </div>
          <div className="grid3">
            {DOG_BED_CARDS.map((c) => <DogBedCard key={c.bed.id} {...c} />)}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">Sofas</div>
              <h2 className="h2">Made once, for one home.</h2>
            </div>
            <p className="body">Solid hardwood frames, organic wool and coconut coir. Choose your fabric, as designed or bespoke.</p>
          </div>
          <ProductGrid products={productsIn("sofas")} />
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">Chairs and ottoman</div>
              <h2 className="h2">The quiet corner.</h2>
            </div>
            <p className="body">Chairs and an ottoman, each made to order by hand.</p>
          </div>
          <ProductGrid products={productsIn("chairs")} />
        </div>
      </section>

      <section className="statement statement-sm">
        <p>Ready when you are.</p>
        <div className="gap"></div>
        <p>The discount is applied at checkout.</p>
        <div className="btns" style={{ justifyContent: "center" }}>
          <Link href="/collections/all" className="btn light">Shop everything</Link>
        </div>
        <p className="bf-fine">
          Sale prices are {SALE.percent}% off the listed price; furniture white glove delivery ($200 per mattress, $750 per piece of furniture) is charged as usual, except the mattress in the Best Friends Bundle. Taxes calculated at checkout. Open your cart from the top of any page.
        </p>
      </section>
    </main>
  );
}
