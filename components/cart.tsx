"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PhotoKey } from "@/lib/photos";

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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
      if (saved) setItems(JSON.parse(saved));
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
    setOpen(true);
  }, []);
  const remove = useCallback((lineId: string) => setItems((c) => c.filter((i) => i.lineId !== lineId)), []);
  const qty = useCallback(
    (lineId: string, q: number) =>
      setItems((c) => c.map((i) => (i.lineId === lineId ? { ...i, qty: Math.max(1, q) } : i))),
    [],
  );

  const value = useMemo<Cart>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const unpriced = items.some((i) => i.price == null);
    const subtotal = unpriced ? null : items.reduce((s, i) => s + ((i.price ?? 0) + (i.delivery?.price ?? 0)) * i.qty, 0);
    return { items, open, setOpen, add, remove, qty, count, subtotal };
  }, [items, open, add, remove, qty]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const cart = useContext(CartCtx);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}
