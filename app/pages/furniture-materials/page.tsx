import type { Metadata } from "next";
import Link from "next/link";
import { Band, Groups, MatIndex } from "@/components/materials";
import { Accordion, Columns } from "@/components/mattress";
import { Photo } from "@/components/photo";
import { PageHero } from "@/components/sections";
import { ASHBURY_PATH, FURNITURE_GROUPS, MATERIALS_PATH, MATERIALS_PENDING as P } from "@/lib/materials";

export const metadata: Metadata = {
  title: "Furniture Materials",
  description: "Solid hardwood frames, natural fills and woven fabrics, made to order by hand in the USA.",
};

const HALF = "(max-width: 960px) 100vw, 50vw";

// Copy is final (materials handoff); entries and pending values live in lib/materials.ts.
export default function FurnitureMaterialsPage() {
  const index = FURNITURE_GROUPS.flatMap((g) => g.materials.map((m) => ({ id: m.id, label: m.short })));
  return (
    <main>
      <PageHero
        photo="furniture-family"
        alt="A mother playing with her baby on a wool rug beside a sofa, armchair and ottoman on fluted wood plinths, a golden retriever asleep nearby"
        eyebrow="Materials — Furniture"
        title="Built from the inside out."
        body="Solid hardwood frames, natural fills and woven fabrics, made to order by hand in the USA. These are the materials we work with. Not every piece uses every one: each product page lists exactly what's inside."
      />

      <section className="sec linen">
        <div className="wrap center-head">
          <h2 className="h2">Why fiber, not foam.</h2>
          <p className="body" style={{ marginTop: 24 }}>
            Most upholstered furniture is built around foam: it&apos;s cheap, quick to shape and soft on the showroom floor. We fill ours with natural materials instead. They let air move, recover their shape when plumped, and settle in around you over the years rather than breaking down.
          </p>
        </div>
        <MatIndex items={index} />
      </section>

      <Groups groups={FURNITURE_GROUPS} whereLabel="How we use it" />

      <Band alt="Wool and kapok together, soft focus" title="The right fiber, in the right place." center />

      <section className="sec">
        <div className="wrap proc">
          <div className="proc-v mat-portrait"><Photo src="csofa-lifestyle" label="The Cotswold sectional in cream bouclé in a sunlit living room" sizes={HALF} /></div>
          <div className="proc-t">
            <h2 className="proc-h">Every piece, built for its purpose.</h2>
            <p className="body">A deep lounge sofa and an upright chair shouldn&apos;t be built the same way. We combine these materials differently for each piece, and every product page lists exactly what&apos;s inside it.</p>
            <p className="body">Natural fills settle gently as they conform to you. Plump and turn your cushions regularly and they&apos;ll keep their shape for years.</p>
          </div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap center-head">
          <div className="eyebrow">Craft</div>
          <h2 className="h2">Made by hand, one piece at a time.</h2>
          <p className="body" style={{ marginTop: 24 }}>
            Every Ashwick piece is built to order, by hand, in the USA. Frames are cut and joined, fills are layered by hand, and every piece is upholstered for the person who ordered it. It takes longer, and it&apos;s why each one is built to be inherited.
          </p>
        </div>
      </section>

      <section className="statement mat-leave statement-sm">
        <p>What we leave out.</p>
        <ul className="leave-list">
          {["No foam.", "No latex.", "No chemical flame retardants.", "No plastic."].map((x) => <li key={x}>{x}</li>)}
        </ul>
        <span className="body statement-body pending-light">{P.furnitureGlue}</span>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 64 }}>
            <div className="eyebrow">Certifications and safety</div>
          </div>
          <Columns items={[["Fire safety", P.furnitureFire], ["Certifications", P.furnitureCerts]]} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap center-head">
          <h2 className="h2">Feel it for yourself.</h2>
          <p className="body" style={{ marginTop: 24 }}>
            Photographs only go so far with materials like these. {P.swatchKit} Or book a design consultation, and we&apos;ll help you choose.
          </p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <Link href="/pages/fabric-swatches" className="btn">Order swatches</Link>
            <span className="btn ghost" aria-disabled="true">{P.consultation}</span>
          </div>
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
              ["Why don't you use foam or latex?", <p className="body small" key="1">Natural fills let air move and recover their shape when plumped. We&apos;d rather build furniture that settles in over years than cushions engineered to feel soft on day one.</p>],
              ["Will natural cushions flatten?", <p className="body small" key="2">They settle gently as they conform to you, which is normal. Plumping and turning cushions regularly keeps them full and even.</p>],
              ["How do I care for oiled wood?", <p className="body small" key="3">Dust with a soft, dry cloth. If the wood looks dry or picks up a small mark, a fresh coat of {P.oilType} restores it.</p>],
              ["How are your pieces fire-safe without chemical flame retardants?", <p className="body small" key="4">{P.furnitureFireAnswer}</p>],
            ]}
          />
        </div>
      </section>

      <section className="sec mat-next">
        <div className="wrap center-head">
          <p className="body">Looking for the mattress? <Link href={ASHBURY_PATH} className="inl">Inside the Ashbury →</Link></p>
          <Link href={MATERIALS_PATH} className="ulink">All materials</Link>
        </div>
      </section>
    </main>
  );
}
