"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { track } from "@/lib/pixel";
import { trackAddedToCart } from "@/lib/subscribe";
import type { PhotoKey } from "@/lib/photos";
import { BUNDLE, bundlePrice, deliveryFor, salePrice } from "@/lib/sale";

/** The Best Friends Bundle id a line belongs to (all lines of the bundle share it), if any. */
export const bundleIdOf = (l: { options: [string, string][] }) =>
  l.options.find(([k]) => k === BUNDLE.attribute) ? (l.options.find(([k]) => k === BUNDLE.idAttribute)?.[1] ?? "bundle") : null;

/** What one unit of a line costs now: the sale price plus any per-piece delivery. Matches what Shopify charges at checkout. */
export const unitTotal = (l: { id: string; price: number | null; options?: [string, string][]; delivery?: { label: string; price: number } }) =>
  (l.options && bundleIdOf({ options: l.options }) ? bundlePrice(l.price ?? 0) : salePrice(l.price ?? 0)) + (deliveryFor(l)?.price ?? 0);

export type CartLine = {
  lineId: string;
  id: string;
  name: string;
  photo: PhotoKey;
  price: number | null;
  qty: number;
  mode: "As designed" | "Customized" | "Pre-order";
  options: [string, string][];
  /** Per-piece delivery charge (e.g. white glove), added to the subtotal. */
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
};

const STORAGE_KEY = "ashwick-cart";
const CartCtx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Restore after mount so server and client render the same empty cart first.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Carts saved before the fabric was renamed say "Italian Linen"; it's Belgian Linen.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
      if (saved) setItems(JSON.parse(saved.replaceAll("Italian Linen", "Belgian Linen")));
    } catch {}
    setLoaded(true);
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
      value: unitTotal(line) * line.qty,
    });
    // Tell Klaviyo (known subscribers only) so the abandoned-cart flow can follow up.
    void trackAddedToCart(
      [{ productId: line.id, name: line.name, qty: line.qty, price: line.price, options: line.options }],
      line.price == null ? null : unitTotal(line) * line.qty,
    );
    setOpen(true);
  }, []);
  const addMany = useCallback((lines: Omit<CartLine, "lineId">[]) => {
    setItems((c) => [...c, ...lines.map((l) => ({ ...l, lineId: Math.random().toString(36).slice(2, 9) }))]);
    track("AddToCart", {
      content_ids: lines.map((l) => l.id),
      content_name: BUNDLE.title,
      content_type: "product",
      contents: lines.map((l) => ({ id: l.id, quantity: l.qty, item_price: l.price == null ? undefined : salePrice(l.price) })),
      value: lines.reduce((s, l) => s + unitTotal(l) * l.qty, 0),
    });
    void trackAddedToCart(
      lines.map((l) => ({ productId: l.id, name: l.name, qty: l.qty, price: l.price, options: l.options })),
      lines.reduce((s, l) => s + unitTotal(l) * l.qty, 0),
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
    const subtotal = unpriced ? null : items.reduce((s, i) => s + unitTotal(i) * i.qty, 0);
    return { items, open, setOpen, add, addMany, remove, qty, count, subtotal };
  }, [items, open, add, addMany, remove, qty]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const cart = useContext(CartCtx);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}
