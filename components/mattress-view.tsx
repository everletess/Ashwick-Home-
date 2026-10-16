"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart";
import { FormError, Honeypot, useFormSend } from "@/components/forms";
import { Photo } from "@/components/photo";
import { OptGroup, Pills } from "@/components/product-view";
import { GUARANTEE_PATH, MATTRESS, colorById, sizeById } from "@/lib/mattress";
import { PHOTOS, type PhotoKey } from "@/lib/photos";
import { fmt } from "@/lib/products";

const M = MATTRESS;

/** "Request a custom size": emailed to the studio as a customization request. */
function CustomSizeRequest({ about }: { about: string }) {
  const { sent, sending, error, onSubmit } = useFormSend("custom");
  if (sent) {
    return (
      <div className="trade-done" role="status">
        <h3 className="proc-h">Thank you.</h3>
        <p className="body">We&apos;ve received your request and will be in touch with a quote.</p>
      </div>
    );
  }
  return (
    <form className="custom-req" onSubmit={onSubmit}>
      <Honeypot />
      <p className="body small">{M.customSize}</p>
      <input type="hidden" name="selection" value={about} />
      <label><span className="eyebrow">Name *</span><input name="name" autoComplete="name" required /></label>
      <label><span className="eyebrow">Email *</span><input name="email" type="email" autoComplete="email" required /></label>
      <label><span className="eyebrow">Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
      <label>
        <span className="eyebrow">Size you need *</span>
        <textarea name="details" rows={3} required placeholder="Width and length, and the bed or frame it's for" />
      </label>
      <FormError message={error} />
      <button className="btn full" type="submit" disabled={sending}>{sending ? "Sending…" : "Send request"}</button>
    </form>
  );
}

/** Gallery + buy box for the mattress. The gallery follows the Color selection. */
export function MattressView() {
  const cart = useCart();
  const [size, setSize] = useState(M.defaultSize);
  const [feel, setFeel] = useState(M.feels[0].id);
  const [color, setColorState] = useState(M.colors[0].id);
  const [img, setImg] = useState(0);
  const [custom, setCustom] = useState(false);

  const sel = colorById(color);
  const sz = sizeById(size);
  // The color's room photo (or a placeholder until one exists), then the construction.
  const gallery: (PhotoKey | undefined)[] = [sel.photo, "mattress-cutaway"];
  const setColor = (c: string) => {
    setColorState(c);
    setImg(0);
  };

  const feelLabel = M.feels.find((f) => f.id === feel)!.label;
  const add = () =>
    cart.add({
      id: M.id,
      name: M.title,
      photo: sel.photo ?? sel.swatch,
      price: sz.price,
      qty: 1,
      mode: "As designed",
      options: [["Size", `${sz.label} (${sz.dims})`], ["Feel", feelLabel], ["Color", sel.label]],
    });

  return (
    <section className="pdp wrap">
      <div className="gal">
        <div className="gal-main">
          <div className="gal-photo">
            <Photo src={gallery[img]} label={img === 0 ? `${M.title} in ${sel.label}` : `${M.title}: the layers inside`} sizes="(max-width: 960px) 100vw, 56vw" preload />
          </div>
        </div>
        <div className="gal-thumbs">
          {gallery.map((ph, i) => (
            <button key={i} className={i === img ? "on" : ""} aria-label={"Image " + (i + 1)} aria-pressed={i === img} onClick={() => setImg(i)}>
              <Photo src={ph ?? sel.swatch} label="" sizes="84px" />
            </button>
          ))}
        </div>
      </div>

      <div className="info">
        <div className="eyebrow">{M.type} · Made to order</div>
        <h1 className="pdp-name">{M.title}</h1>
        <div className="pdp-price">{fmt(sz.price)}</div>
        <p className="body">
          Living Wool, Swedish horsehair and organic cotton, hand-tufted and made in color. An {M.mattressHeight} mattress with a {M.topperHeight} topper included: {M.combinedHeight} of natural fiber, with no foam, no latex and no chemical flame retardants.
        </p>

        <div className="choices">
          <OptGroup label="Size" value={`${sz.label} · ${sz.dims}`}>
            <Pills options={M.sizes} value={size} onChange={setSize} />
          </OptGroup>
          <OptGroup label="Feel" value={feelLabel}>
            <Pills options={M.feels} value={feel} onChange={setFeel} />
          </OptGroup>
          <OptGroup label="Color" value={sel.label}>
            {M.colors.map((c) => (
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

        <div className="designed">
          {M.available ? (
            <button className="btn full" onClick={add}>Add to cart · {fmt(sz.price)}</button>
          ) : (
            <button className="btn full" disabled aria-disabled="true">Coming soon</button>
          )}
          <ul className="buy-notes">
            <li>{M.leadTime}</li>
            <li>{M.shipping} {M.guarantee}.</li>
            <li>{M.warranty}.</li>
          </ul>
        </div>

        <button type="button" className="ulink linkbtn" aria-expanded={custom} onClick={() => setCustom((v) => !v)}>
          Request a custom size
        </button>
        {custom && <CustomSizeRequest about={`${M.title} · custom size · ${feelLabel} · ${sel.label}`} />}
        <Link href={GUARANTEE_PATH} className="ulink">Guarantee &amp; warranty</Link>
      </div>
    </section>
  );
}
