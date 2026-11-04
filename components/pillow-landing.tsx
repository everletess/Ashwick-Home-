"use client";

// The Pillows landing page (Tessa's brief, round 2): hero, quiz, the three pillows, what's inside, field to pillow,
// compare, the cover, complete the bed and FAQs. The materials panels are also used on each pillow's own page.
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/buy-icons";
import { useCart } from "@/components/cart";
import { QuickAddSheet } from "@/components/catalog-card";
import { Accordion } from "@/components/mattress";
import { Photo } from "@/components/photo";
import { Price } from "@/components/sale";
import { CATALOG } from "@/lib/catalog";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { PHOTOS, type PhotoKey } from "@/lib/photos";
import {
  PILLOW_COVERS, PILLOW_COVER_PHOTOS, PILLOW_ID, PILLOW_MATERIALS, PILLOW_RETURNS, PILLOW_SIZES, PILLOW_STANDALONE_FILLS,
  PILLOW_STORY, PILLOW_TRY_TWO, bestForText, pillowFromPrice, pillowPrice, type SleepPosition,
} from "@/lib/pillow";
import { fmt } from "@/lib/products";
import { SLEEP_SUITE, pillowSizeNameFor, salePrice } from "@/lib/sale";

/** The brief's order: Horsehair, Latex, Cotton (cards, compare and tabs). */
const ORDER = ["living-wool-horse-hair", "living-wool-latex", "organic-cotton"];
const FILLS = [...PILLOW_STANDALONE_FILLS].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
const fillById = (id: string) => FILLS.find((f) => f.id === id) ?? FILLS[0];
const sizeShort = (label: string) => label.split(" ")[0];
/** The quiz tells the comparison which pillow it picked, so that column can be highlighted. */
const PICK_EVENT = "aw-pillow-pick";

/** Simple line icons for how someone sleeps. */
export function SleepIcon({ pos, size = 28 }: { pos: SleepPosition; size?: number }) {
  return (
    <svg className="pl-sleep-ico" width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="21" width="27" height="5" rx="1.5" />
      <rect x="3.5" y="17.5" width="7.5" height="3.5" rx="1.75" />
      {pos === "back" && <><circle cx="7.2" cy="13.8" r="2.9" /><path d="M10.6 15.8h16.4M27 15.8v-3.4" /></>}
      {pos === "side" && <><circle cx="7.2" cy="13.8" r="2.9" /><path d="M10.6 15.4c3.6 0 5.4-3.6 8.6-3.6 2.6 0 3 3.8 8 3.8M19.2 11.8l2.6 4" /></>}
      {pos === "stomach" && <><circle cx="7.2" cy="14.4" r="2.9" /><path d="M10.6 17h16.4M27 17l1.8 2.4M8 17.3h2" /></>}
    </svg>
  );
}

function FeelIcon({ id }: { id: string }) {
  return (
    <svg className="pl-sleep-ico" width={28} height={28} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {id === "soft" && <path d="M8 21a5 5 0 0 1 .5-10 7 7 0 0 1 13.4 1.6A4.3 4.3 0 0 1 23 21z" />}
      {id === "shape" && <><rect x="6" y="10" width="20" height="12" rx="3" /><path d="M10 10v12M16 10v12M22 10v12" /></>}
      {id === "fresh" && <path d="M5 13c3-3 5-3 8 0s5 3 8 0 5-3 6-1M5 20c3-3 5-3 8 0s5 3 8 0 5-3 6-1" />}
    </svg>
  );
}

/** A 5-dot meter. Read out as "Feel: 4 of 5, soft to firm". */
export function Meter({ value, low, high, label }: { value: number; low: string; high: string; label: string }) {
  return (
    <span className="pl-meter" role="img" aria-label={`${label}: ${value} of 5, ${low.toLowerCase()} to ${high.toLowerCase()}`}>
      <span className="pl-meter-end">{low}</span>
      <span className="pl-meter-dots">{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= value ? "on" : ""} />)}</span>
      <span className="pl-meter-end">{high}</span>
    </span>
  );
}

function BestFor({ positions }: { positions: SleepPosition[] }) {
  return (
    <span className="pl-best">
      <span className="pl-best-icos">{positions.map((p) => <SleepIcon key={p} pos={p} size={24} />)}</span>
      <span>Best for {bestForText(positions).toLowerCase()}</span>
    </span>
  );
}

