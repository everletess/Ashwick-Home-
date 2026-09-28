import type { Metadata } from "next";
import { BespokeForm, ScrollLink } from "@/components/forms";
import { Photo, SwatchGrid } from "@/components/photo";
import { PageHero, ProductGrid } from "@/components/sections";
import type { PhotoKey } from "@/lib/photos";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Design your own",
  description: "Customize a piece from our collection, or design something entirely your own, made by hand in the USA.",
};

type Step = { n: string; t: string; d: string; img?: PhotoKey; swatches?: boolean; ph?: string; link?: [string, string] };

const STEPS: Step[] = [
  { n: "01", t: "Start with a piece, or an idea", d: "Begin with one of our six pieces, or send us a sketch, a photo or a description of something that doesn’t exist yet.", img: "csofa-a" },
  { n: "02", t: "Make it yours", d: "Choose the fabric, seat depth, length and wood finish. Every option, and every bespoke piece, is made from the same materials: solid hardwood, organic wool, organic linen, kapok and natural oils.", swatches: true, link: ["Order fabric swatches", "#"] },
  { n: "03", t: "Talk it through", d: "For customized pieces, write to us any time before you order. For bespoke pieces, we’ll talk through proportions, materials and how the piece will be used before anything is made.", link: ["Contact us", "#"] },
  { n: "04", t: "Order and pay", d: "Customized pieces are ordered online and paid in full at checkout. Bespoke pieces: [BESPOKE ORDERING DETAILS]." },
  { n: "05", t: "Made by hand, in the USA", d: "Your piece is started when you order it. In our American workshop the frame is cut and joined by hand, the fill is layered by hand, and the cover is fitted and stitched by hand.", ph: "Hands at work in the workshop" },
  { n: "06", t: "Delivered to your home", d: "[DELIVERY DETAILS]", link: ["Delivery information", "#"] },
];

export default function DesignPage() {
  return (
    <main>
      <PageHero
        photo="marlowe-2"
        alt="The Marlowe"
        eyebrow="Design your own"
        title="Make one of ours yours, or make something new."
        body="Customize a piece from our collection, or design something entirely your own. Either way, it's made once, by hand, for one home."
      />

      <section className="sec">
        <div className="wrap center-head">
          <div className="eyebrow">Two ways to begin</div>
          <h2 className="h2">Choose a piece, or bring us an idea.</h2>
        </div>
        <div className="wrap grid2 approach">
          <div className="appr">
            <div className="proc-n">01</div>
            <div className="appr-n">Customize a piece</div>
            <p className="body">Start with one of our six pieces and change the fabric, seat depth, length or wood finish. It&apos;s built to your choices from the first cut.</p>
            <ScrollLink to="choose" className="ulink">Choose a piece</ScrollLink>
          </div>
          <div className="appr">
            <div className="proc-n">02</div>
            <div className="appr-n">Design your own piece</div>
            <p className="body">Have something in mind that isn&apos;t in our collection? Send us a sketch, a photo or a description, and we&apos;ll make it by hand from the materials we trust.</p>
            <ScrollLink to="bespoke" className="ulink">Start your design</ScrollLink>
          </div>
        </div>
      </section>

      <section className="sec tint">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 88 }}>
            <div className="eyebrow">The process</div>
            <h2 className="h2">From your idea to your home.</h2>
          </div>
          <div className="process">
            {STEPS.map((s, i) => {
              const visual = s.img || s.swatches || s.ph;
              return (
                <div className={"proc" + (visual ? "" : " txt") + (i % 2 ? " rev" : "")} key={s.n}>
                  {visual && (
                    <div className="proc-v">
                      {s.img && <Photo src={s.img} label={s.t} sizes="(max-width: 960px) 100vw, 50vw" />}
                      {s.ph && <Photo label={s.ph} />}
                      {s.swatches && <SwatchGrid />}
                    </div>
                  )}
                  <div className="proc-t">
                    <div className="proc-n">{s.n}</div>
                    <h3 className="proc-h">{s.t}</h3>
                    <p className="body">{s.d}</p>
                    {s.link && <a href={s.link[1]} className="ulink">{s.link[0]}</a>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec" id="choose">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">01 · Customize a piece</div>
              <h2 className="h2">Choose a piece to customize.</h2>
            </div>
            <p className="body">Each piece opens with the options it offers: fabric, seat depth, length and wood finish.</p>
          </div>
          <ProductGrid products={PRODUCTS} custom />
        </div>
      </section>

      <section className="sec linen" id="bespoke">
        <div className="wrap trade-apply">
          <div>
            <div className="eyebrow">02 · Design your own piece</div>
            <h2 className="h2">Tell us what you&apos;d like made.</h2>
            <p className="body" style={{ marginTop: 24 }}>A sofa for an awkward wall, a chair to match one you already love, a piece that doesn&apos;t exist yet. Send us what you have and we&apos;ll talk it through with you.</p>
            <p className="body" style={{ marginTop: 18 }}>Everything is made by hand in our American workshop from solid hardwood, organic wool, organic linen, kapok and natural oils. Nothing synthetic.</p>
            <div className="trade-contact">
              <div className="eyebrow">Bespoke pricing &amp; timing</div>
              <p>[BESPOKE DETAILS]</p>
            </div>
          </div>
          <BespokeForm />
        </div>
      </section>
    </main>
  );
}
