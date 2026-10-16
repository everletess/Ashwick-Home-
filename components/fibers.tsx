// Home page: the natural materials across the collection, labeled Furniture or The Ashbury. `photo` is a key in lib/photos.ts; without one a placeholder
// shows. Lines in [square brackets] are pending confirmation.
import Link from "next/link";
import { Photo } from "@/components/photo";
import { ASHBURY_PATH, FURNITURE_MATERIALS_PATH, MATERIALS_PATH } from "@/lib/materials";
import type { PhotoKey } from "@/lib/photos";

type Fiber = { name: string; line: string; group: "Furniture" | "The Ashbury"; href: string; photo?: PhotoKey; alt?: string };

const FIBERS: Fiber[] = [
  { name: "Living Wool", group: "The Ashbury", href: `${ASHBURY_PATH}#living-wool`, photo: "fiber-wool", alt: "Crimped cream organic wool fiber", line: "Organic wool from Uruguay that keeps an even temperature and springs back." },
  { name: "Cashmere", group: "The Ashbury", href: `${ASHBURY_PATH}#cashmere`, photo: "fiber-kashmir", alt: "Long, silky cashmere fiber", line: "Naturally fine and exceptionally soft. OEKO-TEX Standard 100 certified." },
  { name: "Swedish horsehair", group: "The Ashbury", href: `${ASHBURY_PATH}#horsehair`, photo: "fiber-horsehair", alt: "Curled dark horsehair", line: "Curled strands that act like small springs and let air move through." },
  { name: "Organic cotton", group: "The Ashbury", href: `${ASHBURY_PATH}#organic-cotton`, photo: "fiber-cotton", alt: "Soft white organic cotton fiber", line: "GOTS-certified, breathable at every layer." },
  { name: "Organic agave", group: "Furniture", href: `${FURNITURE_MATERIALS_PATH}#agave`, alt: "Organic agave fiber", line: "A strong natural fiber from the agave plant, grown with little water." },
  { name: "Sustainably sourced wood", group: "Furniture", href: `${FURNITURE_MATERIALS_PATH}#hardwood`, alt: "Solid hardwood", line: "Solid hardwood frames, built by hand to be inherited." },
  { name: "Coconut coir", group: "Furniture", href: `${FURNITURE_MATERIALS_PATH}#coir`, alt: "Coconut coir fiber", line: "Springy fiber from coconut husks, used in our foundations in place of foam." },
];

export function Fibers() {
  return (
    <section className="fibers">
      <div className="wrap">
        <div className="center-head">
          <div className="eyebrow light">Our materials</div>
          <h2 className="h2">Materials that are grown, not made.</h2>
        </div>
        <div className="fibers-grid">
          {FIBERS.map((f) => (
            <Link href={f.href} className="fiber" key={f.name}>
              <div className="fiber-img"><Photo src={f.photo} label={f.alt ?? f.name} sizes="(max-width: 620px) 50vw, (max-width: 1180px) 25vw, 180px" /></div>
              <div className="fiber-g">{f.group}</div>
              <div className="fiber-n">{f.name}</div>
              <p className="fiber-d">{f.line}</p>
            </Link>
          ))}
        </div>
        <div className="fibers-cta">
          <Link href={MATERIALS_PATH} className="btn outline-light">Explore our materials</Link>
        </div>
      </div>
    </section>
  );
}