function CoverDots({ value, onChange, label = "Cover color" }: { value: string; onChange: (id: string) => void; label?: string }) {
  return (
    <ul className="pl-dots" aria-label={label}>
      {PILLOW_COVERS.map((c) => (
        <li key={c.id}>
          <button type="button" title={c.label} aria-label={c.label} aria-pressed={value === c.id} className={value === c.id ? "on" : ""} onClick={() => onChange(c.id)}>
            <span style={{ backgroundImage: `url(${PHOTOS[c.swatch].src})` }} />
          </button>
        </li>
      ))}
    </ul>
  );
}

function useAddPillow() {
  const cart = useCart();
  return (fillId: string, sizeId: string, coverId: string) => {
    const fill = fillById(fillId);
    const size = PILLOW_SIZES.find((s) => s.id === sizeId) ?? PILLOW_SIZES[0];
    const cover = PILLOW_COVERS.find((c) => c.id === coverId) ?? PILLOW_COVERS[0];
    const shot = PILLOW_COVER_PHOTOS[cover.id as keyof typeof PILLOW_COVER_PHOTOS]?.photo as PhotoKey | undefined;
    cart.add({
      id: PILLOW_ID, name: "The Ashwick Pillow", photo: shot ?? "pillow-hero", price: pillowPrice(fill.id, size.id), qty: 1, mode: "As designed",
      options: [["Fill", fill.label], ["Size", size.label], ["Cover color", cover.label]],
    });
  };
}

/* 1 · Hero */

/** Hero photo (Tessa, 04/11): the four cover colors stacked on a wooden stool in warm light. */
const HERO: { photo: PhotoKey; alt: string } = { photo: "pillows-hero", alt: "Four Ashwick pillows in Fleece, Flax, Sorrel and Flint stacked on a rustic wooden stool in warm sunlight" };

export function PillowHero() {
  return (
    <>
      <section className="pl-hero">
        {/* Phones: the photo, then the words on a dark band below it. Desktop: the words over the photo, on the left. */}
        <div className="pl-hero-media"><Photo src={HERO.photo} label={HERO.alt} className="pl-hero-img" fill preload sizes="100vw" /></div>
        <div className="pl-hero-scrim" />
        <div className="pl-hero-txt">
          <div className="eyebrow">The Ashwick Pillow</div>
          <h1 className="pl-hero-h">Rest your head on something real.</h1>
          <p className="pl-hero-sub">Three natural fills, handmade to order in the USA, in a removable organic cotton cover.</p>
          <div className="pl-hero-btns">
            <a href="#find" className="btn light">Find your pillow</a>
            <a href="#pillows" className="btn outline-light">Shop all three</a>
          </div>
        </div>
      </section>
      <ul className="pl-trust wrap">
        <li><Icon name="hand" size={20} />Handmade in the USA</li>
        <li><Icon name="truck" size={20} />Ships in 1–2 days</li>
        <li><Icon name="returns" size={20} />{PILLOW_RETURNS.short}</li>
        <li>
          <svg className="icon" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M4 8l3-3h10l3 3M9 12h6" /></svg>
          Removable organic cotton cover
        </li>
      </ul>
    </>
  );
}

/* 2 · Find your pillow */

const POSITIONS: { id: SleepPosition; label: string }[] = [{ id: "back", label: "Back" }, { id: "side", label: "Side" }, { id: "stomach", label: "Stomach" }];
// Each feel points at a fill using only what that fill's own description says.
const FEELS: { id: string; label: string; pick: string; why: string }[] = [
  { id: "soft", label: "Soft and light", pick: "organic-cotton", why: "Certified organic cotton is soft and breathable, from the stuffing to the case." },
  { id: "shape", label: "Holds its shape", pick: "living-wool-horse-hair", why: "Horsehair holds its structure for years, and its hollow strands move air and wick moisture." },
  { id: "fresh", label: "Cool and springy", pick: "living-wool-latex", why: "Shredded organic latex is breathable and buoyant, with organic Living Wool around it." },
];
/** Bed sizes the Ashbury comes in, for the size recommendation. */
const BEDS = MATTRESS.sizes.map((s) => ({ id: s.id, label: s.label }));

