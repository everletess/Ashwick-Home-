"use client";

import Link from "next/link";
import { useState } from "react";
import { PILLOW_COMPARE, PILLOW_STANDALONE_FILLS, pillowFromPrice } from "@/lib/pillow";
import { SALE, salePrice } from "@/lib/sale";
import { fmt } from "@/lib/products";

const FILLS = PILLOW_STANDALONE_FILLS;
const byId = (id: string) => FILLS.find((f) => f.id === id)!;

/** How they compare: a table on desktop, swipeable cards on a phone. */
export function PillowCompare() {
  return (
    <div className="pillow-compare">
      <h2>How they compare</h2>
      <table className="terms-table pc-table">
        <thead>
          <tr><th scope="col">Pillow</th><th scope="col">Fill</th><th scope="col">Feel</th><th scope="col">Good to know</th></tr>
        </thead>
        <tbody>
          {FILLS.map((f) => (
            <tr key={f.id}>
              <th scope="row"><Link href={f.path}>{f.label}</Link></th>
              <td>{PILLOW_COMPARE[f.id].fill}</td>
              <td>{PILLOW_COMPARE[f.id].feel}</td>
              <td>{PILLOW_COMPARE[f.id].notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="rail pc-cards">
        {FILLS.map((f) => {
          const from = pillowFromPrice(f.id);
          return (
            <li key={f.id}>
              <Link href={f.path} className="pc-card">
                <span className="pc-name">{f.label}</span>
                <span className="pc-price">From {SALE.active && <s className="price-was">{fmt(from)}</s>}{fmt(salePrice(from))}</span>
                <dl>
                  <dt>Fill</dt><dd>{PILLOW_COMPARE[f.id].fill}</dd>
                  <dt>Feel</dt><dd>{PILLOW_COMPARE[f.id].feel}</dd>
                  <dt>Good to know</dt><dd>{PILLOW_COMPARE[f.id].notes}</dd>
                </dl>
                <span className="pc-go">View this pillow →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Each answer points at a fill using only what the fill's own description says (see PILLOW_COMPARE in lib/pillow.ts).
const FEEL: { id: string; label: string; pick: string; why: string }[] = [
  { id: "soft", label: "Soft and light", pick: "organic-cotton", why: "Certified organic cotton is naturally breathable and soft." },
  { id: "shape", label: "Holds its shape", pick: "living-wool-horse-hair", why: "Horsehair holds its structure for years, and its hollow strands move air and wick moisture." },
  { id: "fresh", label: "Cool and springy", pick: "living-wool-latex", why: "Shredded organic latex is breathable, with organic Living Wool around it." },
];
const POSITION: { id: string; label: string }[] = [
  { id: "back", label: "Back" }, { id: "side", label: "Side" }, { id: "stomach", label: "Stomach" },
];

/** Two questions, one recommendation. All three pillows are medium-firm and adjustable, and the answer says so. */
export function PillowHelper() {
  const [pos, setPos] = useState<string | null>(null);
  const [feel, setFeel] = useState<string | null>(null);
  const pick = FEEL.find((f) => f.id === feel);
  const f = pick ? byId(pick.pick) : null;
  return (
    <section className="pillow-helper" aria-labelledby="ph-h">
      <h2 id="ph-h">Which pillow is right for me?</h2>
      <fieldset>
        <legend>How do you sleep?</legend>
        <div className="ph-opts">
          {POSITION.map((o) => <button key={o.id} type="button" aria-pressed={pos === o.id} className={pos === o.id ? "on" : ""} onClick={() => setPos(o.id)}>{o.label}</button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend>What feel do you like?</legend>
        <div className="ph-opts">
          {FEEL.map((o) => <button key={o.id} type="button" aria-pressed={feel === o.id} className={feel === o.id ? "on" : ""} onClick={() => setFeel(o.id)}>{o.label}</button>)}
        </div>
      </fieldset>
      {f && pick && (
        <div className="ph-result" role="status">
          <p className="ph-r-t">Try the {f.label}.</p>
          <p>{pick.why}</p>
          <p>Every Ashwick pillow is medium-firm, and the fill is adjustable{pos ? `, so as a ${pos} sleeper you can add or remove fill until the height and support suit you` : ": add or remove fill to set your own height and support"}.</p>
          <Link href={f.path} className="btn">View the {f.label} pillow</Link>
        </div>
      )}
    </section>
  );
}
