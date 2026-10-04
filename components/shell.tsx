"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

export function AnnouncementBar() {
  return <div className="announce">Handmade to order in the USA · Nothing synthetic</div>;
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
          <Link href="/pages/design-your-own">Design your own</Link>
          <Link href="/pages/trade" className="nav-trade">Trade</Link>
        </nav>
        <button className="burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(true)}>
          <span></span>
          <span></span>
        </button>
        <Wordmark />
        <nav className="nav r" aria-label="Ashwick">
          <Link href="/pages/our-story">Our story</Link>
          <Link href="/pages/materials">Materials</Link>
          <Link href="/account">Account</Link>
          <button type="button" className="linkbtn" onClick={openCart}>{cartLabel}</button>
        </nav>
        <button type="button" className="mcart linkbtn" onClick={openCart}>{cartLabel}</button>
      </div>
      {menu && (
        <div className="mmenu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mmenu-top">
            <Wordmark tagline={false} />
            <button className="x" aria-label="Close" onClick={() => setMenu(false)}>×</button>
          </div>
          <nav className="mmenu-links">
            <Link href="/collections/all">Shop</Link>
            <Link href="/collections/sofas">Sofas</Link>
            <Link href="/collections/chairs">Chairs</Link>
            <Link href="/pages/design-your-own">Design your own</Link>
            <Link href="/pages/trade">Trade</Link>
          </nav>
          <nav className="mmenu-sub">
            <Link href="/pages/our-story">Our story</Link>
            <Link href="/pages/materials">Materials</Link>
            <Link href="/account">Account</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function CartDrawer() {
  const cart = useCart();
  const close = () => cart.setOpen(false);
  const [checking, setChecking] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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
      window.location.href = data.checkoutUrl;
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
              <Photo src={i.photo} label={i.name} className="line-img" sizes="96px" />
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
                : "Paid in full at checkout. Taxes and shipping calculated at checkout."}
            </p>
            {checkoutError && <p className="fine" style={{ color: "var(--err, #b00)" }}>{checkoutError}</p>}
            <button className="btn full" onClick={checkout} disabled={checking}>
              {checking ? "Redirecting…" : "Check out"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
