// Sections shared by the mattress page, the Living Wool page and the Guarantee & warranty page.
// Copy is final (from the mattress handoff); values come from lib/mattress.ts.
import { Photo } from "@/components/photo";
import { MATTRESS } from "@/lib/mattress";

const M = MATTRESS;

/** Disclosure list in the style of the product page's spec rows. */
export function Accordion({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <div className="acc">
      {items.map(([title, body]) => (
        <details className="acc-i" key={title}>
          <summary className="acc-s">
            <span>{title}</span>
            <span className="acc-x" aria-hidden="true" />
          </summary>
          <div className="acc-b">{body}</div>
        </details>
      ))}
    </div>
  );
}

// The topper holds the hand-tufted comfort layers; the cotton twill cover wraps the whole mattress.
const TOPPER = [
  "Cashmere (OEKO-TEX Standard 100)",
  "Living Wool (GOTS)",
  "Swedish horsehair (OEKO-TEX)",
  "Hand-tufted with wool rosettes",
];
const CORE = [
  "Organic wool (GOTS)",
  "Organic cotton (GOTS)",
  "Double-tempered steel pocket coils",
  "Organic cotton (GOTS)",
  "Organic wool (GOTS)",
];

/** Topper and mattress layer lists, with the cover across both. */
export function Layers() {
  return (
    <div className="layers">
      <div>
        <h3 className="layers-h">Topper — {M.topperHeight}</h3>
        <ul className="layers-l">{TOPPER.map((l) => <li key={l}>{l}</li>)}</ul>
      </div>
      <div>
        <h3 className="layers-h">Mattress — {M.mattressHeight}</h3>
        <ul className="layers-l">{CORE.map((l, i) => <li key={i}>{l}</li>)}</ul>
      </div>
      <div className="layers-cover">
        <h3 className="layers-h">Cover</h3>
        <ul className="layers-l"><li>Super soft 100% organic cotton twill (GOTS) over the entire mattress, in five colors with GOTS-approved plant dyes</li></ul>
      </div>
    </div>
  );
}

/** The cutaway beside the layer list, then "No foam. Not even latex." */
export function Construction() {
  return (
    <>
      <section className="sec">
        <div className="wrap proc">
          <div className="proc-v">
            <Photo src="mattress-layers" label="The Ashbury's layers stacked: the tufted topper folded back over wool and horsehair, then wool, pocket coils, wool and the cotton twill base" sizes="(max-width: 960px) 100vw, 50vw" />
          </div>
          <div className="proc-t">
            <div className="eyebrow">Construction</div>
            <Layers />
          </div>
        </div>
      </section>
      <section className="sec linen">
        <div className="wrap center-head">
          <h2 className="h2">No foam. Not even latex.</h2>
          <p className="body" style={{ marginTop: 24 }}>
            No foam, no latex, no chemical flame retardants and no glue. The topper&apos;s layers are held in place by hand-tied wool rosettes.
          </p>
        </div>
      </section>
    </>
  );
}

/** "Built for recovery" heading and paragraph. */
export function Recovery({ eyebrow = true }: { eyebrow?: boolean }) {
  return (
    <div className="center-head">
      {eyebrow && <div className="eyebrow">Built for recovery</div>}
      <h2 className="h2">Sleep is when the body does its quiet work.</h2>
      <p className="body" style={{ marginTop: 24 }}>
        Living Wool is made to support it. It keeps you at an even temperature, keeps the surface dry and gives steady, buoyant support as you move through the night, so you wake rested, not restless.
      </p>
    </div>
  );
}

/** Three short columns with a top rule, as on the Trade page. */
export function Columns({ items, numbered }: { items: [string, React.ReactNode][]; numbered?: boolean }) {
  return (
    <div className="tsteps">
      {items.map(([t, d], i) => (
        <div className="tstep" key={t}>
          {numbered && <div className="proc-n">0{i + 1}</div>}
          <h3 className="proc-h small">{t}</h3>
          <div className="body small">{d}</div>
        </div>
      ))}
    </div>
  );
}

export const CERTIFICATIONS: [string, React.ReactNode][] = [
  ["GOTS", <>GOTS-certified organic wool and cotton, made by a GOTS-certified manufacturer ({M.gotsManufacturer}).</>],
  ["OEKO-TEX", "OEKO-TEX certified horsehair. OEKO-TEX Standard 100 certified cashmere."],
  ["Flammability", <>Federal standards met without chemical flame retardants.</>],
];
