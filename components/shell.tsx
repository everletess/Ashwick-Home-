"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Stop the page behind an overlay from scrolling (mainly for touch devices). */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [locked]);
}
import { bundleIdOf, useCart, type CartLine } from "@/components/cart";
import { BUNDLE_CONFIG, bundleTitleFor, SALE, bundlePrice, deliveryFor, isFurnitureLine, orderDelivery, salePrice } from "@/lib/sale";
import { STUDIO_PHONE } from "@/lib/site";
import { SHOW_SIGNUP_EVENT } from "@/components/email-popup";
import { SUBSCRIBED_EVENT, SUBSCRIBED_KEY } from "@/lib/subscribe";
import { trackThen } from "@/lib/pixel";
import { saveCart, normalizePhone } from "@/lib/subscribe";
import { MATTRESS } from "@/lib/mattress";
import { DOG_BED_ID, NOOK } from "@/lib/dog-bed";
import { ASHBURY_PATH, FURNITURE_MATERIALS_PATH, MATERIALS_PATH } from "@/lib/materials";

const MATERIAL_LINKS: [string, string, string][] = [
  ["The Ashbury", "Inside the mattress", ASHBURY_PATH],
  ["Furniture", "Frames, fills and fabrics", FURNITURE_MATERIALS_PATH],
];

const MATTRESS_LINKS: [string, string, string][] = [
  ["The Ashbury", "Organic mattress, made in color", "/products/luxury-organic-mattress"],
  ["Dog Beds", "The Ashbury and The Nook", "/collections/dog-beds"],
];

