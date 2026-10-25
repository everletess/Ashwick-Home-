"use client";

import { useRef, useState } from "react";
import { DogBedNotify } from "@/components/dog-bed-notify";
import { Photo } from "@/components/photo";
import { OptGroup, Pills } from "@/components/product-view";
import { ShipsFast, TrustRow } from "@/components/buy-icons";
import { useCart } from "@/components/cart";
import { Accordion } from "@/components/mattress";
import { MattressTeaser } from "@/components/mattress-teaser";
import { BUY_OPTIONS_ID, StickyBuy } from "@/components/sticky-buy";
import { DOG_BED, type DogBed } from "@/lib/dog-bed";
import { PHOTOS } from "@/lib/photos";

/** Gallery and color choice for a dog bed (the Ashbury by default); the gallery follows the color. */
export function DogBedView({ bed: D = DOG_BED, children }: { bed?: DogBed; children?: React.ReactNode }) {
  const [color, setColorState] = useState(D.defaultColor);
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(D.sizes[0].id);
  const cart = useCart();
  const buyRef = useRef<HTMLButtonElement>(null);
  const sz = D.sizes.find((z) => z.id === size) ?? D.sizes[0];
  const sel = D.colors.find((c) => c.id === color) ?? D.colors[0];
  const alt = `${D.title} in ${sel.label}`;
  // The chosen size's shot, where this color has one, comes second, right after the product shot.
  const sizePhoto = sel.sizePhotos?.[size];
  const gallery = sizePhoto ? [sel.photos[0], sizePhoto, ...sel.photos.slice(1)] : sel.photos;
  const setColor = (c: string) => {
    setColorState(c);
    setImg(0);
  };
  // Picking a size shows that size's shot.
  const pickSize = (s: string) => {
    setSize(s);
    if (sel.sizePhotos?.[s]) setImg(1);
  };

  // Beside the gallery on wide screens, after the buy box on phones.
  const faqs = D.faqs.length > 0 && (
    <section className="dog-faqs" aria-labelledby="dog-faqs-h">
      <h2 className="eyebrow" id="dog-faqs-h">Questions</h2>
      <Accordion items={D.faqs.map((f) => [f.q, <p className="body small" key={f.q}>{f.a}</p>])} />
    </section>
  );

  const add = () =>
    cart.add({
      id: D.id,
      name: D.title,
      photo: sel.photos[0] ?? sel.swatch,
      price: sz.price,
      qty: 1,
      mode: "As designed",
      options: [["Size", `${sz.label} (${sz.dims})`], ["Color", sel.label]],
    });

  return (
    <section className="pdp wrap">
      <div className="gal">
        <div className="gal-main">
          <div className="gal-photo"><Photo src={gallery[img] ?? gallery[0]} label={img === 1 && sizePhoto ? `${alt}, ${sz.label}` : alt} sizes="(max-width: 960px) 100vw, 56vw" preload={img === 0} /></div>
        </div>
        {gallery.length > 1 && (
          <div className="gal-thumbs">
            {gallery.map((ph, i) => (
              <button key={ph} className={i === img ? "on" : ""} aria-label={"Image " + (i + 1)} aria-pressed={i === img} onClick={() => setImg(i)}>
                <Photo src={ph} label="" sizes="84px" />
              </button>
            ))}
          </div>
        )}
        {/* Beside the gallery on wide screens; below the buy box on phones (the second copy). */}
        {D.matchesMattress && <div className="teaser-wide"><MattressTeaser color={sel.id} /></div>}
        {faqs && <div className="teaser-wide">{faqs}</div>}
      </div>

      <div className="info">
        <div className="eyebrow">{D.comingSoon ? "Coming soon" : "Dog bed · Made to order"}</div>
        <h1 className="pdp-name">{D.title}</h1>
        {D.collection !== D.title && <div className="pdp-collection">{D.collection}</div>}
        <p className="m-feature-tag dog-tag">{D.tagline}</p>
        {sz.price > 0 && <div className="pdp-price">${sz.price}</div>}
        <p className="body">
          {D.comingSoon ? D.soonLede : D.lede}
        </p>

        <div className="choices" id={BUY_OPTIONS_ID}>
          {sz.price > 0 && (
            <OptGroup label="Size" value={`${sz.label} · ${sz.dims}`}>
              <Pills options={D.sizes} value={size} onChange={pickSize} />
            </OptGroup>
          )}
          <OptGroup label="Color" value={sel.label}>
            {D.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                className={"chip color-chip mattress-chip" + (color === c.id ? " on" : "")}
                style={{ backgroundImage: `url(${PHOTOS[c.swatch].src})` }}
                title={c.label}
                aria-label={c.label}
                aria-pressed={color === c.id}
                onClick={() => setColor(c.id)}
              />
            ))}
          </OptGroup>
        </div>

        {!D.comingSoon && (
          <div className="designed">
            <ShipsFast when="3–4 days" note="Handmade to order in the USA. Free delivery." />
            <button ref={buyRef} className="btn full" onClick={add}>Add to cart · ${sz.price}</button>
            <TrustRow items={[["hand", "Handmade to order"], ["truck", "Free delivery"], ["returns", "30-day returns"]]} />
            <StickyBuy
              watch={buyRef}
              photo={sel.photos[0]}
              name={D.title}
              summary={`${sz.label} · ${sel.label}`}
              price={sz.price}
              cta="Add to cart"
              onAdd={add}
            />
            <ul className="buy-notes">
              <li>{D.returns}</li>
              <li>{D.warranty}</li>
            </ul>
          </div>
        )}
        {D.comingSoon && (
          <div className="dog-soon">
            <p className="body small">Launching soon. Sign up and we&apos;ll let you know the day it&apos;s here, with 15% off your first order.</p>
            <DogBedNotify />
          </div>
        )}
        {D.specs.length > 0 && (
          <table className="dog-specs">
            <thead><tr><th scope="col">Dimensions</th>{D.sizes.map((z) => <th scope="col" key={z.id}>{z.label}</th>)}</tr></thead>
            <tbody>
              {D.specs.map((r) => (
                <tr key={r.label}><th scope="row">{r.label}</th>{r.values.map((v, i) => <td key={i}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        )}
        {D.materials.length > 0 && (
          <div className="dog-story">
            {D.matchNote && (
              <>
                <p className="eyebrow">{D.headline}</p>
                <p className="body small">{D.matchNote}</p>
              </>
            )}
            <p className="eyebrow">What it&apos;s made of</p>
            <ul className="buy-notes">
              {D.materials.map((m) => (
                <li key={m.name}><strong>{m.name}{m.note ? "." : ""}</strong> {m.note}</li>
              ))}
            </ul>
            {!D.specs.length && (
              <p className="body small">Sizes: {D.sizes.map((z) => `${z.label} ${z.dims}`).join(", ")}. Each size is one price in all {D.colors.length} colors.</p>
            )}
          </div>
        )}
        {children}
        {D.matchesMattress && <div className="teaser-narrow"><MattressTeaser color={sel.id} /></div>}
        {faqs && <div className="teaser-narrow">{faqs}</div>}
      </div>
    </section>
  );
}
