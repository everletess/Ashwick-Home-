"use client";

import { Fragment, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { Photo, Swatch } from "@/components/photo";
import { DEPTHS, FABRICS, FINISHES, LEAD_TIME, LENGTHS, fmt, getProduct, priceFor, type FabricId, type Option } from "@/lib/products";

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

/** Gallery + purchase column. Takes the id (not the product) so it can be rendered from a server page. */
export function ProductView({ id, initialMode }: { id: string; initialMode: Mode }) {
  const p = getProduct(id)!;
  const cart = useCart();
  const [mode, setModeState] = useState<Mode>(initialMode);
  const [img, setImg] = useState(0);
  const [fabric, setFabricState] = useState<FabricId>(p.designedFabric);
  const [color, setColorState] = useState(FABRICS[p.designedFabric].colors?.[0].id ?? "");
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
    const n = gallery.length;
    setImg((i) => (i + (dx < 0 ? 1 : -1) + n) % n);
  };
  const [depth, setDepth] = useState("standard");
  const [length, setLength] = useState("standard");
  const [finish, setFinish] = useState("natural");

  // Keep the URL in step with the tab (/products/:id vs /products/:id/customize) without a navigation.
  const setMode = (m: Mode) => {
    setModeState(m);
    window.history.replaceState(null, "", "/products/" + p.id + (m === "custom" ? "/customize" : ""));
  };

  // Picking a fabric with colorways selects its first color; picking a color jumps to that color's photo.
  const showColor = (f: FabricId, c: string) => {
    const ph = p.colorPhotos?.[`${f}:${c}`];
    setImg(ph ? Math.max(0, p.photos.indexOf(ph)) : 0);
  };
  const setFabric = (f: FabricId) => {
    const c = FABRICS[f].colors?.[0].id ?? "";
    setFabricState(f);
    setColorState(c);
    showColor(f, c);
  };
  const setColor = (c: string) => {
    setColorState(c);
    showColor(fabric, c);
  };

  const sel = mode === "designed"
    ? { fabric: p.designedFabric, color: FABRICS[p.designedFabric].colors?.[0].id ?? "", depth: "standard", length: "standard", finish: "natural" }
    : { fabric, color, depth, length, finish };
  const selFabric = FABRICS[sel.fabric];
  const selColor = selFabric.colors?.find((c) => c.id === sel.color);
  const price = priceFor(p, sel.fabric);
  // A color photo that isn't already in the gallery leads it.
  const colorPhoto = selColor && p.colorPhotos?.[`${sel.fabric}:${selColor.id}`];
  const gallery = colorPhoto && !p.photos.includes(colorPhoto) ? [colorPhoto, ...p.photos] : p.photos;
  const note = p.photoNotes?.[gallery[img]];

  const summary = [
    ["Fabric", selFabric.label],
    selColor && ["Color", `${selColor.label} (${selColor.code})`],
    p.depth && ["Seat depth", lab(DEPTHS, sel.depth)],
    p.length && ["Length", lab(LENGTHS, sel.length)],
    p.finish && ["Wood finish", lab(FINISHES, sel.finish)],
  ].filter(Boolean) as [string, string][];

  const add = () =>
    cart.add({
      id: p.id,
      name: p.name,
      photo: p.cardPhoto ?? p.photos[0],
      // TODO: depth/length/finish pricing once supplied; "From" prices go in as the base price.
      price,
      delivery: p.delivery,
      qty: 1,
      mode: mode === "designed" ? "As designed" : "Customized",
      options: summary,
    });

  return (
    <section className="pdp wrap">
      <div className="gal">
        <div className="gal-main" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipeX.current = null)}>
          <Photo src={gallery[img]} label={p.name} sizes="(max-width: 960px) 100vw, 56vw" preload={img === 0} />
        </div>
        {note && <p className="gal-note">{note}</p>}
        {gallery.length > 1 && (
          <div className="gal-thumbs">
            {gallery.map((ph, i) => (
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

        <div className="mode" role="tablist">
          <button role="tab" aria-selected={mode === "designed"} className={mode === "designed" ? "on" : ""} onClick={() => setMode("designed")}>As designed</button>
          <button role="tab" aria-selected={mode === "custom"} className={mode === "custom" ? "on" : ""} onClick={() => setMode("custom")}>Customize</button>
        </div>

        {mode === "designed" ? (
          <div className="designed" role="tabpanel">
            <p className="body small">Our fabrics, proportions and finishes, chosen to work together.</p>
            <dl className="dl">
              {summary.map(([k, v]) => (
                <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>
              ))}
            </dl>
          </div>
        ) : (
          <div className="custom" role="tabpanel">
            {p.fabrics.length > 1 && (
              <OptGroup label="Fabric" value={FABRICS[fabric].label + (p.fabricPrices?.[fabric] ? " · " + fmt(priceFor(p, fabric)) : "")}>
                {p.fabrics.map((f) => <Swatch key={f} f={f} size={52} on={fabric === f} onClick={() => setFabric(f)} />)}
              </OptGroup>
            )}
            {selFabric.colors && (
              <OptGroup label="Color" value={selColor ? `${selColor.label} · ${selColor.code}` : ""}>
                {selFabric.colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={"chip color-chip tex-" + selFabric.tex + (color === c.id ? " on" : "")}
                    style={{ background: c.swatch }}
                    title={`${c.label} (${c.code})`}
                    aria-label={`${c.label} (${c.code})`}
                    aria-pressed={color === c.id}
                    onClick={() => setColor(c.id)}
                  />
                ))}
              </OptGroup>
            )}
            {selFabric.detail && <p className="fine">{selFabric.label}: {selFabric.detail}</p>}
            {p.depth && <OptGroup label="Seat depth" value={lab(DEPTHS, depth)}><Pills options={DEPTHS} value={depth} onChange={setDepth} /></OptGroup>}
            {p.length && <OptGroup label="Length" value={lab(LENGTHS, length)}><Pills options={LENGTHS} value={length} onChange={setLength} /></OptGroup>}
            {p.finish && <OptGroup label="Wood finish" value={lab(FINISHES, finish)}><Pills options={FINISHES} value={finish} onChange={setFinish} /></OptGroup>}
            <p className="fine">{p.fabricPrices ? "" : "Custom pricing: [PRICE]. "}Dimensions for each option: [DIMENSIONS].</p>
          </div>
        )}

        <p className="lead-time">{p.leadTime ?? LEAD_TIME}</p>
        <button className="btn full" onClick={add}>Add to cart · {fmt(price)}</button>
        <div className="assure">
          <span>Made to order</span><span>Handmade in the USA</span><span>Paid in full at checkout</span>
        </div>
        <a href="#" className="ulink">Order fabric swatches</a>
      </div>
    </section>
  );
}
