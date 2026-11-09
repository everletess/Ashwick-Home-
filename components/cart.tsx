"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { track } from "@/lib/pixel";
import { trackAddedToCart } from "@/lib/subscribe";
import type { PhotoKey } from "@/lib/photos";
import { BUNDLES, SALE, bundlePrice, bundleTitleFor, orderDelivery, salePrice } from "@/lib/sale";
import { isUnavailable, migrateLine, productPathOf } from "@/lib/cart-migrate";

/** The bundle id a line belongs to (all lines of the bundle share it), if any. */
export const bundleIdOf = (l: { options: [string, string][] }) =>
  l.options.find(([k]) => k === "_Bundle") ? (l.options.find(([k]) => k === "_Bundle ID")?.[1] ?? "bundle") : null;

/** What one unit of a line costs now (sale price). Delivery is added once per order by `orderDelivery`, not per line; the mattress' own delivery is per mattress. */
export const unitTotal = (l: { id: string; price: number | null; options?: [string, string][]; delivery?: { label: string; price: number } }) =>
  (l.options && bundleIdOf({ options: l.options }) ? bundlePrice(l.price ?? 0) : salePrice(l.price ?? 0)) + mattressDeliveryOf(l);

import { isFurnitureLine } from "@/lib/sale";
/** A mattress line carries its own delivery per unit; furniture delivery is per order. */
const mattressDeliveryOf = (l: { id: string; delivery?: { label: string; price: number } }) => (isFurnitureLine(l) || SALE.active ? 0 : (l.delivery?.price ?? 0));

export type CartLine = {
  lineId: string;
  id: string;
  name: string;
  photo: PhotoKey;
  price: number | null;
  qty: number;
  mode: "As designed" | "Customized" | "Pre-order";
  options: [string, string][];
  /** Delivery as stored on the line. Furniture's is charged once per order (see orderDelivery), not per line. */
  delivery?: { label: string; price: number };
};

type Cart = {
  items: CartLine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "lineId">) => void;
  /** Several lines in one action (a bundle). */
  addMany: (lines: Omit<CartLine, "lineId">[]) => void;
  remove: (lineId: string) => void;
  qty: (lineId: string, qty: number) => void;
  count: number;
  subtotal: number | null;
  /** Items taken out because they're no longer sold in those options (old carts), with where to choose again. */
  notice: CartNotice[];
  dismissNotice: () => void;
  /** Take lines out (with the rest of their bundle) and say so in `notice`. */
  drop: (lineIds: string[]) => void;
};

export type CartNotice = { name: string; href: string };

