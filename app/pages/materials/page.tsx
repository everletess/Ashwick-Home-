import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, Columns } from "@/components/mattress";
import { Photo } from "@/components/photo";
import { PageHero } from "@/components/sections";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { ALL_MATERIALS, MATERIAL_GROUPS, MATERIALS_PENDING as P, type Material, type MaterialGroup } from "@/lib/materials";
import type { PhotoKey } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Our Materials",
  description: "Every Ashwick piece is built from materials you'd recognize: wool, horsehair, cotton, linen and solid wood.",
};

const HALF = "(max-width: 960px) 100vw, 50vw";
const MAT = MATTRESS.shortName;

// Copy is final (materials handoff); entries and pending values live in lib/materials.ts.

/** Full-width image band with an eyebrow and heading over it. */
function Band({ photo, alt, eyebrow, title, center }: { photo?: PhotoKey; alt: string; eyebrow?: string; title: string; center?: boolean }) {
  return (
    <section className={"band" + (center ? " band-c" : "")}>
      <Photo src={photo} label={alt} fill sizes="100vw" />
      {photo && <div className="hero-scrim"></div>}
      <div className="band-txt">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 className="h2">{title}</h2>
      </div>
    </section>
  );
}

function Entry({ m, group, rev }: { m: Material; group: string; rev: boolean }) {
  return (
    <article className={"proc mat-entry" + (rev ? " rev" : "")} id={m.id}>
      <div className="proc-v"><Photo src={m.photo} label={m.alt} sizes={HALF} /></div>
      <div className="proc-t">
        <div className="eyebrow">{group}</div>
        <h3 className="proc-h">{m.name}</h3>
        <p className="mat-desc">{m.descriptor}</p>
        <p className="body">{m.body}</p>
        <p className="body small"><strong>Where you&apos;ll find it:</strong> {m.where}</p>
        {m.origin && <p className="fine mat-origin">{m.origin}</p>}
      </div>
    </article>
  );
}

function Group({ g, offset }: { g: MaterialGroup; offset: number }) {
  return (
    <>
      {g.title && <Band photo={g.photo} alt={g.alt} eyebrow={g.eyebrow} title={g.title} />}
      <section className="sec">
        <div className="wrap process">
          {g.materials.map((m, i) => <Entry key={m.id} m={m} group={g.eyebrow} rev={(offset + i) % 2 === 1} />)}
        </div>
      </section>
    </>
  );
}

