"use client";

import { useEffect, useRef, useState } from "react";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

const loaded = new Map<string, Promise<HTMLImageElement>>();
function load(src: string) {
  let p = loaded.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    loaded.set(src, p);
  }
  return p;
}

/**
 * The photo with its upholstery recolored, drawn on a canvas over the gallery image: the tint color is cut to the
 * fabric mask (public/tint/<key>.png) and multiplied onto the photo. Canvas compositing behaves the same in every
 * browser, unlike CSS masks with blend modes.
 */
export function TintedPhoto({ photo, tint }: { photo: PhotoKey; tint: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  // Stays visible while a new color is drawn, so switching colors on the same photo doesn't flash.
  const [drawn, setDrawn] = useState<PhotoKey | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([load(PHOTOS[photo].src), load(`/tint/${photo}.png`)])
      .then(([img, mask]) => {
        const canvas = ref.current;
        if (!live || !canvas) return;
        const w = Math.min(img.naturalWidth, 1600);
        const h = Math.round((w * img.naturalHeight) / img.naturalWidth);
        canvas.width = w;
        canvas.height = h;
        const layer = document.createElement("canvas");
        layer.width = w;
        layer.height = h;
        const l = layer.getContext("2d")!;
        l.fillStyle = tint;
        l.fillRect(0, 0, w, h);
        l.globalCompositeOperation = "destination-in";
        l.drawImage(mask, 0, 0, w, h);
        const c = canvas.getContext("2d")!;
        c.globalCompositeOperation = "source-over";
        c.drawImage(img, 0, 0, w, h);
        c.globalCompositeOperation = "multiply";
        c.drawImage(layer, 0, 0);
        setDrawn(photo);
      })
      .catch(() => live && setDrawn(null));
    return () => {
      live = false;
    };
  }, [photo, tint]);

  return <canvas ref={ref} className={"tint-canvas" + (drawn === photo ? " on" : "")} aria-hidden="true" />;
}