const STORAGE_KEY = "ashwick-cart";
const CartCtx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [notice, setNotice] = useState<CartNotice[]>([]);

  /** Lines (and the rest of their bundles) taken out, as notices: what it was and where to choose again. */
  const withoutLines = (list: CartLine[], ids: Set<string>) => {
    const bundles = new Set(list.filter((i) => ids.has(i.lineId)).map(bundleIdOf).filter(Boolean));
    const gone = list.filter((i) => ids.has(i.lineId) || (bundleIdOf(i) != null && bundles.has(bundleIdOf(i))));
    const notes = new Map<string, CartNotice>();
    for (const g of gone) {
      const b = g.options.find(([k]) => k === "_Bundle")?.[1];
      const n = b ? { name: bundleTitleFor(b), href: BUNDLES.find((x) => x.value === b)?.path ?? productPathOf(g.id) } : { name: g.name, href: productPathOf(g.id) };
      notes.set(n.name, n);
    }
    return { kept: list.filter((i) => !gone.includes(i)), notes: [...notes.values()] };
  };

  // Restore after mount so server and client render the same empty cart first. Old carts are brought up to date:
  // renamed options are migrated quietly; lines with no current equivalent come out with a note, never blocking checkout.
  useEffect(() => {
    let restored: CartLine[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Carts saved before the fabric was renamed say "Italian Linen"; it's Belgian Linen.
      if (saved) restored = (JSON.parse(saved.replaceAll("Italian Linen", "Belgian Linen")) as CartLine[]).map(migrateLine);
    } catch {}
    const { kept, notes } = withoutLines(restored, new Set(restored.filter(isUnavailable).map((i) => i.lineId)));
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from storage */
    setItems(kept);
    if (notes.length) setNotice(notes);
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (!kept.length) return;
    // Then confirm the rest against Shopify's current variants.
    fetch("/api/cart-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: kept.map((i) => ({ productId: i.id, qty: i.qty, options: i.options })) }) })
      .then((r) => (r.ok ? r.json() : { bad: [] }))
      .then(({ bad }: { bad: number[] }) => {
        if (!bad?.length) return;
        const ids = new Set(bad.map((n) => kept[n]?.lineId).filter(Boolean) as string[]);
        setItems((cur) => {
          const r = withoutLines(cur, ids);
          setNotice((n) => [...n, ...r.notes.filter((x) => !n.some((y) => y.name === x.name))]);
          return r.kept;
        });
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback((line: Omit<CartLine, "lineId">) => {
    setItems((c) => [...c, { ...line, lineId: Math.random().toString(36).slice(2, 9) }]);
    track("AddToCart", {
      content_ids: [line.id],
      content_name: line.name,
      content_type: "product",
      contents: [{ id: line.id, quantity: line.qty, item_price: line.price ?? undefined }],
      value: unitTotal(line) * line.qty + (isFurnitureLine(line) ? orderDelivery([line]) : 0),
    });
    // Tell Klaviyo (known subscribers only) so the abandoned-cart flow can follow up.
    void trackAddedToCart(
      [{ productId: line.id, name: line.name, qty: line.qty, price: line.price, options: line.options, photo: line.photo }],
      line.price == null ? null : unitTotal(line) * line.qty + (isFurnitureLine(line) ? orderDelivery([line]) : 0),
    );
    setOpen(true);
  }, []);
  const addMany = useCallback((lines: Omit<CartLine, "lineId">[]) => {
    setItems((c) => [...c, ...lines.map((l) => ({ ...l, lineId: Math.random().toString(36).slice(2, 9) }))]);
    track("AddToCart", {
      content_ids: lines.map((l) => l.id),
      content_name: bundleTitleFor(lines[0]?.options.find(([k]) => k === "_Bundle")?.[1] ?? ""),
      content_type: "product",
      contents: lines.map((l) => ({ id: l.id, quantity: l.qty, item_price: l.price == null ? undefined : salePrice(l.price) })),
      value: lines.reduce((s, l) => s + unitTotal(l) * l.qty, 0) + orderDelivery(lines),
    });
    void trackAddedToCart(
      lines.map((l) => ({ productId: l.id, name: l.name, qty: l.qty, price: l.price, options: l.options, photo: l.photo })),
      lines.reduce((s, l) => s + unitTotal(l) * l.qty, 0) + orderDelivery(lines),
    );
    setOpen(true);
  }, []);
  // The lines of a bundle are removed, and change quantity, together.
  const remove = useCallback(
    (lineId: string) =>
      setItems((c) => {
        const b = bundleIdOf(c.find((i) => i.lineId === lineId) ?? { options: [] });
        return c.filter((i) => i.lineId !== lineId && (b == null || bundleIdOf(i) !== b));
      }),
    [],
  );
  const qty = useCallback(
    (lineId: string, q: number) =>
      setItems((c) => {
        const b = bundleIdOf(c.find((i) => i.lineId === lineId) ?? { options: [] });
        return c.map((i) => (i.lineId === lineId || (b != null && bundleIdOf(i) === b) ? { ...i, qty: Math.max(1, q) } : i));
      }),
    [],
  );

  const value = useMemo<Cart>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const unpriced = items.some((i) => i.price == null);
    const subtotal = unpriced ? null : items.reduce((s, i) => s + unitTotal(i) * i.qty, 0) + orderDelivery(items);
    const dismissNotice = () => setNotice([]);
    const drop = (ids: string[]) => {
      const r = withoutLines(items, new Set(ids));
      setItems(r.kept);
      setNotice((n) => [...n, ...r.notes.filter((x) => !n.some((y) => y.name === x.name))]);
    };
    return { items, open, setOpen, add, addMany, remove, qty, count, subtotal, notice, dismissNotice, drop };
  }, [items, open, add, addMany, remove, qty, notice]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const cart = useContext(CartCtx);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}

/** The note for items an old cart held in options no longer sold, each with a link to choose again. */
export function CartNoticeBox({ onNavigate }: { onNavigate?: () => void }) {
  const { notice, dismissNotice } = useCart();
  if (!notice.length) return null;
  return (
    <div className="cart-notice" role="status">
      <p>
        {notice.length === 1 ? "One item in your cart is no longer available in that size. Please choose again." : "Some items in your cart are no longer available in those sizes. Please choose again."}
      </p>
      <p className="cart-notice-links">
        {notice.map((n) => <a key={n.name} href={n.href} onClick={() => { dismissNotice(); onNavigate?.(); }}>Choose again: {n.name} →</a>)}
      </p>
      <button type="button" className="cart-notice-x" aria-label="Dismiss" onClick={dismissNotice}>×</button>
    </div>
  );
}