export function PillowQuiz() {
  const add = useAddPillow();
  const [pos, setPos] = useState<SleepPosition | null>(null);
  const [feel, setFeel] = useState<string | null>(null);
  const [bed, setBed] = useState<string | null>(null);
  const [cover, setCover] = useState<string>("mocha");
  const [added, setAdded] = useState(false);
  const pick = FEELS.find((f) => f.id === feel);
  const fill = pick && pos ? fillById(pick.pick) : null;
  const sizeName = bed ? pillowSizeNameFor(bed) : "";
  const size = PILLOW_SIZES.find((s) => s.label.startsWith(sizeName || "Standard")) ?? PILLOW_SIZES[0];

  useEffect(() => {
    if (fill) window.dispatchEvent(new CustomEvent(PICK_EVENT, { detail: fill.id }));
  }, [fill]);

  const story = fill ? PILLOW_STORY[fill.id] : null;
  const shot = PILLOW_COVER_PHOTOS[cover as keyof typeof PILLOW_COVER_PHOTOS] ?? PILLOW_COVER_PHOTOS.mocha;

  return (
    <section className="pl-quiz wrap" id="find" aria-labelledby="pl-quiz-h">
      <div className="pl-head">
        <div className="eyebrow">Find your pillow</div>
        <h2 className="h2" id="pl-quiz-h">Two questions. One pillow.</h2>
      </div>
      <fieldset className="pl-q">
        <legend>How do you sleep?</legend>
        <div className="pl-tiles">
          {POSITIONS.map((o) => (
            <button key={o.id} type="button" className={"pl-tile" + (pos === o.id ? " on" : "")} aria-pressed={pos === o.id} onClick={() => { setPos(o.id); setAdded(false); }}>
              <SleepIcon pos={o.id} size={40} /><span>{o.label}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="pl-q">
        <legend>What feel do you like?</legend>
        <div className="pl-tiles">
          {FEELS.map((o) => (
            <button key={o.id} type="button" className={"pl-tile" + (feel === o.id ? " on" : "")} aria-pressed={feel === o.id} onClick={() => { setFeel(o.id); setAdded(false); }}>
              <FeelIcon id={o.id} /><span>{o.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {fill && story && pick && (
        <div className="pl-result" role="status">
          <div className="pl-result-img"><Photo src={shot.photo as PhotoKey} label={shot.alt} fill sizes="(max-width: 760px) 100vw, 420px" /></div>
          <div className="pl-result-t">
            <p className="eyebrow">Our pick for you</p>
            <h3 className="pl-result-h"><Link href={fill.path}>{fill.label}</Link></h3>
            <p className="pl-result-why">
              {pick.why}
              {story.bestFor.includes(pos!) ? ` A good fit for ${pos} sleepers.` : ""} The fill is adjustable, so you can add or remove fill to set your own height.
            </p>
            <p className="pl-q-l">What size is your bed?</p>
            <div className="pl-chips">
              {BEDS.map((b) => (
                <button key={b.id} type="button" className={bed === b.id ? "on" : ""} aria-pressed={bed === b.id} onClick={() => setBed(b.id)}>{b.label}</button>
              ))}
            </div>
            <p className="pl-result-size">
              {bed ? <>Recommended size: <strong>{size.label.replace("x", " × ")} in</strong></> : <>Pick your bed and we&rsquo;ll recommend a size. Standard 20 × 26 in fits most.</>}
            </p>
            <p className="pl-q-l">Cover color</p>
            <CoverDots value={cover} onChange={setCover} />
            <div className="pl-result-buy">
              <span className="pl-price"><Price price={pillowPrice(fill.id, size.id)} /></span>
              <button type="button" className="btn" onClick={() => { add(fill.id, size.id, cover); setAdded(true); }}>{added ? "Added to cart" : "Add to cart"}</button>
            </div>
            {PILLOW_TRY_TWO && <p className="pl-try-two">Not sure? Order two fills and keep the one you love. Returns within {PILLOW_RETURNS.days} days.</p>}
          </div>
        </div>
      )}
    </section>
  );
}

/* 3 · The three pillows */

function PillowCard({ fillId, priority }: { fillId: string; priority?: boolean }) {
  const add = useAddPillow();
  const f = fillById(fillId);
  const s = PILLOW_STORY[fillId];
  const [size, setSize] = useState<string>(PILLOW_SIZES[0].id);
  const [cover, setCover] = useState<string>(s.cover);
  const [added, setAdded] = useState(false);
  const photo = cover === s.cover ? s.card : (PILLOW_COVER_PHOTOS[cover as keyof typeof PILLOW_COVER_PHOTOS]?.photo as PhotoKey);
  return (
    <article className="pl-card">
      <Link href={f.path} className="pl-card-img" aria-label={f.label}>
        <Photo src={photo} label={s.cardAlt} fill sizes="(max-width: 760px) 86vw, 380px" preload={priority} />
        {photo === s.card && <Photo src={s.hover} label="" className="alt" fill sizes="(max-width: 760px) 86vw, 380px" />}
      </Link>
      <div className="pl-card-b">
        <h3 className="pl-card-h"><Link href={f.path}>{f.label}</Link></h3>
        <p className="pl-card-p">{s.personality}</p>
        <BestFor positions={s.bestFor} />
        <Meter value={s.feel} low="Soft" high="Firm" label="Feel" />
        <p className="pl-price"><Price price={pillowFromPrice(fillId)} from /></p>
        <div className="pl-chips" role="group" aria-label="Size">
          {PILLOW_SIZES.map((z) => (
            <button key={z.id} type="button" className={size === z.id ? "on" : ""} aria-pressed={size === z.id} onClick={() => { setSize(z.id); setAdded(false); }}>{sizeShort(z.label)}</button>
          ))}
        </div>
        <CoverDots value={cover} onChange={(c) => { setCover(c); setAdded(false); }} />
        <button type="button" className="btn full pl-quick" onClick={() => { add(fillId, size, cover); setAdded(true); }}>
          {added ? "Added to cart" : <>Quick add · {fmt(salePrice(pillowPrice(fillId, size)))}</>}
        </button>
      </div>
    </article>
  );
}

export function PillowCards() {
  return (
    <section className="pl-cards-sec" id="pillows" aria-labelledby="pl-cards-h">
      <div className="pl-head wrap">
        <div className="eyebrow">The three pillows</div>
        <h2 className="h2" id="pl-cards-h">One pillow, three fills.</h2>
      </div>
      <ul className="pl-cards">
        {FILLS.map((f, i) => <li key={f.id}><PillowCard fillId={f.id} priority={i === 0} /></li>)}
      </ul>
    </section>
  );
}

/* 4 · What's inside */

/** One panel per material, alternating sides on desktop. `fill` shows only the materials in that pillow (and its cover). */
export function PillowMaterials({ fill, heading = true }: { fill?: string; heading?: boolean }) {
  const items = fill ? PILLOW_MATERIALS.filter((m) => m.in.includes(fill) || m.in.includes("cover")) : PILLOW_MATERIALS;
  const inText = (m: (typeof PILLOW_MATERIALS)[number]) =>
    m.in.map((id) => (id === "cover" ? "every cover" : fillById(id).label)).join(", ").replace(/, ([^,]*)$/, " and $1");
  return (
    <section className="pl-mat-sec" aria-labelledby={heading ? "pl-mat-h" : undefined} aria-label={heading ? undefined : "What's inside"}>
      <div className="pl-head wrap">
        <div className="eyebrow">What&rsquo;s inside</div>
        {heading && <h2 className="h2" id="pl-mat-h">Materials you can trace.</h2>}
      </div>
      {items.map((m, i) => (
        <article key={m.id} className={"pl-mat wrap" + (i % 2 ? " rev" : "")}>
          <div className="pl-mat-img">
            <Photo src={m.photo} label={m.alt} fill sizes="(max-width: 860px) 100vw, 50vw" />
            {m.inset && <div className="pl-mat-inset"><Photo src={m.inset} label={m.insetAlt ?? ""} fill sizes="200px" /></div>}
          </div>
          <div className="pl-mat-t">
            <p className="eyebrow">{m.name}</p>
            <h3 className="pl-mat-h">{m.headline}</h3>
            <p className="body">{m.copy}</p>
            <p className="pl-mat-meta"><span className="pl-badge">{m.cert}</span><span>In {inText(m)}.</span></p>
          </div>
        </article>
      ))}
    </section>
  );
}

/* 5 · From the field to your pillow */

const STEPS: { title: string; photo: PhotoKey; alt: string }[] = [
  { title: "Grown", photo: "materials-sheep", alt: "Sheep grazing on a green pasture" },
  { title: "Cleaned & carded", photo: "materials-wool", alt: "Raw cream wool, pulled apart" },
  { title: "Filled by hand", photo: "workshop-mattress", alt: "A craftsperson working by hand in the Ashwick workshop" },
  { title: "To your door in 1–2 days", photo: "pillow-stack-ledge", alt: "Four finished Ashwick pillows stacked on a travertine ledge" },
];

export function FieldStrip() {
  return (
    <section className="pl-field" aria-labelledby="pl-field-h">
      <div className="pl-head wrap">
        <div className="eyebrow">How it&rsquo;s made</div>
        <h2 className="h2" id="pl-field-h">From the field to your pillow.</h2>
      </div>
      <ol className="pl-steps">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <div className="pl-step-img"><Photo src={s.photo} label={s.alt} fill sizes="(max-width: 760px) 70vw, 320px" /></div>
            <p className="pl-step-n">{String(i + 1).padStart(2, "0")}</p>
            <p className="pl-step-t">{s.title}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* 6 · Compare the fills */

export function CompareFills() {
  const [picked, setPicked] = useState<string | null>(null);
  const [tab, setTab] = useState<string>(FILLS[0].id);
  const [quick, setQuick] = useState<string | null>(null);
  useEffect(() => {
    const on = (e: Event) => { const id = (e as CustomEvent<string>).detail; setPicked(id); setTab(id); };
    window.addEventListener(PICK_EVENT, on);
    return () => window.removeEventListener(PICK_EVENT, on);
  }, []);

  const rows: [string, (id: string) => React.ReactNode][] = [
    ["Feel", (id) => <Meter value={PILLOW_STORY[id].feel} low="Soft" high="Firm" label="Feel" />],
    ["Feels like", (id) => <>&ldquo;{PILLOW_STORY[id].feelsLike}&rdquo;</>],
    ["Temperature", (id) => <Meter value={PILLOW_STORY[id].temp} low="Warm" high="Cool" label="Temperature" />],
    ["Best for", (id) => <BestFor positions={PILLOW_STORY[id].bestFor} />],
    ["Good to know", (id) => PILLOW_STORY[id].goodToKnow],
    ["Certifications", (id) => <span className="pl-badges">{PILLOW_STORY[id].certs.map((c) => <span key={c} className="pl-badge">{c}</span>)}</span>],
    ["From", (id) => <span className="pl-price"><Price price={pillowFromPrice(id)} /></span>],
  ];
  const head = (id: string) => (
    <Link href={fillById(id).path} className="pl-cmp-head">
      <span className="pl-cmp-img"><Photo src={PILLOW_STORY[id].card} label={PILLOW_STORY[id].cardAlt} fill sizes="160px" /></span>
      <span className="pl-cmp-name">{fillById(id).label}</span>
    </Link>
  );
  const addBtn = (id: string) => <button type="button" className="btn full" onClick={() => setQuick(id)}>Add to cart</button>;

  return (
    <section className="pl-cmp wrap" aria-labelledby="pl-cmp-h">
      <div className="pl-head">
        <div className="eyebrow">Compare the fills</div>
        <h2 className="h2" id="pl-cmp-h">Side by side.</h2>
      </div>
      <table className="pl-cmp-table">
        <thead>
          <tr><td />{FILLS.map((f) => <th key={f.id} scope="col" className={picked === f.id ? "pick" : ""}>{picked === f.id && <span className="pl-pick">Your pick</span>}{head(f.id)}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(([label, cell]) => (
            <tr key={label}><th scope="row">{label}</th>{FILLS.map((f) => <td key={f.id} className={picked === f.id ? "pick" : ""}>{cell(f.id)}</td>)}</tr>
          ))}
          <tr><td />{FILLS.map((f) => <td key={f.id} className={picked === f.id ? "pick" : ""}>{addBtn(f.id)}</td>)}</tr>
        </tbody>
      </table>
      <div className="pl-cmp-tabs">
        <div className="pl-cmp-tablist" role="tablist" aria-label="Pillows">
          {FILLS.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={tab === f.id} className={tab === f.id ? "on" : ""} onClick={() => setTab(f.id)}>
              {f.label.replace("Living Wool + ", "Wool + ").replace("100% ", "")}{picked === f.id ? " ★" : ""}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="pl-cmp-panel">
          {head(tab)}
          <dl>{rows.map(([label, cell]) => <div key={label}><dt>{label}</dt><dd>{cell(tab)}</dd></div>)}</dl>
          {addBtn(tab)}
        </div>
      </div>
      {quick && <QuickAddSheet kind="pillow" href={fillById(quick).path} fill={quick} onClose={() => setQuick(null)} />}
    </section>
  );
}

/* 7 · The cover */

export function CoverSection() {
  return (
    <section className="pl-cover wrap" aria-labelledby="pl-cover-h">
      <div className="pl-cover-img"><Photo src="pillow-covers" label="Cream pillows beside folded removable covers in Sorrel, Fleece, Flint and Flax" fill sizes="(max-width: 860px) 100vw, 50vw" /></div>
      <div className="pl-cover-t">
        <div className="eyebrow">The cover</div>
        <h2 className="h2" id="pl-cover-h">A removable organic cotton cover in four colors, made to match your Ashbury.</h2>
        <ul className="pl-swatches">
          {PILLOW_COVERS.map((c) => (
            <li key={c.id}><span style={{ backgroundImage: `url(${PHOTOS[c.swatch].src})` }} />{c.label}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 8 · Complete the bed */

export function CompleteBedPair() {
  const suite = CATALOG.find((c) => c.id === "sleep-suite");
  const items: { href: string; photo: PhotoKey; alt: string; name: string; line: string; price: React.ReactNode }[] = [
    ...(suite ? [{ href: SLEEP_SUITE.path, photo: suite.photo, alt: SLEEP_SUITE.alt, name: SLEEP_SUITE.name, line: "Two pillows included, with free white glove delivery.", price: <>From {suite.nowPrice != null && suite.nowPrice !== suite.price && <s className="price-was">{fmt(suite.price)}</s>}<span className="price-now">{fmt(suite.nowPrice ?? suite.price)}</span></> }] : []),
    { href: MATTRESS_PATH, photo: MATTRESS.colors.find((c) => c.id === "dove")?.photos[0] ?? MATTRESS.colors[0].photos[0], alt: "The Ashbury mattress in Flint", name: MATTRESS.title, line: MATTRESS.collection, price: <Price price={Math.min(...MATTRESS.sizes.map((s) => s.price))} from /> },
  ];
  return (
    <section className="pl-bed wrap" aria-labelledby="pl-bed-h">
      <div className="pl-head">
        <div className="eyebrow">Complete the bed</div>
        <h2 className="h2" id="pl-bed-h">Made to go together.</h2>
      </div>
      <div className="pl-bed-grid">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="pl-bed-card">
            <span className="pl-bed-img"><Photo src={it.photo} label={it.alt} fill sizes="(max-width: 760px) 100vw, 560px" /></span>
            <span className="pl-bed-name">{it.name}</span>
            <span className="pl-bed-line">{it.line}</span>
            <span className="pl-price">{it.price}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* 9 · FAQs (reviews stay hidden until there are at least three real pillow reviews) */

export function PillowFaq() {
  const items: [string, React.ReactNode][] = [
    ["Which pillow is right for side sleepers?", <p key="a">The {fillById("living-wool-latex").label} is our pick for side sleepers. Every fill is adjustable: add or remove fill to set your own height and firmness, whether you sleep on your back, side or stomach.</p>],
    ["What size do I need for my bed?", <p key="b">Standard 20 × 26 in for a Twin XL or Full, Queen 20 × 30 in for a Queen, and King 20 × 36 in for a King or Cal King.</p>],
    ["How do I wash the cover?", <p key="c">The removable cover washes in cold water and should be line dried. Do not machine wash the pillow itself; air it out in the sun to refresh it.</p>],
    ["Is there a smell when it arrives?", <p key="d">You may notice a slight, natural odor when you first unpack a new pillow. It is harmless and fades on its own within about a week, or a few extra days in a humid climate.</p>],
    [`Can I return a pillow?`, <p key="e">{PILLOW_RETURNS.full}</p>],
    ["How fast does it ship?", <p key="f">Fast, free delivery. Each pillow is handmade to order in the USA and ships within 1–2 business days.</p>],
  ];
  return (
    <section className="pl-faq wrap" aria-labelledby="pl-faq-h">
      <div className="pl-head">
        <div className="eyebrow">Questions</div>
        <h2 className="h2" id="pl-faq-h">Good to know.</h2>
      </div>
      <Accordion items={items} />
    </section>
  );
}
