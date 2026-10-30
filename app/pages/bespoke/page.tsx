import type { Metadata } from "next";
import Link from "next/link";
import { AnchorAliases } from "@/components/anchor-aliases";
import { BespokeForm } from "@/components/forms";
import { Accordion } from "@/components/mattress";
import { Photo } from "@/components/photo";
import { PageHero, ProductGrid } from "@/components/sections";
import { BESPOKE_REPLY } from "@/lib/bespoke";
import { ASHBURY_PATH, FURNITURE_MATERIALS_PATH } from "@/lib/materials";
import type { PhotoKey } from "@/lib/photos";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: { absolute: "Ashwick Bespoke — Natural furniture and mattresses, made to your imagination." },
  description: "Commission a sofa, chair, mattress or bench made by hand from natural materials, or tailor a piece from the collection.",
};

const HALF = "(max-width: 960px) 100vw, 50vw";

// Kapok is left out of the material lists for now (Tessa, Oct 16), as on the materials pages.
const ONE_RULE = "solid hardwood, wool, cashmere, linen, cotton, horsehair, coir and agave";

// Possibilities, not past commissions.
const IMAGINE: [string, string, PhotoKey][] = [
  ["A curved sofa that follows the line of a bay window.", "A curved cream sofa following the line of a bay window, a round oak table in front", "imagine-bay-sofa"],
  ["A deep daybed for a sunroom, upholstered in undyed linen.", "A deep linen daybed on an oak frame in a garden room with tall oak windows", "imagine-daybed"],
  ["An Ashbury mattress cut to fit a hundred-year-old four-poster.", "A cream tufted Ashbury with its Ashwick Home label, fitted into an antique dark oak four-poster bed", "imagine-four-poster"],
  ["A long dining bench in solid oak with a horsehair-and-wool cushion.", "A long solid oak dining bench with a linen-covered cushion beside an oak table", "imagine-bench"],
  ["A pair of reading chairs scaled to the person who'll sit in them.", "A pair of linen wingback reading chairs by a window, a walnut side table between them", "imagine-chairs"],
  ["A headboard wrapped in the same Sorrel cotton as the bed.", "A Sorrel cotton headboard behind a matching tufted Ashbury with its Ashwick Home label, on an oak bed frame", "imagine-headboard"],
];

type Step = { t: string; d: string; img?: PhotoKey; alt?: string };
const STEPS: Step[] = [
  { t: "Share your idea.", d: "A sketch, a photo, a Pinterest board, the measurements of your room. As rough as you like.", img: "bespoke-share", alt: "Two people comparing linen, textured cream and moss swatches and oak and walnut samples at a dining table" },
  { t: "Talk it through.", d: `A design consultation by video or phone, ${BESPOKE_REPLY}. We'll talk about how you'll use it, the proportions and the materials.`, img: "bespoke-consult", alt: "A designer on the phone sketching a sofa beside fabric swatches" },
  { t: "See it drawn.", d: "We send a scaled drawing, a material proposal and a quote. Our drawing and design service is available for every commission.", img: "bespoke-sketch", alt: "Hands sketching a sofa and room plan in a notebook beside a reference photo, a moss swatch and a tape measure" },
  { t: "Choose your materials.", d: "We send swatches of the wool, linen, cotton and wood finishes so you can touch them at home.", img: "bespoke-swatches", alt: "Swatches of linen, textured cream, oat and moss weaves and clay twill on an old oak table" },
  { t: "Made by hand.", d: "Your piece is built in our USA workshop, one at a time, and we send you photos from the workshop as it comes together.", img: "bespoke-stitching", alt: "Hands stitching the piped edge of a linen cushion on a workshop bench" },
  { t: "Delivered to your home.", d: "Every commission arrives by white-glove delivery.", img: "bespoke-delivery", alt: "Two delivery specialists unwrapping a linen sofa and placing its bolsters in a sunlit living room" },
];

const PALETTE: [string, PhotoKey][] = [
  ["Solid hardwood", "fiber-wood"],
  ["Natural oils", "materials-oil"],
  ["Living Wool", "fiber-wool"],
  ["Cashmere", "fiber-kashmir"],
  ["Linen", "materials-linen"],
  ["Organic cotton", "fiber-cotton"],
  ["Swedish horsehair", "fiber-horsehair"],
  ["Coconut coir", "fiber-coir"],
  ["Agave", "fiber-agave-card"],
];

