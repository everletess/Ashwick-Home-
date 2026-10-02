"use client";

import { useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { FormError, Honeypot, useFormSend } from "@/components/forms";
import { Photo, Swatch } from "@/components/photo";
import { FABRICS, LEAD_TIME, WOODS, fmt, getProduct, nearestPhoto, photoFor, priceFor, type FabricId, type Option, type PhotoTag } from "@/lib/products";

type Mode = "designed" | "custom";

function OptGroup({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div className="opt" role="group" aria-label={label}>
      <div className="opt-l"><span className="eyebrow">{label}</span><span className="opt-v">{value}</span></div>
      <div className="opt-c">{children}</div>
    </div>
  );
}

function Pills({ options, value, onChange }: { options: Option[]; value: string; onChange: (id: string) => void }) {
  return options.map((o) => (
    <button key={o.id} type="button" className={"pill" + (value === o.id ? " on" : "")} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
      {o.label}
    </button>
  ));
}

const lab = (arr: Option[], v: string) => arr.find((o) => o.id === v)?.label ?? "";
const colorName = (c: { label: string; code?: string }) => (c.code ? `${c.label} (${c.code})` : c.label);

/** "Customize" tab: anything beyond the standard choices is a request we follow up on. */
function CustomRequest({ about }: { about: string }) {
  const { sent, sending, error, onSubmit } = useFormSend("custom");
  if (sent) {
    return (
      <div className="trade-done" role="status">
        <h3 className="proc-h">Thank you.</h3>
        <p className="body">We&apos;ve received your request and will be in touch to talk it through.</p>
      </div>
    );
  }
  return (
    <form className="custom-req" onSubmit={onSubmit}>
      <Honeypot />
      <p className="body small">
        Want something different, like a deeper seat, another size or your own fabric? Tell us what you have in mind and we&apos;ll get back to you.
      </p>
      <p className="fine">Starting from: {about}</p>
      <input type="hidden" name="selection" value={about} />
      <label><span className="eyebrow">Name *</span><input name="name" autoComplete="name" required /></label>
      <label><span className="eyebrow">Email *</span><input name="email" type="email" autoComplete="email" required /></label>
      <label><span className="eyebrow">Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
      <label>
        <span className="eyebrow">Details *</span>
        <textarea name="details" rows={5} required placeholder="What you'd like changed: seat depth, size, fabric, finish, the room it's for" />
      </label>
      <FormError message={error} />
      <button className="btn full" type="submit" disabled={sending}>{sending ? "Sending…" : "Send request"}</button>
    </form>
  );
}

/** Gallery + purchase column. Takes the id (not the product) so it can be rendered from a server page. */
export function ProductView({ id, initialMode }: { id: string; initialMode: Mode }) {
  const p = getProduct(id)!;
  const cart = useCart();
  const [mode, setModeState] = useState<Mode>(initialMode);
  const [img, setImg] = useState(0);
  const firstColor = (f: FabricId) => FABRICS[f].colors?.[0].id;
  const [fabric, setFabricState] = useState<FabricId>(p.designedFabric);
  const [color, setColorState] = useState(firstColor(p.designedFabric) ?? "");
  const [wood, setWoodState] = useState(WOODS[0].id);

  // Horizontal swipe on the main image steps through the gallery on touch screens.
  const swipeX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") swipeX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeX.current == null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) < 40) return;
    const n = p.photos.length;
    setImg((i) => (i + (dx < 0 ? 1 : -1) + n) % n);
  };

  // Keep the URL in step with the tab (/products/:id vs /products/:id/customize) without a navigation.
  const setMode = (m: Mode) => {
    setModeState(m);
    window.history.replaceState(null, "", "/products/" + p.id + (m === "custom" ? "/customize" : ""));
  };

  const current: PhotoTag = { wood: p.wood ? wood : undefined, fabric, color: color || undefined };
  // Choosing an option jumps the gallery to the photo that best matches the new selection.
  const show = (next: PhotoTag) => {
    const ph = nearestPhoto(p, next);
    setImg(ph ? p.photos.indexOf(ph) : 0);
  };
  const setFabric = (f: FabricId) => {
    const c = firstColor(f) ?? "";
    setFabricState(f);
    setColorState(c);
    show({ ...current, fabric: f, color: c || undefined });
  };
  const setColor = (c: string) => {
    setColorState(c);
    show({ ...current, color: c });
  };
  const setWood = (w: string) => {
    setWoodState(w);
    show({ ...current, wood: w });
  };

  const selFabric = FABRICS[fabric];
  const selColor = selFabric.colors?.find((c) => c.id === color);
  const price = priceFor(p, fabric);
  const fabricChoices = p.fabrics;
  const note = p.photoNotes?.[p.photos[img]];

  const summary = [
    ["Fabric", selFabric.label],
    selColor && ["Color", colorName(selColor)],
    p.wood && ["Wood", lab(WOODS, wood)],
  ].filter(Boolean) as [string, string][];

  const add = () =>
    cart.add({
      id: p.id,
      name: p.name,
      photo: photoFor(p, current) ?? p.cardPhoto ?? p.photos[0],
      price,
      delivery: p.delivery,
      qty: 1,
      mode: p.preorder ? "Pre-order" : "As designed",
      options: summary,
    });

  return (
    <section className="pdp wrap">
      <div className="gal">
        <div className="gal-main" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipeX.current = null)}>
          <Photo src={p.photos[img]} label={p.name} sizes="(max-width: 960px) 100vw, 56vw" preload={img === 0} />
        </div>
        {note && <p className="gal-note">{note}</p>}
        {p.photos.length > 1 && (
          <div className="gal-thumbs">
            {p.photos.map((ph, i) => (
              <button key={ph} className={i === img ? "on" : ""} aria-label={"Image " + (i + 1)} aria-pressed={i === img} onClick={() => setImg(i)}>
                <Photo src={ph} label="" sizes="84px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="info">
        <div className="eyebrow">{p.type} · Made to order · Handmade in the USA</div>
        <h1 className="pdp-name">{p.name}</h1>
        <div className="pdp-price">{p.priceFrom ? "From " : ""}{fmt(price)}</div>
        {p.delivery && <p className="fine delivery">+ {fmt(p.delivery.price)} {p.delivery.label.toLowerCase()}</p>}
        <p className="body">{p.line}</p>

        <div className="choices">
          {fabricChoices.length > 1 && (
            <OptGroup label="Fabric" value={selFabric.label + (fabricChoices.some((f) => priceFor(p, f) !== priceFor(p, fabricChoices[0])) ? " · " + fmt(price) : "")}>
              {fabricChoices.map((f) => <Swatch key={f} f={f} size={52} on={fabric === f} onClick={() => setFabric(f)} />)}
            </OptGroup>
          )}
          {selFabric.colors && (
            <OptGroup label={fabricChoices.length > 1 ? "Color" : selFabric.label} value={selColor ? [selColor.label, selColor.code].filter(Boolean).join(" · ") : ""}>
              {selFabric.colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={"chip color-chip tex-" + selFabric.tex + (color === c.id ? " on" : "")}
                  style={{ background: c.swatch }}
                  title={colorName(c)}
                  aria-label={colorName(c)}
                  aria-pressed={color === c.id}
                  onClick={() => setColor(c.id)}
                />
              ))}
            </OptGroup>
          )}
          {selFabric.detail && <p className="fine">{selFabric.label}: {selFabric.detail}</p>}
          {p.wood && <OptGroup label="Wood" value={lab(WOODS, wood)}><Pills options={WOODS} value={wood} onChange={setWood} /></OptGroup>}
        </div>

        <div className="mode" role="tablist">
          <button role="tab" aria-selected={mode === "designed"} className={mode === "designed" ? "on" : ""} onClick={() => setMode("designed")}>As designed</button>
          <button role="tab" aria-selected={mode === "custom"} className={mode === "custom" ? "on" : ""} onClick={() => setMode("custom")}>Customize</button>
        </div>

        {mode === "designed" ? (
          <div className="designed" role="tabpanel">
            <p className="lead-time">{p.leadTime ?? LEAD_TIME}</p>
            <button className="btn full" onClick={add}>
              {p.preorder ? "Pre-order" : "Add to cart"} · {fmt(price)}
            </button>
            {p.preorder && (
              <p className="fine">This piece is available to pre-order. We'll confirm your order and estimated ship date by email.</p>
            )}
          </div>
        ) : (
          <div className="custom" role="tabpanel">
            <CustomRequest about={[p.name, ...summary.map(([, v]) => v)].join(" · ")} />
          </div>
        )}

        <div className="assure">
          <span>Made to order</span><span>Handmade in the USA</span><span>Paid in full at checkout</span>
        </div>
        <a href="#" className="ulink">Order fabric swatches</a>
      </div>
    </section>
  );
}
