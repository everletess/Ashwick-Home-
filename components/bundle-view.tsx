"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { Photo } from "@/components/photo";
import { OptGroup, Pills } from "@/components/product-view";
import { ShipsFast, TrustRow } from "@/components/buy-icons";
import { StickyBuy } from "@/components/sticky-buy";
import { SwipeGallery, type GalleryShot } from "@/components/swipe-gallery";
import { Stars } from "@/components/reviews";
import { IncIcon } from "@/components/bf-push";
import { fmtWhole } from "@/components/sale";
import { reviewsFor } from "@/lib/reviews";
import type { PhotoKey } from "@/lib/photos";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { DOG_BED } from "@/lib/dog-bed";
import { PHOTOS } from "@/lib/photos";
import { fmt } from "@/lib/products";
import { BUNDLE, BUNDLE_CONFIG, SALE, SLEEP_SUITE, SLEEP_SUITE_BEDDING_NAME, sleepSuitePrice, sleepSuiteLines, bundleMattressDelivery, bundlePrice, pillowSizeFor, pillowSizeNameFor, BUNDLE_PILLOWS, BUNDLE_COVER_BY_MATTRESS_COLOR } from "@/lib/sale";

/** Ties the three cart lines of one bundle together (and the pair on the order). */
const newBundleId = () => `${BUNDLE.name}-${Math.random().toString(36).slice(2, 8)}`;

const M = MATTRESS;
const D = DOG_BED;

/** The pair's price at list, and after the event's percentage. The same 20% Shopify takes off each line at checkout. */
export function bundleTotals(mattressSize: string, dogSize: string) {
  const m = M.sizes.find((s) => s.id === mattressSize) ?? M.sizes[0];
  const d = D.sizes.find((s) => s.id === dogSize) ?? D.sizes[0];
  const bed = BUNDLE_CONFIG.beddingSet.price;
  const list = m.price + d.price + bed;
  return { m, d, bed, list, now: bundlePrice(m.price) + bundlePrice(d.price) + bundlePrice(bed) };
}

/** Color swatches (the mattress and the Ashbury Dog Bed share the same four colors). */
function Colors({ colors, value, onChange, label }: { colors: { id: string; label: string; swatch: keyof typeof PHOTOS }[]; value: string; onChange: (id: string) => void; label: string }) {
  return colors.map((c) => (
    <button
      key={c.id}
      type="button"
      className={"chip color-chip mattress-chip" + (value === c.id ? " on" : "")}
      style={{ backgroundImage: `url(${PHOTOS[c.swatch].src})` }}
      title={c.label}
      aria-label={`${label} ${c.label}`}
      aria-pressed={value === c.id}
      onClick={() => onChange(c.id)}
    />
  ));
}