/** A header link that opens a small menu on hover or click (Mattress, Materials). */
function NavMenu({ label, id, links, all, align = "right" }: { label: string; id: string; links: [string, string, string][]; all?: [string, string]; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  const hover = (v: boolean) => (e: React.PointerEvent) => e.pointerType === "mouse" && setOpen(v);
  return (
    <div className="nav-dd" ref={ref} onPointerEnter={hover(true)} onPointerLeave={hover(false)}>
      <button type="button" className="linkbtn nav-dd-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        {label}<span className="nav-dd-caret" aria-hidden="true" />
      </button>
      {open && (
        <div className={"nav-dd-panel" + (align === "left" ? " left" : "")} id={id}>
          {links.map(([t, d, href]) => (
            <Link key={href} href={href} className="nav-dd-item">
              <span className="nav-dd-t">{t}</span>
              <span className="nav-dd-d">{d}</span>
            </Link>
          ))}
          {all && <Link href={all[1]} className="nav-dd-all">{all[0]}</Link>}
        </div>
      )}
    </div>
  );
}

import { Photo } from "@/components/photo";
import { CartUpsell } from "@/components/cart-upsell";
import upsell from "@/components/cart-upsell.module.css";
import { fmt } from "@/lib/products";

const isDogBed = (id: string) => id === DOG_BED_ID || id === NOOK.id;

/** The line under the cart subtotal: delivery (white glove for furniture and the mattress, free for dog beds), ship time and payment. */
function cartNote(items: { id: string; delivery?: { label: string; price: number } }[]) {
  const sale = SALE.active ? `${SALE.name}: ${SALE.percent}% off is applied automatically at checkout. ` : "";
  if (!items.every((i) => i.delivery || isDogBed(i.id))) return sale + "Paid in full at checkout. Taxes and shipping calculated at checkout.";
  const mattress = items.some((i) => i.id === MATTRESS.id);
  const dogBeds = items.some((i) => isDogBed(i.id));
  return sale + [
    items.some((i) => deliveryFor(i)?.price) && "Includes white glove delivery.",
    dogBeds && "Dog beds ship free.",
    (mattress || dogBeds) && "Ships within 3–4 days.",
    mattress && "Our delivery team will contact you to schedule your mattress delivery.",
    mattress ? "Pay in full at checkout, or over time with Shop Pay Installments, subject to approval." : "Paid in full at checkout.",
    "Taxes calculated at checkout.",
  ].filter(Boolean).join(" ");
}

/** Cart lines in order, with the three lines of a Best Friends Bundle gathered into one group. */
function groupLines(items: CartLine[]) {
  const out: { bundle: boolean; lines: CartLine[] }[] = [];
  for (const i of items) {
    const b = bundleIdOf(i);
    const hit = b == null ? undefined : out.find((g) => g.bundle && bundleIdOf(g.lines[0]) === b);
    if (hit) hit.lines.push(i);
    else out.push({ bundle: b != null, lines: [i] });
  }
  return out;
}

/** Quantity and Remove for a line (a bundle's pair moves together). */
function LineActions({ line }: { line: CartLine }) {
  const cart = useCart();
  return (
    <div className="line-act">
      <div className="qty">
        <button aria-label="Decrease quantity" onClick={() => cart.qty(line.lineId, line.qty - 1)}>−</button>
        <span>{line.qty}</span>
        <button aria-label="Increase quantity" onClick={() => cart.qty(line.lineId, line.qty + 1)}>+</button>
      </div>
      <button className="rm" onClick={() => cart.remove(line.lineId)}>Remove</button>
    </div>
  );
}

export function Wordmark({ tagline = true }: { tagline?: boolean }) {
  return (
    <Link href="/" className="wm">
      <span className="wm-t">ASHWICK HOME</span>
      {tagline && <span className="wm-s">Made of nature. Built to last.</span>}
    </Link>
  );
}

const ANNOUNCE_MS = 5000;
const SALE_BAR_KEY = "ashwick-sale-bar-dismissed";

/**
 * Alternates "Handmade to order…" with the 15% offer, which opens the email sign-up. Subscribers only see the
 * first line. Pauses while hovered or focused.
 */
export function AnnouncementBar() {
  const [offer, setOffer] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from storage after mount
      setDismissed(sessionStorage.getItem(SALE_BAR_KEY) === "1");
    } catch {}
  }, []);
  const [showOffer, setShowOffer] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let subscribed = false;
    try {
      subscribed = localStorage.getItem(SUBSCRIBED_KEY) === "subscribed";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from storage after mount
    setOffer(!subscribed);
    const done = () => { setOffer(false); setShowOffer(false); };
    window.addEventListener(SUBSCRIBED_EVENT, done);
    return () => window.removeEventListener(SUBSCRIBED_EVENT, done);
  }, []);

  useEffect(() => {
    if (!offer || paused) return;
    const t = setInterval(() => setShowOffer((v) => !v), ANNOUNCE_MS);
    return () => clearInterval(t);
  }, [offer, paused]);

  // During the sale the bar carries the event (a link to its page, closable for the visit); otherwise the usual lines.
  if (SALE.active) {
    if (dismissed) return null;
    return (
      <div className="announce announce-sale">
        <Link href={SALE.path} className="announce-link">
          <span className="announce-long">{SALE.name} at Ashwick: {SALE.percent}% off everything, free white glove with our bundles.</span>
          <span className="announce-short">{SALE.percent}% off everything · Free white glove with bundles</span>
        </Link>
        <button
          type="button"
          className="announce-x"
          aria-label="Dismiss announcement"
          onClick={() => {
            setDismissed(true);
            try { sessionStorage.setItem(SALE_BAR_KEY, "1"); } catch {}
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="announce" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <span className={showOffer ? "announce-msg" : "announce-msg on"} aria-hidden={showOffer}>Handmade to order in the USA · Nothing synthetic</span>
      {offer && (
        <button
          type="button"
          className={showOffer ? "announce-msg announce-offer on" : "announce-msg announce-offer"}
          tabIndex={showOffer ? 0 : -1}
          aria-hidden={!showOffer}
          onClick={() => window.dispatchEvent(new Event(SHOW_SIGNUP_EVENT))}
        >
          {SALE.active ? "Join the Ashwick Letter" : "Click for 15% off your first order"}
        </button>
      )}
    </div>
  );
}

export function Header() {
  const cart = useCart();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  // Close the mobile menu whenever the route changes.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenu(false);
  }
  useScrollLock(menu);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const openCart = () => cart.setOpen(true);
  const cartLabel = `Cart (${cart.count})`;

  return (
    <header className="hdr">
      <div className="hdr-in">
        <nav className="nav" aria-label="Shop">
          <Link href="/collections/all">Shop</Link>
          <Link href="/collections/sofas">Sofas</Link>
          <Link href="/collections/chairs">Chairs</Link>
          <NavMenu label="Mattress" id="mattress-menu" links={MATTRESS_LINKS} align="left" />
          <Link href="/pages/bespoke">Bespoke</Link>
          <Link href="/pages/trade" className="nav-trade">Trade</Link>
        </nav>
        <button className="burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(true)}>
          <span></span>
          <span></span>
        </button>
        <Wordmark />
        <nav className="nav r" aria-label="Ashwick">
          <Link href="/pages/our-story">Our story</Link>
          <NavMenu label="Materials" id="materials-menu" links={MATERIAL_LINKS} all={["All materials", MATERIALS_PATH]} />
          <Link href="/account">Account</Link>
          <button type="button" className="linkbtn" onClick={openCart}>{cartLabel}</button>
        </nav>
        <button type="button" className={"mcart linkbtn " + upsell.mcartLabel} aria-label={cartLabel} data-label={cartLabel} onClick={openCart}></button>
      </div>
      {/* On <body>, above the add-to-cart bar, chat button and 15% tab (inside the sticky header it was capped below them).
          Any link closes it, including one to the page you're already on. */}
      {menu && createPortal(
        <div
          className="mmenu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onClick={(e) => (e.target as HTMLElement).closest("a") && setMenu(false)}
        >
          <div className="mmenu-top">
            <Wordmark tagline={false} />
            <button className="x" aria-label="Close" onClick={() => setMenu(false)}>×</button>
          </div>
          <nav className="mmenu-links">
            {SALE.active && <Link href={SALE.path} className="mmenu-sale">{SALE.name}</Link>}
            <Link href="/collections/all">Shop</Link>
            <Link href="/collections/sofas">Sofas</Link>
            <Link href="/collections/chairs">Chairs</Link>
            <Link href="/products/luxury-organic-mattress">Mattress</Link>
            {MATTRESS_LINKS.map(([t, , href]) => <Link key={href} href={href} className="mmenu-child">{t}</Link>)}
            <Link href="/pages/bespoke">Bespoke</Link>
            <Link href="/pages/trade">Trade</Link>
          </nav>
          <nav className="mmenu-sub">
            <Link href="/pages/our-story">Our story</Link>
            <Link href={MATERIALS_PATH}>Materials</Link>
            {MATERIAL_LINKS.map(([t, , href]) => <Link key={href} href={href} className="mmenu-child">{t}</Link>)}
            <Link href="/account">Account</Link>
          </nav>
        </div>,
        document.body,
      )}
    </header>
  );
}

export function CartDrawer() {
  const cart = useCart();
  const close = () => cart.setOpen(false);
  const [checking, setChecking] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [saveEmail, setSaveEmail] = useState("");
  const [savePhone, setSavePhone] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "sending" | "done" | "error" | "badphone">("idle");
  // The email offer is open whenever the cart opens, on phones too: most add-to-carts here are phone visitors
  // who leave without buying, and this is the moment they're most interested.
  const [offerOpen, setOfferOpen] = useState(false);
  // Phones: the email offer stays folded (one line) so the products and Check out stay visible. Desktop has room, so it opens.
  useEffect(() => {
    if (cart.open) setOfferOpen(!window.matchMedia("(max-width: 640px)").matches);
  }, [cart.open]);

  // Phones: the cart is a bottom sheet. Drag the header down, or tap outside, to close it.
  const sheetRef = useRef<HTMLElement>(null);
  const dragY = useRef<number | null>(null);
  const onDragStart = (e: React.TouchEvent) => { dragY.current = e.touches[0].clientY; };
  const onDragMove = (e: React.TouchEvent) => {
    if (dragY.current == null || !sheetRef.current) return;
    const dy = Math.max(0, e.touches[0].clientY - dragY.current);
    sheetRef.current.style.transition = "none";
    sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onDragEnd = (e: React.TouchEvent) => {
    if (dragY.current == null || !sheetRef.current) return;
    const dy = e.changedTouches[0].clientY - dragY.current;
    dragY.current = null;
    sheetRef.current.style.transition = "";
    sheetRef.current.style.transform = "";
    if (dy > 70) cart.setOpen(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveEmail.trim()) return;
    const phone = savePhone.trim() ? normalizePhone(savePhone) : null;
    if (savePhone.trim() && !phone) {
      setSaveState("badphone");
      return;
    }
    setSaveState("sending");
    try {
      await saveCart(
        saveEmail,
        cart.items.map((i) => ({ productId: i.id, name: i.name, qty: i.qty, price: i.price, options: i.options, photo: i.photo })),
        cart.subtotal,
        phone,
      );
      setSaveState("done");
    } catch {
      setSaveState("error");
    }
  };

  const checkout = async () => {
    setChecking(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: cart.items.map((i) => ({
            productId: i.id,
            qty: i.qty,
            options: i.options,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error ?? "Checkout failed");

      // Meta Pixel: InitiateCheckout, then a short pause so the event is sent
      // before the redirect to Shopify unloads the page.
      trackThen(
        "InitiateCheckout",
        {
          value: cart.subtotal ?? 0,
          num_items: cart.items.reduce((s, i) => s + i.qty, 0),
          content_ids: cart.items.map((i) => i.id),
          contents: cart.items.map((i) => ({ id: i.id, quantity: i.qty, item_price: i.price ?? undefined })),
          content_type: "product",
        },
        () => {
          window.location.href = data.checkoutUrl;
        },
      );
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setChecking(false);
    }
  };

  useScrollLock(cart.open);
  useEffect(() => {
    if (!cart.open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart]);

  return (
    <>
      <div className={"scrim" + (cart.open ? " on" : "")} onClick={close}></div>
      <aside ref={sheetRef} className={"drawer" + (cart.open ? " on" : "")} aria-hidden={!cart.open} aria-label="Cart" inert={!cart.open}>
        <div className="drawer-h" onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}>
          <span className="drawer-grab" aria-hidden="true"></span>
          <div className="h3">Your cart</div>
          <button className="x" aria-label="Close cart" onClick={close}>×</button>
        </div>
        <div className="drawer-b">
          {cart.items.length === 0 && (
            <div className="empty">
              <p className="body">Your cart is empty.</p>
              <Link href="/collections/all" className="btn" onClick={close}>Shop the collection</Link>
            </div>
          )}
          {groupLines(cart.items).map((g) =>
            g.bundle ? (
              <div className="line bundle-line" key={g.lines[0].lineId}>
                <div className="bundle-pics">
                  {g.lines.map((i) => <Photo key={i.lineId} src={i.photo} label={i.name} className="line-img" sizes="96px" preload />)}
                </div>
                <div>
                  <div className="line-top">
                    <span className="line-name">{bundleTitleFor(g.lines[0].options.find(([k]) => k === "_Bundle")?.[1] ?? "")}</span>
                    <span className="line-price">
                      <s className="price-was">{fmt(g.lines.reduce((s, i) => s + (i.price ?? 0), 0) * g.lines[0].qty)}</s>
                      {fmt(g.lines.reduce((s, i) => s + bundlePrice(i.price ?? 0), 0) * g.lines[0].qty)}
                    </span>
                  </div>
                  <div className="line-mode">{SALE.percent}% off{BUNDLE_CONFIG.whiteGloveIncluded ? " · Free white glove" : ""}</div>
                  {g.lines.map((i) => (
                    <div className="line-opt bundle-item" key={i.lineId}>
                      <strong>{i.name}</strong>{" "}
                      {i.id === BUNDLE_CONFIG.beddingSet.handle
                        ? (() => { const o = (k: string) => i.options.find(([key]) => key === k)?.[1] ?? ""; return `${o("Mattress size")} · ${o("Pillow")} pillows, ${o("Pillow size")} in · ${o("Cover color")} covers · Mattress Protector`; })()
                        : i.options.filter(([k]) => !k.startsWith("_") && k !== "Feel").map(([, v]) => v).join(" · ")}
                    </div>
                  ))}
                  <LineActions line={g.lines[0]} />
                </div>
              </div>
            ) : (
              g.lines.map((i) => {
                const d = deliveryFor(i);
                return (
                  <div className="line" key={i.lineId}>
                    <Photo src={i.photo} label={i.name} className="line-img" sizes="96px" preload />
                    <div>
                      <div className="line-top">
                        <span className="line-name">{i.name}</span>
                        <span className="line-price">
                          {i.price == null ? "[PRICE]" : SALE.active ? <><s className="price-was">{fmt(i.price * i.qty)}</s>{fmt(salePrice(i.price) * i.qty)}</> : fmt(i.price * i.qty)}
                        </span>
                      </div>
                      <div className="line-mode">{i.mode}{SALE.active && i.price != null ? ` · ${SALE.percent}% off` : ""}</div>
                      {i.options.filter(([k]) => !k.startsWith("_")).map(([k, v]) => (
                        <div className="line-opt" key={k}><span>{k}</span>{v}</div>
                      ))}
                      {d && !isFurnitureLine(i) && (
                        <div className="line-opt"><span>Delivery</span>{d.label} · {d.price === 0 ? "Complimentary" : fmt(d.price * i.qty)}</div>
                      )}
                      <LineActions line={i} />
                    </div>
                  </div>
                );
              })
            ),
          )}
        </div>
        {cart.items.length > 0 && (
          <div className="drawer-f">
            <CartUpsell items={cart.items} onNavigate={close} />
            {orderDelivery(cart.items) > 0 && (
              <div className="sub" style={{ marginBottom: 4 }}>
                <span className="eyebrow">White glove delivery, furniture (one flat charge per order)</span>
                <span className="sub-v">{fmt(orderDelivery(cart.items))}</span>
              </div>
            )}
            <div className="sub">
              <span className="eyebrow">Subtotal</span>
              <span className="sub-v">{fmt(cart.subtotal)}</span>
            </div>
            <p className="fine">
              {cartNote(cart.items)}
            </p>
            {checkoutError && <p className="fine" style={{ color: "var(--err, #b00)" }}>{checkoutError}</p>}
            <button className="btn full" onClick={checkout} disabled={checking}>
              {checking ? "Redirecting…" : "Check out"}
            </button>
            <p className="fine" style={{ textAlign: "center" }}>
              Questions? Call or text <a href={`tel:${STUDIO_PHONE.replace(/\D/g, "")}`} style={{ textDecoration: "underline" }}>{STUDIO_PHONE}</a>
            </p>
            {saveState === "done" ? (
              <p className="fine">Saved. We&rsquo;ve emailed your cart.{!SALE.active && " Plus 15% off your first order from The Ashwick Letter."}</p>
            ) : (
              <form onSubmit={save} className="save-cart">
                <button type="button" className="save-cart-toggle" aria-expanded={offerOpen} aria-controls="save-cart-body" onClick={() => setOfferOpen((o) => !o)}>
                  <span>{SALE.active ? "Not ready? Email me this cart." : "Not ready? Email me this cart, plus 15% off."}</span>
                  <span aria-hidden="true">{offerOpen ? "−" : "+"}</span>
                </button>
                {offerOpen && (
                  <div id="save-cart-body" className="save-cart-body">
                    <div className="save-cart-row">
                      <input id="save-cart-email" type="email" required aria-label="Your email" placeholder="Your email" value={saveEmail} onChange={(e) => setSaveEmail(e.target.value)} />
                      <button type="submit" className="btn" disabled={saveState === "sending"}>{saveState === "sending" ? "Sending…" : "Send"}</button>
                    </div>
                    {saveState === "error" && <p className="fine" style={{ color: "var(--err, #b00)" }}>That didn&rsquo;t go through. Please try again.</p>}
                    <div className="save-cart-row">
                      <input id="save-cart-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Phone (optional)" aria-label="Phone number, optional" value={savePhone} onChange={(e) => setSavePhone(e.target.value)} />
                    </div>
                    <p className="fine" style={{ fontSize: 11 }}>Prefer a text or a call? Add your number and we&rsquo;ll reach out about your cart. We&rsquo;ll only contact you about your order or cart. By sending, you join The Ashwick Letter. Unsubscribe any time.</p>
                    {saveState === "badphone" && <p className="fine" style={{ color: "var(--err, #b00)" }}>Please enter a 10-digit US phone number, or leave it blank.</p>}
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