export default function MaterialsPage() {
  const offsets = MATERIAL_GROUPS.map((_, i) => MATERIAL_GROUPS.slice(0, i).reduce((n, g) => n + g.materials.length, 0));
  const [fillings, fabrics, structure, finish] = MATERIAL_GROUPS;
  return (
    <main>
      <PageHero
        photo="mattress-mocha-room"
        alt="The mattress in Mocha Mousse on a walnut platform in a warm plaster room"
        eyebrow="Our Materials"
        title="What it's made of is the point."
        body="Every Ashwick piece is built from materials you'd recognize: wool, horsehair, cotton, linen and solid wood. Each one is there because of what it does."
      />

      <section className="sec linen">
        <div className="wrap grid2 mat-intro">
          <div>
            <h2 className="h2">Chosen for what they do.</h2>
            <p className="body" style={{ marginTop: 24 }}>
              A natural material isn&apos;t automatically a good one. We choose each fiber for a job: to cushion, to spring back, to breathe, to hold its shape for years. Then we put it exactly where that job is done.
            </p>
          </div>
          <div>
            <h2 className="h2">Why fiber, not foam.</h2>
            <p className="body" style={{ marginTop: 24 }}>
              Foam is made to feel soft on the showroom floor. Natural fibers work differently. They let air move, carry moisture away and recover their shape, so a piece settles in around you over time. It&apos;s how beds and furniture were made for centuries before foam made them cheaper to produce.
            </p>
          </div>
        </div>
        <nav className="wrap mat-index" aria-label="Materials">
          {ALL_MATERIALS.map((m) => <a key={m.id} href={`#${m.id}`}>{m.short}</a>)}
        </nav>
      </section>

      <Group g={fillings} offset={offsets[0]} />
      <Group g={fabrics} offset={offsets[1]} />
      <Band alt="Cream wool and dark curled horsehair blended together" title="The right fiber, in the right place." center />
      <Group g={structure} offset={offsets[2]} />
      <Group g={finish} offset={offsets[3]} />

      <section className="sec linen">
        <div className="wrap proc">
          <div className="proc-v mat-portrait"><Photo src="materials-rosettes" label="Hand-tied wool rosettes on the quilted top of the mattress in Safari" sizes={HALF} /></div>
          <div className="proc-t">
            <div className="eyebrow">Craft</div>
            <h2 className="proc-h">Made by hand, one piece at a time.</h2>
            <p className="body">
              Natural materials can&apos;t be poured into a mold. Wool has to be layered evenly, horsehair opened and blended, and every layer set by hand. Each Ashwick mattress is hand-tufted: the layers are drawn through with a needle and held with a rosette of wool, so they stay in place without glue. Our furniture is built to order, by hand, in the USA.
            </p>
          </div>
        </div>
      </section>

      <section className="statement mat-leave">
        <p>What we leave out.</p>
        <ul className="leave-list">
          {["No foam.", "No latex.", "No chemical flame retardants.", "No glue.", "No plastic."].map((x) => <li key={x}>{x}</li>)}
        </ul>
        <span className="body statement-body pending-light">{P.latex} {P.glue}</span>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="center-head">
            <h2 className="h2">The combination is the character.</h2>
            <p className="body" style={{ marginTop: 24 }}>No single material makes a piece feel the way it does. It&apos;s the combination, and where each one sits.</p>
          </div>
          <div className="grid2 combo">
            <div className="panel">
              <div className="panel-img"><Photo src="mattress-cutaway" label="Cutaway of the mattress showing its layers" sizes={HALF} /></div>
              <h3 className="proc-h">The {MAT} — {MATTRESS.combinedHeight}</h3>
              <dl className="deflist">
                <div><dt>Topper ({MATTRESS.topperHeight})</dt><dd>Quilted organic cotton shell · cashmere · Living Wool · Living Wool and Swedish horsehair</dd></div>
                <div><dt>Mattress ({MATTRESS.mattressHeight})</dt><dd>Living Wool and horsehair, hand-tufted · organic wool · organic cotton · pocket coils · organic cotton · organic wool</dd></div>
              </dl>
              <Link href={MATTRESS_PATH} className="ulink">Shop the mattress →</Link>
            </div>
            <div className="panel">
              <div className="panel-img"><Photo src="csofa-studio" label="The Cotswold sofa" sizes={HALF} /></div>
              <h3 className="proc-h">Our sofa cushions</h3>
              <dl className="deflist">
                <div><dt>Cushions</dt><dd>{P.sofaCushions}</dd></div>
                <div><dt>Frame</dt><dd>Solid hardwood, finished with natural oils</dd></div>
              </dl>
              <Link href="/collections/sofas" className="ulink">Shop sofas →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 64 }}>
            <div className="eyebrow">Certifications</div>
          </div>
          <Columns
            items={[
              ["GOTS", <>Organic wool and organic cotton. Made by a GOTS-certified manufacturer ({MATTRESS.gotsManufacturer}).</>],
              ["OEKO-TEX", "Swedish horsehair and cashmere (Standard 100), tested for harmful substances."],
              ["Fire safety", <>Our mattress meets US federal flammability standards without chemical flame retardants. {P.fireReport} {P.furnitureFire}</>],
            ]}
          />
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
              ["Why don't you use foam or latex?", <p className="body small" key="1">Natural fibers let air move, manage moisture and recover their shape. We&apos;d rather build pieces that settle in over time than ones engineered to feel soft on day one. <span className="pending-inline">{P.latex}</span></p>],
              ["How are your pieces fire-safe without chemical flame retardants?", <p className="body small" key="2">Wool is naturally flame-resistant, so it does the work that chemical treatments do in many mattresses. The {MAT} meets US federal flammability standards. {P.fireReportShort} {P.furnitureFireShort}</p>],
              ["Is the horsehair ethically sourced?", <p className="body small" key="3">Yes. It comes from tail clippings in Sweden. No horse is harmed.</p>],
              ["Will natural cushions flatten?", <p className="body small" key="4">Natural fills settle gently as they conform to you, which is normal. Plumping cushions and rotating the mattress every 3–6 months keeps them even.</p>],
              ["Do natural materials need special care?", <p className="body small" key="5">Very little. Air the mattress occasionally, spot clean only, and rotate it every few months. Care for each piece is on its product page.</p>],
              ["What is Living Wool?", <p className="body small" key="6">Our name for the organic wool from Lanas Trinidad in Uruguay that forms the comfort layers of the {MAT}.</p>],
            ]}
          />
        </div>
      </section>
    </main>
  );
}