/** Choose an Ashbury and an Ashbury Dog Bed, see the bundle price (with the bedding set), and add all three to the cart in one action. */
export function BundleBuilder() {
  const cart = useCart();
  const buyRef = useRef<HTMLButtonElement>(null);
  const [mSize, setMSize] = useState("queen");
  const [feel, setFeel] = useState(M.feels[0].id);
  const [mColor, setMColor] = useState(M.defaultColor);
  const [dSize, setDSize] = useState("medium");
  const [dColor, setDColor] = useState(D.defaultColor);
  const [pillow, setPillow] = useState<string>(BUNDLE_PILLOWS[0].id as string);

  const { m, d, bed, list, now } = bundleTotals(mSize, dSize);
  const mc = M.colors.find((c) => c.id === mColor) ?? M.colors[0];
  const dc = D.colors.find((c) => c.id === dColor) ?? D.colors[0];
  const pillows = pillowSizeFor(m.id);
  const pil = BUNDLE_PILLOWS.find((x) => x.id === pillow) ?? BUNDLE_PILLOWS[0];
  const pillowSize = `${pillowSizeNameFor(m.id)} ${pillows.replace("×", "x")}`;
  const coverColor = BUNDLE_COVER_BY_MATTRESS_COLOR[mc.id] ?? mc.label;
  const bedName = BUNDLE_CONFIG.beddingSet.name;
  const feelLabel = M.feels.find((f) => f.id === feel)!.label;

  const add = () => {
    const tag: [string, string][] = [[BUNDLE.attribute, BUNDLE.name], [BUNDLE.idAttribute, newBundleId()]];
    cart.addMany([
      {
        id: M.id,
        name: M.title,
        photo: mc.photos[0] ?? mc.swatch,
        price: m.price,
        qty: 1,
        mode: "As designed",
        options: [["Size", `${m.label} (${m.dims})`], ["Feel", feelLabel], ["Color", mc.label], ...tag],
        delivery: bundleMattressDelivery(),
      },
      {
        id: D.id,
        name: D.title,
        photo: dc.photos[0] ?? dc.swatch,
        price: d.price,
        qty: 1,
        mode: "As designed",
        options: [["Size", `${d.label} (${d.dims})`], ["Color", dc.label], ...tag],
      },
      {
        id: BUNDLE_CONFIG.beddingSet.handle,
        name: bedName,
        photo: mc.photos[0] ?? mc.swatch,
        price: bed,
        qty: 1,
        mode: "As designed",
        options: [["Mattress size", m.label], ["Pillow", pil.label], ["Pillow size", pillowSize], ["Cover color", coverColor], ["Includes", "Two pillows and a Mattress Protector"], ...tag],
      },
    ]);
  };

  return (
    <section className="bundle-build wrap">
      <div className="bundle-pair">
        <div className="bundle-shot">
          <Photo src={mc.photos[0]} label={`${M.title} in ${mc.label}`} sizes="(max-width: 960px) 100vw, 28vw" preload />
          <span className="bundle-cap">{M.title} · {mc.label}</span>
        </div>
        <div className="bundle-plus" aria-hidden="true">+</div>
        <div className="bundle-shot">
          <Photo src={(PHOTOS[`${dc.photos[0]}-card` as keyof typeof PHOTOS] ? `${dc.photos[0]}-card` : dc.photos[0]) as keyof typeof PHOTOS} label={`${D.title} in ${dc.label}`} sizes="(max-width: 960px) 100vw, 28vw" preload />
          <span className="bundle-cap">{D.title} · {dc.label}</span>
        </div>
      </div>

      <div className="bundle-opts">
        <div className="eyebrow">Step 1 · The mattress</div>
        <div className="choices">
          <OptGroup label="Mattress size" value={`${m.label} · ${m.dims}`}>
            <Pills options={M.sizes} value={mSize} onChange={setMSize} />
          </OptGroup>
          <OptGroup label="Feel" value={feelLabel}>
            <Pills options={M.feels} value={feel} onChange={setFeel} />
          </OptGroup>
          <OptGroup label="Mattress color" value={mc.label}>
            <Colors colors={M.colors} value={mColor} onChange={setMColor} label="Mattress" />
          </OptGroup>
        </div>
        <div className="eyebrow" style={{ marginTop: 28 }}>Step 2 · The dog bed</div>
        <div className="choices">
          <OptGroup label="Dog bed size" value={`${d.label} · ${d.dims}`}>
            <Pills options={D.sizes} value={dSize} onChange={setDSize} />
          </OptGroup>
          <OptGroup label="Dog bed color" value={dc.label}>
            <Colors colors={D.colors} value={dColor} onChange={setDColor} label="Dog bed" />
          </OptGroup>
        </div>

        <div className="eyebrow" style={{ marginTop: 28 }}>Step 3 · The bedding set</div>
        <p className="fine" style={{ marginTop: 0 }}>Two pillows with removable covers in your mattress color ({coverColor}), plus a Mattress Protector. Pillow size follows your mattress: {pillowSize} in.</p>
        <div className="choices">
          <OptGroup label="Pillow" value={pil.label}>
            <Pills options={BUNDLE_PILLOWS.map((x) => ({ id: x.id as string, label: x.label }))} value={pillow} onChange={setPillow} />
          </OptGroup>
        </div>
        <ul className="fine" style={{ margin: "0 0 8px", paddingLeft: 18 }}>
          {BUNDLE_PILLOWS.map((x) => <li key={x.id}><strong>{x.label}:</strong> {x.desc}</li>)}
        </ul>

        <div className="bundle-sum">
          <div className="bundle-sum-row"><span>{M.title}, {m.label}</span><span>{fmt(m.price)}</span></div>
          <div className="bundle-sum-row"><span>{D.title}, {d.label}</span><span>{fmt(d.price)}</span></div>
          <div className="bundle-sum-row"><span>{bedName}: two {pil.label} pillows ({pillowSize} in) with {coverColor} removable covers, and a Mattress Protector</span><span>{fmt(bed)}</span></div>
          {SALE.active && <div className="bundle-sum-row save"><span>{SALE.percent}% off the bundle</span><span>−{fmt(list - now)}</span></div>}
          <div className="bundle-sum-row"><span>White glove delivery for the mattress</span><span>{BUNDLE_CONFIG.whiteGloveIncluded ? "Free with the bundle" : fmt(M.delivery.price)}</span></div>
          <div className="bundle-sum-total">
            <span className="eyebrow">The bundle</span>
            <span className="bundle-price">
              {SALE.active && <s className="price-was">{fmt(list)}</s>}
              {fmt(now)}
            </span>
          </div>
        </div>

        <ShipsFast when="3–4 days" note="Handmade to order in the USA. Our delivery team will contact you to schedule the mattress once it is made." />
        <button ref={buyRef} className="btn full" onClick={add}>Add the bundle to cart · {fmt(now)}</button>
        <StickyBuy watch={buyRef} name="The Best Friends Bundle" summary="Mattress, dog bed and bedding set" price={now} cta="Add to cart" onAdd={add} />
        <p className="fine">The bedding set is {fmt(bed)} ({BUNDLE_CONFIG.beddingSet.contents}) and free white glove is included, a {fmt(BUNDLE_CONFIG.whiteGloveValue)} value. Priced on its own, a Mattress Protector alone lists from {BUNDLE_CONFIG.protectorListRange}, depending on size.</p>
        <p className="fine">
          {SALE.active ? `${SALE.percent}% off is applied automatically at checkout. ` : ""}Taxes calculated at checkout.
        </p>
        <TrustRow items={[["hand", "Handmade to order"], ["truck", "White glove, mattress"], ["moon", `${M.guaranteeNights}-night trial`]]} />
        <p className="fine">
          Each is also sold on its own: <Link href={MATTRESS_PATH} className="ulink-inline">the Ashbury</Link> and <Link href={D.path} className="ulink-inline">the Ashbury Dog Bed</Link>.
        </p>
      </div>
    </section>
  );
}

