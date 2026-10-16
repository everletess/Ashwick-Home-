// Sections shared by the mattress page, the Living Wool page and the Guarantee & warranty page.
// Copy is final (from the mattress handoff); values come from lib/mattress.ts.
import { Photo } from "@/components/photo";
import { MATTRESS, MATTRESS_PENDING } from "@/lib/mattress";

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

// Where the cashmere sits within the topper is to confirm; it is listed after the shell.
const TOPPER = ["Quilted organic cotton shell (GOTS)", "Cashmere (OEKO-TEX Standard 100)", "Living Wool surface", "Living Wool + Swedish horsehair"];
const CORE = [
  "Living Wool + horsehair comfort layer, hand-tufted with wool rosettes",
  "Organic wool (GOTS)",
  "Organic cotton (GOTS)",
  "Double-tempered steel pocket coils",
  "Organic cotton (GOTS)",
  "Organic wool (GOTS)",
];

/** The cutaway beside the layer list, then "No foam. Not even latex." */
export function Construction() {
  return (
    <>
      <section className="sec">
        <div className="wrap proc">
          <div className="proc-v">
            <Photo src="mattress-cutaway" label="Cutaway of the Ashbury showing the topper, the tufted comfort layers and the pocket coils" sizes="(max-width: 960px) 100vw, 50vw" />
          </div>
          <div className="proc-t">
            <div className="eyebrow">Construction</div>
            <div className="layers">
              <div>
                <h3 className="layers-h">Topper — {M.topperHeight}</h3>
                <ul className="layers-l">{TOPPER.map((l) => <li key={l}>{l}</li>)}</ul>
              </div>
              <div>
                <h3 className="layers-h">Mattress — {M.mattressHeight}</h3>
                <ul className="layers-l">{CORE.map((l, i) => <li key={i}>{l}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="sec linen">
        <div className="wrap center-head">
          <h2 className="h2">No foam. Not even latex.</h2>
          <p className="body" style={{ marginTop: 24 }}>
            No foam, no latex, no chemical flame retardants and no glue. The layers are held in place by hand-placed wool rosettes.
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
  ["Flammability", <>Federal standards met without chemical flame retardants {MATTRESS_PENDING.flammabilityReportShort}.</>],
];
