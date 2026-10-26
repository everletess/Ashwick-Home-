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
import { useCart } from "@/components/cart";
import { SHOW_SIGNUP_EVENT } from "@/components/email-popup";
import { SUBSCRIBED_EVENT, SUBSCRIBED_KEY } from "@/lib/subscribe";
import { trackThen } from "@/lib/pixel";
import { saveCart, normalizePhone } from "@/lib/subscribe";
import { MATTRESS } from "@/lib/mattress";
import { DOG_BED_ID } from "@/lib/dog-bed";
import { ASHBURY_PATH, FURNITURE_MATERIALS_PATH, MATERIALS_PATH } from "@/lib/materials";

const MATERIAL_LINKS: [string, string, string][] = [
  ["The Ashbury", "Inside the mattress", ASHBURY_PATH],
  ["Furniture", "Frames, fills and fabrics", FURNITURE_MATERIALS_PATH],
];

/** "Materials" in the header: opens on hover or click and lists the mattress and furniture materials pages. */
function MaterialsMenu() {
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
      <button type="button" className="linkbtn nav-dd-btn" aria-expanded={open} aria-controls="materials-menu" onClick={() => setOpen((v) => !v)}>
        Materials<span className="nav-dd-caret" aria-hidden="true" />
      </button>
      {open && (
        <div className="nav-dd-panel" id="materials-menu">
          {MATERIAL_LINKS.map(([t, d, href]) => (
            <Link key={href} href={href} className="nav-dd-item">
              <span className="nav-dd-t">{t}</span>
              <span className="nav-dd-d">{d}</span>
            </Link>
          ))}
          <Link href={MATERIALS_PATH} className="nav-dd-all">All materials</Link>
        </div>
      )}
    </div>
  );
}
import { Photo } from "@/components/photo";
import { fmt } from "@/lib/products";

export function Wordmark({ tagline = true }: { tagline?: boolean }) {
  return (
    <Link href="/" className="wm">
      <span className="wm-t">ASHWICK HOME</span>
      {tagline && <span className="wm-s">Made of nature. Built to last.</span>}
    </Link>
  );
}

const ANNOUNCE_MS = 5000;

/**
 * Alternates "Handmade to order…" with the 15% offer, which opens the email sign-up. Subscribers only see the
 * first line. Pauses while hovered or focused.
 */
export function AnnouncementBar() {
  const [offer, setOffer] = useState(false);
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
          Click for 15% off your first order
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
          <Link href="/products/luxury-organic-mattress">Mattress</Link>
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
          <MaterialsMenu />
          <Link href="/account">Account</Link>
          <button type="button" className="linkbtn" onClick={openCart}>{cartLabel}</button>
        </nav>
        <button type="button" className="mcart linkbtn" onClick={openCart}>{cartLabel}</button>
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
            <Link href="/collections/all">Shop</Link>
            <Link href="/collections/sofas">Sofas</Link>
            <Link href="/collections/chairs">Chairs</Link>
            <Link href="/products/luxury-organic-mattress">Mattress</Link>
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
  // On phones the email offer starts folded so the items and Check out keep the screen; on larger screens it starts open.
  const [offerOpen, setOfferOpen] = useState(false);
  useEffect(() => {
    if (cart.open && window.matchMedia("(min-width: 641px)").matches) setOfferOpen(true);
  }, [cart.open]);

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
        cart.items.map((i) => ({ productId: i.id, name: i.name, qty: i.qty, price: i.price, options: i.options })),
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
      <aside className={"drawer" + (cart.open ? " on" : "")} aria-hidden={!cart.open} aria-label="Cart" inert={!cart.open}>
        <div className="drawer-h">
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
          {cart.items.map((i) => (
            <div className="line" key={i.lineId}>
              <Photo src={i.photo} label={i.name} className="line-img" sizes="96px" preload />
              <div>
                <div className="line-top">
                  <span className="line-name">{i.name}</span>
                  <span className="line-price">{i.price == null ? "[PRICE]" : fmt(i.price * i.qty)}</span>
                </div>
                <div className="line-mode">{i.mode}</div>
                {i.options.map(([k, v]) => (
                  <div className="line-opt" key={k}><span>{k}</span>{v}</div>
                ))}
                {i.delivery && (
                  <div className="line-opt"><span>Delivery</span>{i.delivery.label} · {fmt(i.delivery.price * i.qty)}</div>
                )}
                <div className="line-act">
                  <div className="qty">
                    <button aria-label="Decrease quantity" onClick={() => cart.qty(i.lineId, i.qty - 1)}>−</button>
                    <span>{i.qty}</span>
                    <button aria-label="Increase quantity" onClick={() => cart.qty(i.lineId, i.qty + 1)}>+</button>
                  </div>
                  <button className="rm" onClick={() => cart.remove(i.lineId)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.items.length > 0 && (
          <div className="drawer-f">
            <div className="sub">
              <span className="eyebrow">Subtotal</span>
              <span className="sub-v">{fmt(cart.subtotal)}</span>
            </div>
            <p className="fine">
              {cart.items.every((i) => i.delivery)
                ? "Paid in full at checkout. Includes delivery shown above. Taxes calculated at checkout."
                : cart.items.every((i) => i.id === MATTRESS.id || i.id === DOG_BED_ID)
                  ? "Free delivery. Ships within 3–4 days. Paid in full at checkout, taxes calculated there."
                  : "Paid in full at checkout. Taxes and shipping calculated at checkout."}
            </p>
            {checkoutError && <p className="fine" style={{ color: "var(--err, #b00)" }}>{checkoutError}</p>}
            <button className="btn full" onClick={checkout} disabled={checking}>
              {checking ? "Redirecting…" : "Check out"}
            </button>
            {saveState === "done" ? (
              <p className="fine">Saved. We&rsquo;ve emailed your cart, with 15% off your first order from The Ashwick Letter.</p>
            ) : (
              <form onSubmit={save} className="save-cart">
                <button type="button" className="save-cart-toggle" aria-expanded={offerOpen} aria-controls="save-cart-body" onClick={() => setOfferOpen((o) => !o)}>
                  <span>Not ready? Email me my cart, plus 15% off.</span>
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