/**
 * The Sleep Suite page (Tessa's brief, 05/11): a full-bleed swipeable gallery, a one-line title, the price row, size,
 * feel and color, a full-width Add to cart, a row of what's included, then closed accordions.
 */
export function SleepSuiteBuilder() {
  const cart = useCart();
  const buyRef = useRef<HTMLButtonElement>(null);
  const [mSize, setMSize] = useState("queen");
  const [feel, setFeel] = useState(M.feels[0].id);
  const [mColor, setMColor] = useState(M.defaultColor);
  const [pillow, setPillow] = useState<string>(BUNDLE_PILLOWS[0].id as string);
  const [shot, setShot] = useState(0);
  // "Switch to the Sleep Suite" links here with ?size=&feel=&color=, so the shopper keeps what they chose.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const size = q.get("size"), f = q.get("feel"), c = q.get("color");
    /* eslint-disable react-hooks/set-state-in-effect -- read once from the address after mount */
    if (size && M.sizes.some((z) => z.id === size)) setMSize(size);
    if (f && M.feels.some((z) => z.id === f)) setFeel(f);
    if (c && M.colors.some((z) => z.id === c)) setMColor(c);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const m = M.sizes.find((s) => s.id === mSize) ?? M.sizes[0];
  const bed = BUNDLE_CONFIG.beddingSet.price;
  const { list, sale: now } = sleepSuitePrice(m.id);
  const mc = M.colors.find((c) => c.id === mColor) ?? M.colors[0];
  const pil = BUNDLE_PILLOWS.find((x) => x.id === pillow) ?? BUNDLE_PILLOWS[0];
  const pillowSize = `${pillowSizeNameFor(m.id)} ${pillowSizeFor(m.id).replace("×", "x")}`;
  const coverColor = BUNDLE_COVER_BY_MATTRESS_COLOR[mc.id] ?? mc.label;
  const feelLabel = M.feels.find((f) => f.id === feel)!.label;
  const rv = reviewsFor("ashbury");
  // Clean photos only (no words in the picture), light oak base: the room shot for the chosen color, pillows, studio, cutaway.
  const room: PhotoKey = mc.id === "mocha" ? "mattress-mocha-bedroom" : mc.photos[0];
  const shots: GalleryShot[] = [
    { photo: room, alt: `The Ashbury in ${mc.label} on a light oak bed, made up with two pillows` },
    { photo: "pillow-hero", alt: "The Ashwick Pillow" },
    { photo: mc.photos[1] ?? mc.cutaway, alt: `The Ashbury in ${mc.label}, hand-tufted` },
    { photo: mc.cutaway, alt: `Inside the Ashbury in ${mc.label}` },
  ];

  const add = () => cart.addMany(sleepSuiteLines({ sizeId: m.id, feelId: feel, colorId: mc.id, pillowId: pil.id }));
  const pickColor = (id: string) => { setMColor(id); setShot(0); };

  return (
    <section className="ssp">
      <div className="ssp-gal"><SwipeGallery shots={shots} index={Math.min(shot, shots.length - 1)} onIndex={setShot} aspect="4/5" /></div>

      <div className="ssp-buy">
        <h1 className="ssp-h">{SLEEP_SUITE.name}</h1>
        <p className="ssp-price">
          <span className="price-now">{fmtWhole(now)}</span>
          {SALE.active && <> <s className="price-was">{fmtWhole(list)}</s></>}
          {rv.count > 0 && <> <span className="ssp-dot">·</span> <Stars rating={rv.average} /></>}
        </p>

        <div className="choices">
          <OptGroup label="Size" value={`${m.label} · ${m.dims}`}>
            <Pills options={M.sizes} value={mSize} onChange={setMSize} />
          </OptGroup>
          <OptGroup label="Feel" value={feelLabel}>
            <Pills options={M.feels} value={feel} onChange={setFeel} />
          </OptGroup>
          <OptGroup label="Color" value={mc.label}>
            <Colors colors={M.colors} value={mColor} onChange={pickColor} label="Mattress" />
          </OptGroup>
          <OptGroup label="Pillow" value={pil.label}>
            <Pills options={BUNDLE_PILLOWS.map((x) => ({ id: x.id as string, label: x.label }))} value={pillow} onChange={setPillow} />
          </OptGroup>
        </div>

        <button ref={buyRef} className="btn full ssp-add" onClick={add}>Add to cart</button>
        <StickyBuy watch={buyRef} name={SLEEP_SUITE.name} summary={`${m.label} · ${mc.label}`} price={now} cta="Add to cart" onAdd={add} />

        <ul className="inc-row" aria-label="Included">
          <li><IncIcon k="mattress" /><span>Ashbury mattress</span></li>
          <li><IncIcon k="pillows" /><span>2 pillows</span></li>
          <li><IncIcon k="protector" /><span>Mattress protector</span></li>
          <li><IncIcon k="glove" /><span>Free white glove</span></li>
        </ul>

        <div className="ssp-acc">
          <details>
            <summary>What&rsquo;s inside</summary>
            <p>{M.title}, {m.label} ({m.dims}), {feelLabel}, in {mc.label}: {fmt(m.price)}.</p>
            <p>{pil.desc} Two {pil.label} pillows ({pillowSize} in) with {coverColor} removable covers, and a Mattress Protector, in the {SLEEP_SUITE_BEDDING_NAME} ({fmt(bed)}).</p>
            <p>Each is also sold on its own: <Link href={MATTRESS_PATH} className="ulink-inline">the Ashbury</Link>.</p>
          </details>
          <details>
            <summary>Delivery</summary>
            <p>Free white glove delivery for the mattress is included with this bundle; on its own it is {fmt(M.delivery.price)}.</p>
            <p>Ships in 3–4 days. Handmade to order in the USA. Our delivery team will contact you to schedule the mattress once it is made.</p>
          </details>
          <details>
            <summary>{M.guaranteeNights}-night trial</summary>
            <p>Mattress: a {M.guaranteeNights}-night trial, with a 30-night minimum before you request a return.</p>
          </details>
          <details>
            <summary>Pay over time</summary>
            <p>Shop Pay Installments is offered at checkout on the mattress and on furniture, subject to approval.</p>
          </details>
          <details>
            <summary>FAQs</summary>
            <p><strong>Is the discount automatic?</strong> {SALE.active ? `Yes. ${SALE.percent}% off is applied automatically at checkout.` : "Prices shown are the prices at checkout."} Taxes calculated at checkout.</p>
            <p><strong>Can I change the pillow?</strong> Yes: choose {BUNDLE_PILLOWS.map((x) => x.label).join(" or ")} above.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
