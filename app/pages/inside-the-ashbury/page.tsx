import type { Metadata } from "next";
import Link from "next/link";
import { Band, Groups, MatIndex } from "@/components/materials";
import { Accordion, Columns, Layers } from "@/components/mattress";
import { Photo } from "@/components/photo";
import { PageHero } from "@/components/sections";
import { GUARANTEE_PATH, MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { ASHBURY_GROUPS, FURNITURE_MATERIALS_PATH, MATERIALS_PATH, MATERIALS_PENDING as P } from "@/lib/materials";

const M = MATTRESS;

export const metadata: Metadata = {
  title: "Inside the Ashbury",
  description: "An all-natural, organic mattress made from nature's finest materials: Living Wool, Swedish horsehair and organic cotton, hand-tufted and made in color.",
};

const HALF = "(max-width: 960px) 100vw, 50vw";

// Copy is final (materials handoff); entries and pending values live in lib/materials.ts.
export default function InsideTheAshburyPage() {
  const index = [
    ...ASHBURY_GROUPS.flatMap((g) => g.materials.map((m) => ({ id: m.id, label: m.short }))),
    { id: "hand-tufting", label: "Hand-Tufting" },
  ];
  const recovery = (
    <section className="statement statement-sm">
      <p>Sleep is when the body does its quiet work.</p>
      <span className="body statement-body">
        Living Wool is made to support it: an even temperature, a dry surface and steady, buoyant support as you move through the night, so you wake rested, not restless.
      </span>
    </section>
  );
  return (
    <main>
      <PageHero
        photo="mattress-meadow"
        alt="A cutaway of the Ashbury in Sorrel in a meadow, showing the wool, horsehair and pocket coils inside"
        eyebrow={`${M.title} · ${M.collection}`}
        title="Inside the Ashbury."
        body="An all-natural, organic mattress made from nature's finest materials: Living Wool, Swedish horsehair and organic cotton, hand-tufted and made in color."
      />

      <section className="sec linen">
        <div className="wrap center-head">
          <h2 className="h2">Why fiber, not foam.</h2>
          <p className="body" style={{ marginTop: 24 }}>
            Foam is made to feel soft on the showroom floor. Wool, horsehair and cotton work differently. They let air move, carry moisture away and recover their shape every night, so the Ashbury settles in around you over time. It&apos;s how fine beds were made for centuries before foam made them cheaper to produce.
          </p>
        </div>
        <MatIndex items={index} />
      </section>

      <Groups groups={ASHBURY_GROUPS} whereLabel="Where you'll find it" after={{ "living-wool": recovery }} />

      <Band photo="materials-band-blend" alt="Cream wool and dark curled horsehair blended together" title="The right fiber, in the right place." center />

      <section className="sec linen" id="hand-tufting">
        <div className="wrap proc">
          <div className="proc-v mat-portrait"><Photo src="materials-rosettes" label="Hand-tied wool rosettes on the Ashbury topper in Hazel" sizes={HALF} /></div>
          <div className="proc-t">
            <div className="eyebrow">Craft</div>
            <h2 className="proc-h">Held together by hand.</h2>
            <p className="body">
              Natural materials can&apos;t be poured into a mold. Wool is layered evenly, horsehair opened and blended, and then every Ashbury topper is hand-tufted: the layers are drawn through with a needle and held with a rosette of wool, so they stay in place without glue. The rosettes on the surface are the mark of the work inside. Over it all goes a super soft 100% organic cotton twill cover, colored with GOTS-approved plant dyes.
            </p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap proc">
          <div className="proc-v">
            <Photo src="mattress-layers" label="The Ashbury's layers stacked: the tufted topper folded back over wool and horsehair, then wool, pocket coils, wool and the cotton twill base" sizes={HALF} />
          </div>
          <div className="proc-t">
            <h2 className="proc-h">Eleven inches, layer by layer.</h2>
            <p className="body">An {M.mattressHeight} mattress and a {M.topperHeight} topper, made as one system.</p>
            <Layers />
          </div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="center-head">
            <h2 className="h2">In full color.</h2>
            <p className="body" style={{ marginTop: 24 }}>
              Natural mattresses are almost always white. The Ashbury comes in five colors drawn from the English countryside, made to be seen.
            </p>
          </div>
          <div className="m-colors">
            {M.colors.map((c) => (
              <figure className="m-color" key={c.id}>
                <div className="m-color-img"><Photo src={c.swatch} label={`${c.label} fabric, hand-tufted`} sizes="(max-width: 960px) 50vw, 20vw" /></div>
                <figcaption className="card-name">{c.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap center-head">
          <h2 className="h2">Soft or firm.</h2>
          <p className="body" style={{ marginTop: 24 }}>
            Both share the same materials and construction. <strong>Soft</strong> has a deeper, more cushioned top for side sleepers and anyone who likes to sink in. <strong>Firm</strong> is more supportive and even, for back and stomach sleepers.
          </p>
          <p className="fine pending">{P.feel}</p>
        </div>
      </section>

      <section className="statement mat-leave statement-sm">
        <p>What we leave out.</p>
        <ul className="leave-list">
          {["No foam.", "No latex.", "No chemical flame retardants.", "No glue."].map((x) => <li key={x}>{x}</li>)}
        </ul>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 64 }}>
            <div className="eyebrow">Certifications and safety</div>
          </div>
          <Columns
            items={[
              ["GOTS", <>Organic wool and organic cotton. Made by a GOTS-certified manufacturer ({M.gotsManufacturer}).</>],
              ["OEKO-TEX", "Swedish horsehair and cashmere (Standard 100), tested for harmful substances."],
              ["Fire safety", <>Meets US federal mattress flammability standards without chemical flame retardants; wool provides the natural barrier. {P.fireReport}</>],
            ]}
          />
        </div>
      </section>

      <section className="statement">
        <p>Sleep on it.</p>
        <span className="body statement-body">30 nights to be sure, with free return pickup and a full refund. A lifetime limited warranty to keep it.</span>
        <div className="btns" style={{ justifyContent: "center", marginTop: 0 }}>
          <Link href={MATTRESS_PATH} className="btn light">Shop the Ashbury</Link>
          <Link href={GUARANTEE_PATH} className="btn outline-light">Guarantee &amp; warranty</Link>
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
              ["What is Living Wool?", <p className="body small" key="1">Our name for the organic wool from Lanas Trinidad in Uruguay that forms the comfort layers of the Ashbury topper.</p>],
              ["Is the horsehair ethically sourced?", <p className="body small" key="2">Yes. It comes from tail clippings in Sweden. No horse is harmed.</p>],
              ["Why no foam or latex?", <p className="body small" key="3">Natural fibers let air move, manage moisture and recover their shape. We&apos;d rather build a mattress that settles in over time than one engineered to feel soft on day one.</p>],
              ["How is it fire-safe without chemical flame retardants?", <p className="body small" key="4">Wool is naturally flame-resistant, so it does the work chemical treatments do in many mattresses. The Ashbury meets US federal flammability standards. {P.fireReportShort}</p>],
              ["Will it settle?", <p className="body small" key="5">Wool and horsehair gently conform to you over the first months, which is normal. Rotating the mattress 180° every 3–6 months keeps it even.</p>],
              ["How do I care for it?", <p className="body small" key="6">Rotate every 3–6 months, air it occasionally by removing the bedding for an hour, and spot clean only. A breathable mattress protector is recommended from the first night.</p>],
            ]}
          />
        </div>
      </section>

      <section className="sec mat-next">
        <div className="wrap center-head">
          <p className="body">Explore what goes into our furniture: <Link href={FURNITURE_MATERIALS_PATH} className="inl">Furniture Materials →</Link></p>
          <Link href={MATERIALS_PATH} className="ulink">All materials</Link>
        </div>
      </section>
    </main>
  );
}
