"use client";

import { Fragment, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { Photo, Swatch } from "@/components/photo";
import { DEPTHS, FABRICS, FINISHES, LEAD_TIME, LENGTHS, WOODS, fabricsFor, fmt, getProduct, nearestPhoto, photoFor, pieceOf, priceFor, type FabricId, type Option, type PhotoTag } from "@/lib/products";

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
  const [piece, setPieceState] = useState(p.pieces?.[0].id);
  const [wood, setWoodState] = useState(WOODS[0].id);

  // Keep the URL in step with the tab (/products/:id vs /products/:id/customize) without a navigation.
  const setMode = (m: Mode) => {
    setModeState(m);
    window.history.replaceState(null, "", "/products/" + p.id + (m === "custom" ? "/customize" : ""));
  };

  // Choosing an option jumps the gallery to the photo that best matches the new selection.
  const show = (next: PhotoTag) => {
    const ph = nearestPhoto(p, next);
    setImg(ph ? p.photos.indexOf(ph) : 0);
  };
  const firstColor = (f: FabricId) => FABRICS[f].colors?.[0].id;
  const custom = mode === "custom";
  const current: PhotoTag = custom
    ? { piece, wood: p.wood ? wood : undefined, fabric, color: color || undefined }
    : { piece, wood: p.wood ? WOODS[0].id : undefined, fabric: p.designedFabric, color: firstColor(p.designedFabric) };

  const setPiece = (id: string) => {
    setPieceState(id);
    // Keep the fabric if this piece offers it, otherwise fall back to the piece's first fabric.
    const allowed = fabricsFor(p, id);
    if (custom && !allowed.includes(fabric)) {
      setFabricState(allowed[0]);
      setColorState(firstColor(allowed[0]) ?? "");
      show({ ...current, piece: id, fabric: allowed[0], color: firstColor(allowed[0]) });
    } else {
      show({ ...current, piece: id });
    }
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

  const sel = custom
    ? { fabric, color, depth, length, finish }
    : { fabric: p.designedFabric, color: firstColor(p.designedFabric) ?? "", depth: "standard", length: "standard", finish: "natural" };
  const selFabric = FABRICS[sel.fabric];
  const selColor = selFabric.colors?.find((c) => c.id === sel.color);
  const selPiece = pieceOf(p, piece);
  const price = priceFor(p, sel.fabric, piece);
  const gallery = p.photos;
  const note = p.photoNotes?.[gallery[img]];
  const colorName = (c: { label: string; code?: string }) => (c.code ? `${c.label} (${c.code})` : c.label);
  const fabricChoices = fabricsFor(p, piece);

  const summary = [
    selPiece && ["Piece", selPiece.label],
    ["Fabric", selFabric.label],
    selColor && ["Color", colorName(selColor)],
    p.wood && ["Wood", lab(WOODS, current.wood ?? "")],
    p.depth && ["Seat depth", lab(DEPTHS, sel.depth)],
    p.length && ["Length", lab(LENGTHS, sel.length)],
    p.finish && ["Wood finish", lab(FINISHES, sel.finish)],
  ].filter(Boolean) as [string, string][];

  const add = () =>
    cart.add({
      id: p.id,
      name: selPiece ? `${p.name} ${selPiece.label}` : p.name,
      photo: photoFor(p, current) ?? p.cardPhoto ?? p.photos[0],
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

        {p.pieces && (
          <OptGroup label="Piece" value={selPiece?.label}>
            {p.pieces.map((pc) => (
              <button key={pc.id} type="button" className={"pill" + (piece === pc.id ? " on" : "")} aria-pressed={piece === pc.id} onClick={() => setPiece(pc.id)}>
                {pc.label} · {fmt(priceFor(p, p.designedFabric, pc.id))}
              </button>
            ))}
          </OptGroup>
        )}

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
            {fabricChoices.length > 1 && (
              <OptGroup label="Fabric" value={FABRICS[fabric].label + (fabricChoices.some((f) => priceFor(p, f, piece) !== priceFor(p, fabricChoices[0], piece)) ? " · " + fmt(price) : "")}>
                {fabricChoices.map((f) => <Swatch key={f} f={f} size={52} on={fabric === f} onClick={() => setFabric(f)} />)}
              </OptGroup>
            )}
            {selFabric.colors && (
              <OptGroup label="Color" value={selColor ? [selColor.label, selColor.code].filter(Boolean).join(" · ") : ""}>
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
            {p.depth && <OptGroup label="Seat depth" value={lab(DEPTHS, depth)}><Pills options={DEPTHS} value={depth} onChange={setDepth} /></OptGroup>}
            {p.length && <OptGroup label="Length" value={lab(LENGTHS, length)}><Pills options={LENGTHS} value={length} onChange={setLength} /></OptGroup>}
            {p.wood && <OptGroup label="Wood" value={lab(WOODS, wood)}><Pills options={WOODS} value={wood} onChange={setWood} /></OptGroup>}
            {p.finish && <OptGroup label="Wood finish" value={lab(FINISHES, finish)}><Pills options={FINISHES} value={finish} onChange={setFinish} /></OptGroup>}
            <p className="fine">{p.fabricPrices || p.pieces ? "" : "Custom pricing: [PRICE]. "}Dimensions for each option: [DIMENSIONS].</p>
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
