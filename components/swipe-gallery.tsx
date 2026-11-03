"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/photo";
import { Lightbox } from "@/components/lightbox";
import type { PhotoKey } from "@/lib/photos";

export type GalleryShot = { photo: PhotoKey; alt: string };

/**
 * Product gallery. Phones: one full-width photo at a time, swipe sideways, dots underneath, tap to open the full-screen
 * viewer (pinch to zoom). Desktop: the same track with arrow buttons and a thumbnail row. `index` and `onIndex` let the
 * page jump to a photo when someone picks a color.
 */
export function SwipeGallery({ shots, index, onIndex, aspect = "4/5" }: { shots: GalleryShot[]; index: number; onIndex: (i: number) => void; aspect?: string }) {
  const track = useRef<HTMLDivElement>(null);
  // While the page itself is scrolling the track (a color was picked), ignore the scroll events it causes.
  const programmatic = useRef(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [zoom, setZoom] = useState<number | null>(null);
  const n = shots.length;

  // Page asked for a photo (a color was picked): scroll the track there.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const w = el.clientWidth;
    if (Math.abs(el.scrollLeft - index * w) > 4) {
      programmatic.current = true;
      el.scrollTo({ left: index * w, behavior: "smooth" });
      if (settle.current) clearTimeout(settle.current);
      const done = () => { programmatic.current = false; if (settle.current) clearTimeout(settle.current); };
      el.addEventListener("scrollend", done, { once: true });
      settle.current = setTimeout(done, 2000);
    }
  }, [index]);

  // Finger moved the track: report which photo is showing.
  const onScroll = () => {
    const el = track.current;
    if (programmatic.current || !el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index && i >= 0 && i < n) onIndex(i);
  };
  const go = (d: number) => onIndex((index + d + n) % n);

  return (
    <div className="gal sgal">
      <div className="sgal-stage">
        <div className="sgal-track" ref={track} onScroll={onScroll} style={{ ["--sgal-aspect" as string]: aspect }}>
          {shots.map((s, i) => (
            <button key={s.photo} type="button" className="sgal-slide" aria-label={`Enlarge photo ${i + 1} of ${n}`} onClick={() => setZoom(i)}>
              <Photo src={s.photo} label={s.alt} fill sizes="(max-width: 960px) 100vw, 56vw" preload={i < 2} />
            </button>
          ))}
        </div>
        {n > 1 && (
          <>
            <button type="button" className="sgal-arrow prev" aria-label="Previous photo" onClick={() => go(-1)}>‹</button>
            <button type="button" className="sgal-arrow next" aria-label="Next photo" onClick={() => go(1)}>›</button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="sgal-dots" role="tablist" aria-label="Photos">
          {shots.map((s, i) => (
            <button key={s.photo} type="button" role="tab" aria-selected={i === index} aria-label={`Photo ${i + 1} of ${n}`} className={i === index ? "on" : ""} onClick={() => onIndex(i)}><span /></button>
          ))}
        </div>
      )}
      {n > 1 && (
        <div className="gal-thumbs sgal-thumbs">
          {shots.map((s, i) => (
            <button key={s.photo} className={i === index ? "on" : ""} aria-label={`Image ${i + 1}`} aria-pressed={i === index} onClick={() => onIndex(i)}>
              <Photo src={s.photo} label="" sizes="84px" />
            </button>
          ))}
        </div>
      )}
      {zoom != null && <Lightbox items={shots.map((s) => ({ photo: s.photo, alt: s.alt }))} start={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}
