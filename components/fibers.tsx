// Home page: the natural fibers inside every mattress. `photo` is a key in lib/photos.ts; without one a placeholder shows.
import Link from "next/link";
import { Photo } from "@/components/photo";
import { MATERIALS_PATH } from "@/lib/materials";
import type { PhotoKey } from "@/lib/photos";

type Fiber = { name: string; line: string; photo?: PhotoKey; alt?: string };

const FIBERS: Fiber[] = [
  { name: "Living Wool", photo: "fiber-wool", alt: "Crimped cream organic wool fiber on a dark background", line: "Organic wool from Lanas Trinidad in Uruguay. Keeps an even temperature and a dry surface, and gives buoyant support that springs back." },
  { name: "Swedish horsehair", photo: "fiber-horsehair", alt: "Curled dark horsehair on a dark background", line: "From tail clippings; no horse is harmed. Each curled strand acts like a small spring, letting air move through the layers." },
  { name: "Organic cotton", photo: "fiber-cotton", alt: "Soft white organic cotton fiber on a dark background", line: "GOTS-certified. Wraps the coils on both sides and forms the topper's quilted shell." },
];

export function Fibers() {
  return (
    <section className="fibers">
      <div className="wrap">
        <div className="center-head">
          <div className="eyebrow light">Inside every mattress</div>
          <h2 className="h2">Grown, not made.</h2>
        </div>
        <div className="fibers-grid">
          {FIBERS.map((f) => (
            <figure className="fiber" key={f.name}>
              <div className="fiber-img"><Photo src={f.photo} label={f.alt ?? f.name} sizes="(max-width: 960px) 100vw, 33vw" /></div>
              <figcaption>
                <div className="fiber-n">{f.name}</div>
                <p className="fiber-d">{f.line}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="fibers-cta">
          <Link href={MATERIALS_PATH} className="btn outline-light">Explore our materials</Link>
        </div>
      </div>
    </section>
  );
}
