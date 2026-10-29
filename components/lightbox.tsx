"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

export type LightboxItem = { photo: PhotoKey; alt: string };

const MAX = 4;
const TAP_ZOOM = 2.5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Full-screen product photos: tap or click a gallery photo to open. Pinch, double-tap, click or scroll to zoom;
 * drag to pan when zoomed; swipe or the arrows to move between photos; Esc or × to close.
 * `overlay` draws over a photo (the recolored upholstery on furniture), inside the zoomed layer so it stays aligned.
 */
export function Lightbox({ items, start, onClose, overlay }: {
  items: LightboxItem[];
  start: number;
  onClose: () => void;
  overlay?: (photo: PhotoKey) => ReactNode;
}) {
  const [i, setI] = useState(start);
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  // While a finger or the mouse is down the photo follows it exactly; otherwise zoom changes ease.
  const [held, setHeld] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pts = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ s: number; x: number; y: number; px: number; py: number; dist: number; moved: boolean; t: number } | null>(null);
  const lastTap = useRef(0);
  const n = items.length;

  const go = useCallback((d: number) => {
    setI((k) => (k + d + n) % n);
    setView({ s: 1, x: 0, y: 0 });
  }, [n]);

  // Esc, arrows, scroll lock and focus while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  /** A point relative to the stage's center, where the zoom transform has its origin. */
  const rel = (x: number, y: number) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: x - r.left - r.width / 2, y: y - r.top - r.height / 2 };
  };
  /** Keeps a zoomed photo from being dragged off screen. */
  const bound = (v: { s: number; x: number; y: number }) => {
    const r = stage.current!.getBoundingClientRect();
    const bx = ((v.s - 1) * r.width) / 2;
    const by = ((v.s - 1) * r.height) / 2;
    return v.s <= 1 ? { s: 1, x: 0, y: 0 } : { s: v.s, x: clamp(v.x, -bx, bx), y: clamp(v.y, -by, by) };
  };
  /** Zoom to `s`, keeping the photo point under (cx, cy) where it is. */
  const zoomAt = (v: { s: number; x: number; y: number }, s: number, cx: number, cy: number) => {
    const p = rel(cx, cy);
    const k = s / v.s;
    return bound({ s, x: p.x - (p.x - v.x) * k, y: p.y - (p.y - v.y) * k });
  };

  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const ps = [...pts.current.values()];
    const mid = ps.length === 2 ? { x: (ps[0].x + ps[1].x) / 2, y: (ps[0].y + ps[1].y) / 2 } : ps[0];
    const dist = ps.length === 2 ? Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) : 0;
    gesture.current = { ...view, px: mid.x, py: mid.y, dist, moved: ps.length > 1, t: Date.now() };
    setHeld(true);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!pts.current.has(e.pointerId) || !gesture.current) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    const ps = [...pts.current.values()];
    if (ps.length === 2 && g.dist) {
      const mid = { x: (ps[0].x + ps[1].x) / 2, y: (ps[0].y + ps[1].y) / 2 };
      const s = clamp((g.s * Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y)) / g.dist, 1, MAX);
      // The photo point that was under the fingers' midpoint stays under it as they move and spread.
      const p0 = rel(g.px, g.py);
      const p = rel(mid.x, mid.y);
      setView(bound({ s, x: p.x - ((p0.x - g.x) * s) / g.s, y: p.y - ((p0.y - g.y) * s) / g.s }));
      g.moved = true;
      return;
    }
    const dx = e.clientX - g.px;
    const dy = e.clientY - g.py;
    if (Math.hypot(dx, dy) > 8) g.moved = true;
    if (g.s > 1) setView(bound({ s: g.s, x: g.x + dx, y: g.y + dy }));
  };

  const onUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    const had = pts.current.size;
    pts.current.delete(e.pointerId);
    if (!pts.current.size) setHeld(false);
    if (!g) return;
    if (had > 1) {
      // One finger lifted from a pinch: carry on panning from where the other one is.
      const rest = [...pts.current.values()][0];
      gesture.current = rest ? { ...view, px: rest.x, py: rest.y, dist: 0, moved: true, t: Date.now() } : null;
      return;
    }
    gesture.current = null;
    const dx = e.clientX - g.px;
    if (g.moved) {
      if (g.s <= 1 && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      return;
    }
    // A tap: a mouse click zooms in or out; on touch, a double tap does.
    const now = Date.now();
    if (e.pointerType === "mouse" || now - lastTap.current < 300) {
      setView((v) => (v.s > 1 ? { s: 1, x: 0, y: 0 } : zoomAt(v, TAP_ZOOM, e.clientX, e.clientY)));
      lastTap.current = 0;
    } else lastTap.current = now;
  };

  const onWheel = (e: React.WheelEvent) => {
    const s = clamp(view.s * Math.exp(-e.deltaY * 0.0015), 1, MAX);
    setView((v) => zoomAt(v, s, e.clientX, e.clientY));
  };

  const item = items[i];
  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={`Photo ${i + 1} of ${n}: ${item.alt}`}>
      <div className="lb-top">
        <span className="lb-count">{n > 1 ? `${i + 1} / ${n}` : ""}</span>
        <span className="lb-hint">{view.s > 1 ? "Drag to look around" : "Pinch, double-tap or click to zoom"}</span>
        <button ref={closeBtn} className="lb-close" aria-label="Close" onClick={onClose}>×</button>
      </div>
      <div
        ref={stage}
        className={"lb-stage" + (view.s > 1 ? " zoomed" : "") + (held ? " held" : "")}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={(e) => { pts.current.delete(e.pointerId); gesture.current = null; setHeld(false); }}
        onWheel={onWheel}
      >
        <div
          className="lb-layer"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
        >
          <Image key={item.photo} src={PHOTOS[item.photo]} alt={item.alt} fill sizes="100vw" placeholder="blur" preload draggable={false} />
          {overlay?.(item.photo)}
        </div>
      </div>
      {n > 1 && (
        <>
          <button className="lb-arrow prev" aria-label="Previous photo" onClick={() => go(-1)}>‹</button>
          <button className="lb-arrow next" aria-label="Next photo" onClick={() => go(1)}>›</button>
        </>
      )}
    </div>,
    document.body,
  );
}