// Ashwick Bespoke handoff (Oct 16), with Tessa's answers to its open questions (Oct 17).
export default function BespokePage() {
  return (
    <main>
      <AnchorAliases map={{ choose: "tailored", bespoke: "commission" }} />
      <PageHero
        photo="bespoke-hero"
        alt="A maker sketching a sofa at a worktable among linen and textured wool swatches, oak and walnut samples and a brass ruler"
        tall
        eyebrow="Ashwick Bespoke"
        title="Whatever you can imagine, nature can make."
        body="A sofa shaped to your bay window. A mattress cut for an antique bed. A chair that exists nowhere else. Tell us what you see, and we'll make it by hand from the earth's finest materials."
      >
        <div className="btns" style={{ justifyContent: "center" }}>
          <a href="#commission" className="btn light">Begin a commission</a>
          <a href="#tailored" className="btn outline-light">Tailor a piece</a>
        </div>
      </PageHero>

      <section className="statement tall">
        <p>There&apos;s only one rule.</p>
        <span className="body statement-body bsp-rule">
          Everything we make comes from the earth: {ONE_RULE}. No foam. No chemical flame retardants. Within that, the only limit is your imagination.
        </span>
      </section>

      <section className="sec">
        <div className="wrap grid2 bsp-ways">
          <div className="panel">
            <div className="panel-img"><Photo src="marlowe-room-linen" label="The Marlowe" sizes={HALF} /></div>
            <div className="eyebrow">Tailored</div>
            <h2 className="proc-h">Make one of ours yours.</h2>
            <p className="body">Start with a piece from the collection and change what matters to you: fabric, seat depth, length, wood finish or color.</p>
            <a href="#tailored" className="ulink">Choose a piece</a>
          </div>
          <div className="panel">
            <div className="panel-img"><Photo src="bespoke-drawing" label="A pencil sketch of a sofa beside fabric swatches and wood samples" sizes={HALF} /></div>
            <div className="eyebrow">Commissioned</div>
            <h2 className="proc-h">Make something that&apos;s never existed.</h2>
            <p className="body">Bring us a sketch, a photograph, a measurement or a feeling. We&apos;ll design it with you, draw it, and make it once, by hand, for your home.</p>
            <a href="#commission" className="ulink">Begin a commission</a>
          </div>
        </div>
      </section>


      <section className="sec linen" id="process">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 88 }}>
            <div className="eyebrow">The process</div>
            <h2 className="h2">How a commission comes to life.</h2>
            <p className="body" style={{ marginTop: 24 }}>If you can imagine it, we can make it. Here&apos;s what to expect, from your first idea to the day it arrives.</p>
          </div>
          <div className="process">
            {STEPS.map((s, i) => (
              <div className={"proc" + (s.img ? "" : " txt") + (i % 2 ? " rev" : "")} key={s.t}>
                {s.img && <div className="proc-v"><Photo src={s.img} label={s.alt ?? s.t} sizes={HALF} /></div>}
                <div className="proc-t">
                  <div className="proc-n">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="proc-h">{s.t}</h3>
                  <p className="body">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bsp-timing">
            <div className="eyebrow">Timing and payment</div>
            <p className="body">
              Lead time depends on the project, and you&apos;ll have a timeline with your quote. Commissions are paid in full when you commission.
            </p>
            <p className="body">
              Each commission is one of a kind, so it&apos;s final sale once production begins.{" "}
              <Link href="/pages/terms#bespoke" className="inl">See our terms →</Link>
            </p>
            <a href="#commission" className="btn">Begin a commission</a>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 72 }}>
            <div className="eyebrow">Possibilities</div>
            <h2 className="h2">Imagine.</h2>
            <p className="body" style={{ marginTop: 24 }}>A few of the things you could commission.</p>
          </div>
          <div className="grid3">
            {IMAGINE.map(([line, alt, photo]) => (
              <figure className="bsp-imagine" key={line}>
                <div className="tile-img"><Photo src={photo} label={alt} sizes="(max-width: 620px) 100vw, (max-width: 1180px) 50vw, 460px" /></div>
                <figcaption className="body">{line}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec linen" id="tailored">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">Tailored</div>
              <h2 className="h2">Tailor a piece.</h2>
            </div>
            <p className="body">Every piece in the collection can be changed. Choose one to begin.</p>
          </div>
          <ProductGrid products={PRODUCTS} custom mattress />
          <div className="bsp-mattress" id="mattresses">
            <h3 className="proc-h">The bespoke Ashbury.</h3>
            <p className="body">
              Our all-natural mattress, made to your measurements in any size or shape: extra long, extra wide, with cut corners for antique and four-poster beds, split for narrow staircases, or with a different feel on each side, in any of our four colors.
            </p>
            <Link href={ASHBURY_PATH} className="ulink">Inside the Ashbury →</Link>
          </div>
        </div>
      </section>


      <section className="sec">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 64 }}>
            <h2 className="h2">Your palette.</h2>
            <p className="body" style={{ marginTop: 24 }}>Choose from the materials and vetted natural fabrics we trust, or bring your own natural-fiber fabric.</p>
          </div>
          <div className="bsp-palette">
            {PALETTE.map(([name, photo]) => (
              <figure key={name}>
                <div className="bsp-palette-img"><Photo src={photo} label={name} sizes="160px" /></div>
                <figcaption className="eyebrow">{name}</figcaption>
              </figure>
            ))}
          </div>
          <div className="bsp-palette-links">
            <Link href={FURNITURE_MATERIALS_PATH} className="ulink">Furniture materials →</Link>
            <Link href={ASHBURY_PATH} className="ulink">Inside the Ashbury →</Link>
            <Link href="/pages/fabric-swatches" className="btn">Order fabric swatches</Link>
          </div>
        </div>
      </section>

      <section className="sec linen" id="commission">
        <div className="wrap trade-apply">
          <div>
            <div className="eyebrow">Commissioned</div>
            <h2 className="h2">Begin a commission.</h2>
            <p className="body" style={{ marginTop: 24 }}>
              Tell us what you&apos;re imagining. A member of our team will be in touch {BESPOKE_REPLY} to arrange your consultation.
            </p>
            <div className="trade-contact">
              <div className="eyebrow">Timing and payment</div>
              <p>Lead time depends on the project. Paid in full upon commission.</p>
            </div>
          </div>
          <BespokeForm />
        </div>
      </section>

      <section className="band band-c bsp-band">
        <Photo src="workshop-sofa" label="An upholsterer laying wool over a solid hardwood sofa frame in the workshop" fill sizes="100vw" />
        <div className="hero-scrim"></div>
        <div className="band-txt">
          <h2 className="h2">Imagined by you. Grown by the earth. Made by hand.</h2>
          <a href="#commission" className="btn light">Begin a commission</a>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap specs">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2 className="h2">Questions</h2>
          </div>
          <Accordion
            items={[
              ["Is there anything you can't make?", <p className="body small" key="1">If it can be made well from natural materials, we&apos;ll try. Some ideas need adjusting so they&apos;re comfortable and built to last; we&apos;ll tell you honestly during your consultation.</p>],
              ["How much does a commission cost?", <p className="body small" key="2">It depends on size, materials and complexity. You&apos;ll receive a full quote before anything is made, and commissions are paid in full when you commission.</p>],
              ["How long does it take?", <p className="body small" key="3">It depends on the project. You&apos;ll have a timeline with your quote, and we send photos from the workshop as your piece is made.</p>],
              ["Can I use my own fabric?", <p className="body small" key="4">Yes, as long as it&apos;s a natural fiber. You can also choose from our own vetted natural fabrics.</p>],
              ["Can you match a piece I already own?", <p className="body small" key="5">Yes. Send photos and measurements and we&apos;ll design to them.</p>],
              ["Do you work with interior designers?", <p className="body small" key="6">Yes, through our Trade program, with trade pricing and a dedicated contact. <Link href="/pages/trade" className="inl">Trade</Link></p>],
              ["Are bespoke pieces covered by the warranty?", <p className="body small" key="7">Yes. Every Ashwick piece, bespoke included, is covered by our lifetime limited warranty.</p>],
            ]}
          />
        </div>
      </section>
    </main>
  );
}
