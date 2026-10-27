// Sections shared by the mattress page, the Living Wool page and the Guarantee & warranty page.
// Copy is final (from the mattress handoff); values come from lib/mattress.ts.
import Link from "next/link";
import { Photo } from "@/components/photo";
import { ASHBURY_PATH, FURNITURE_MATERIALS_PATH } from "@/lib/materials";
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
// Each layer links to its entry on Inside the Ashbury (lib/materials.ts ASHBURY_GROUPS, ids are the anchors).
// The core's organic wool has no entry of its own, so it goes to the wool entry, Living Wool. Coir and agave are
// described on Furniture materials, so those two link there.
const TOPPER: [string, string][] = [
  ["Cashmere (OEKO-TEX Standard 100)", "cashmere"],
  ["Living Wool (GOTS, OEKO-TEX)", "living-wool"],
  ["Swedish horsehair (OEKO-TEX)", "horsehair"],
  ["Hand-tufted with wool rosettes", "hand-tufting"],
];
const CORE: [string, string][] = [
  ["Organic wool (GOTS)", "living-wool"],
  ["Organic cotton (GOTS)", "organic-cotton"],
  ["Double-tempered steel pocket coils", "pocket-coils"],
  ["Coconut coir", "coir"],
  ["Agave", "agave"],
  ["Organic cotton (GOTS)", "organic-cotton"],
  ["Organic wool (GOTS)", "living-wool"],
];

const ON_FURNITURE_PAGE = ["coir", "agave"];
const LayerLink = ({ label, id }: { label: string; id: string }) => (
  <li><Link href={`${ON_FURNITURE_PAGE.includes(id) ? FURNITURE_MATERIALS_PATH : ASHBURY_PATH}#${id}`} className="layer-link">{label}</Link></li>
);

/** Topper and mattress layer lists, with the cover across both. Each layer links to its material on Inside the Ashbury. */
export function Layers() {
  return (
    <div className="layers">
      <div>
        <h3 className="layers-h">Topper — {M.topperHeight}</h3>
        <ul className="layers-l">{TOPPER.map(([l, id]) => <LayerLink key={l} label={l} id={id} />)}</ul>
      </div>
      <div>
        <h3 className="layers-h">Mattress — {M.mattressHeight}</h3>
        <ul className="layers-l">{CORE.map(([l, id], i) => <LayerLink key={i} label={l} id={id} />)}</ul>
      </div>
      <div className="layers-cover">
        <h3 className="layers-h">Cover</h3>
        <ul className="layers-l">
          <LayerLink label="Super soft 100% organic cotton twill (GOTS) over the entire mattress, in five colors with GOTS-approved plant dyes" id="organic-cotton" />
        </ul>
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
            <Photo src="mattress-layers" label="The Ashbury's layers stacked: the tufted topper folded back over wool and horsehair, then organic cotton, wool, pocket coils, coconut coir, agave, cotton, wool and the cotton twill base" sizes="(max-width: 960px) 100vw, 50vw" />
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
/** Soft and Firm side by side, each with a hand pressing into the top. Used on the product page and Inside the Ashbury. */
export function Feels() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="center-head">
          <h2 className="h2">Soft or firm.</h2>
          <p className="body" style={{ marginTop: 24 }}>Both feels share the same materials and construction.</p>
        </div>
        <div className="grid2 m-feels">
          <figure className="m-feel">
            <div className="m-feel-img"><Photo src="mattress-feel-soft" label="A hand sinking into the Soft Ashbury" sizes="(max-width: 960px) 100vw, 50vw" /></div>
            <figcaption>
              <h3 className="proc-h">Soft</h3>
              <p className="body">A deeper, more cushioned top for side sleepers and anyone who likes to sink in.</p>
            </figcaption>
          </figure>
          <figure className="m-feel">
            <div className="m-feel-img"><Photo src="mattress-feel-firm" label="A hand resting on the Firm Ashbury" sizes="(max-width: 960px) 100vw, 50vw" /></div>
            <figcaption>
              <h3 className="proc-h">Firm</h3>
              <p className="body">More supportive and even, for back and stomach sleepers.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

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
  ["OEKO-TEX", "Every textile and fill is OEKO-TEX Standard 100 certified: the cashmere, horsehair, wool and organic cotton."],
  ["Flammability", <>Federal standards met without chemical flame retardants.</>],
];
