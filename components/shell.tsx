"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
            <p className="fine">Paid in full at checkout. Taxes and shipping calculated at checkout.</p>
            {/* TODO: create a Shopify checkout from the cart lines and redirect to its checkoutUrl. */}
            <button className="btn full">Check out</button>
          </div>
        )}
      </aside>
    </>
  );
}
