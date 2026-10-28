"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Photo } from "@/components/photo";
import { TintedPhoto } from "@/components/tinted-photo";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

export type LightboxItem = { photo: PhotoKey; alt: string; tint?: string };

const MAX = 4;
const DOUBLE = 2.5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Full-screen product photo viewer. Pinch, double-tap or wheel to zoom (up to 4x), drag to pan when zoomed,
 * swipe or arrow keys between photos, swipe down or Esc to close. Click to zoom with a mouse.
 */
export function Lightbox({ items, start, onClose }: { items: LightboxItem[]; start: number; onClose: (last: number) => void }) {
  const [i, setI] = useState(clamp(start, 0, items.length - 1));
  const [zoomed, setZoomed] = useState(false);
  const zoomedRef = useRef(false);
  const [hint, setHint] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // Live transform, kept out of React state so gestures don't re-render on every move.
  const t = useRef({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const g = useRef<{
    kind: "pinch" | "pan" | "swipe" | null;
    s0: number; x0: number; y0: number; d0: number; mx: number; my: number; px: number; py: number; dx: number; dy: number; moved: boolean;
  }>({ kind: null, s0: 1, x0: 0, y0: 0, d0: 1, mx: 0, my: 0, px: 0, py: 0, dx: 0, dy: 0, moved: false });
  const lastTap = useRef({ time: 0, x: 0, y: 0 });

  const item = items[i];
  const img = PHOTOS[item.photo];
  const ratio = img.width / img.height;
  const n = items.length;

  const apply = useCallback((animate: boolean) => {
    const el = frame.current;
    if (!el) return;
    const { s, x, y } = t.current;
    el.classList.toggle("anim", animate);
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    const z = s > 1.01;
    if (z !== zoomedRef.current) {
      zoomedRef.current = z;
      setZoomed(z);
    }
  }, []);

  // Keep the zoomed photo covering the screen: no panning past its edges.
  const bound = useCallback(() => {
    const st = stage.current, el = frame.current;
    if (!st || !el) return;
    const { s } = t.current;
    const mx = Math.max(0, (el.offsetWidth * s - st.clientWidth) / 2);
    const my = Math.max(0, (el.offsetHeight * s - st.clientHeight) / 2);
    t.current.x = clamp(t.current.x, -mx, mx);
    t.current.y = clamp(t.current.y, -my, my);
  }, []);

  // Zoom to scale s, keeping the screen point (cx, cy) — relative to the stage center — fixed.
  const zoomAt = useCallback((s: number, cx: number, cy: number, animate: boolean) => {
    const cur = t.current;
    const ns = clamp(s, 1, MAX);
    const px = (cx - cur.x) / cur.s, py = (cy - cur.y) / cur.s;
    t.current = { s: ns, x: cx - px * ns, y: cy - py * ns };
    if (ns === 1) t.current = { s: 1, x: 0, y: 0 };
    bound();
    apply(animate);
    if (ns > 1) setHint(false);
  }, [apply, bound]);

  const reset = useCallback(() => {
    t.current = { s: 1, x: 0, y: 0 };
    apply(true);
  }, [apply]);

  const go = useCallback((d: number) => {
    if (n < 2) return;
    t.current = { s: 1, x: 0, y: 0 };
    apply(false);
    setI((k) => (k + d + n) % n);
  }, [apply, n]);

  const close = useCallback(() => onClose(i), [onClose, i]);

  // Lock the page behind, focus the close button, restore focus on close.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    const back = document.activeElement as HTMLElement | null;
    root.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      root.style.overflow = prev;
      back?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go]);

  // Trackpad pinch and mouse wheel zoom (needs a non-passive listener to stop the page zooming).
  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = st.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002));
      zoomAt(t.current.s * factor, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2, false);
    };
    st.addEventListener("wheel", onWheel, { passive: false });
    return () => st.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const local = (e: { clientX: number; clientY: number }) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
  };

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const cur = t.current;
    if (pts.length === 2) {
      const [a, b] = pts;
      const m = local({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      g.current = { ...g.current, kind: "pinch", s0: cur.s, x0: cur.x, y0: cur.y, d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: m.x, my: m.y, moved: true };
    } else if (pts.length === 1) {
      g.current = { ...g.current, kind: cur.s > 1.01 ? "pan" : "swipe", s0: cur.s, x0: cur.x, y0: cur.y, px: e.clientX, py: e.clientY, dx: 0, dy: 0, moved: false };
    }
  };

  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const st = g.current;
    if (st.kind === "pinch" && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const m = local({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      const s = clamp(st.s0 * (d / st.d0), 1, MAX);
      // The point that was under the fingers stays under them as they spread and move.
      const px = (st.mx - st.x0) / st.s0, py = (st.my - st.y0) / st.s0;
      t.current = { s, x: m.x - px * s, y: m.y - py * s };
      bound();
      apply(false);
      if (s > 1.01) setHint(false);
      return;
    }
    const dx = e.clientX - st.px, dy = e.clientY - st.py;
    st.dx = dx;
    st.dy = dy;
    if (Math.hypot(dx, dy) > 8) st.moved = true;
    if (st.kind === "pan") {
      t.current = { ...t.current, x: st.x0 + dx, y: st.y0 + dy };
      bound();
      apply(false);
    } else if (st.kind === "swipe" && st.moved) {
      // Follow the finger: sideways to change photo, down to close.
      t.current = { s: 1, x: Math.abs(dx) > Math.abs(dy) ? dx : 0, y: Math.abs(dy) > Math.abs(dx) && dy > 0 ? dy : 0 };
      apply(false);
    }
  };

  const onUp = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    const st = g.current;
    const kind = st.kind;
    // The last tracked move: some browsers report a release point that lags the finger.
    const dx = st.dx, dy = st.dy;

    if (kind === "pinch") {
      // One finger still down after a pinch: carry on as a pan from here.
      if (pointers.current.size === 1) {
        const [p] = [...pointers.current.values()];
        g.current = { ...st, kind: t.current.s > 1.01 ? "pan" : null, x0: t.current.x, y0: t.current.y, px: p.x, py: p.y };
      } else {
        g.current.kind = null;
        if (t.current.s <= 1.01) reset();
      }
      return;
    }
    g.current.kind = null;

    if (kind === "swipe" && st.moved) {
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) return go(dx < 0 ? 1 : -1);
      if (dy > 110 && dy > Math.abs(dx)) return close();
      return reset();
    }
    if (st.moved) return;

    // A tap. Mouse: click toggles zoom on the photo, closes on the backdrop. Touch: double-tap toggles zoom.
    const onPhoto = !!frame.current?.contains(e.target as Node);
    const p = local(e);
    if (e.pointerType === "mouse") {
      if (!onPhoto && t.current.s <= 1.01) return close();
      return t.current.s > 1.01 ? reset() : zoomAt(DOUBLE, p.x, p.y, true);
    }
    const now = Date.now(), last = lastTap.current;
    if (now - last.time < 320 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 30) {
      lastTap.current.time = 0;
      return t.current.s > 1.01 ? reset() : zoomAt(DOUBLE, p.x, p.y, true);
    }
    lastTap.current = { time: now, x: e.clientX, y: e.clientY };
  };

  const onCancel = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    g.current.kind = null;
    if (t.current.s <= 1.01) reset();
  };

  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${item.alt}, image ${i + 1} of ${n}`}>
      <div
        ref={stage}
        className={"lb-stage" + (zoomed ? " zoomed" : "")}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
      >
        <div ref={frame} className="lb-frame" style={{ ["--r" as string]: ratio }}>
          <Photo key={item.photo} src={item.photo} label={item.alt} fill sizes="(max-width: 960px) 200vw, 100vw" preload />
          {item.tint && <TintedPhoto photo={item.photo} tint={item.tint} />}
        </div>
      </div>

      <div className="lb-bar">
        <span className="lb-count" aria-hidden="true">{n > 1 ? `${i + 1} / ${n}` : ""}</span>
        <button ref={closeBtn} type="button" className="lb-x" aria-label="Close" onClick={close}>×</button>
      </div>
      {n > 1 && !zoomed && (
        <>
          <button type="button" className="lb-nav prev" aria-label="Previous image" onClick={() => go(-1)}>‹</button>
          <button type="button" className="lb-nav next" aria-label="Next image" onClick={() => go(1)}>›</button>
        </>
      )}
      {item.tint && <p className="lb-note">Color shown digitally. Order a swatch to see it in person.</p>}
      {hint && !zoomed && <p className="lb-hint" aria-hidden="true"><span className="touch">Pinch or double-tap to zoom</span><span className="mouse">Click to zoom</span></p>}
    </div>,
    document.body,
  );
}
