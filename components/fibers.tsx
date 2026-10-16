// Home page: the natural materials across the collection. `photo` is a key in lib/photos.ts; without one a placeholder
// shows. Lines in [square brackets] are pending confirmation.
import Link from "next/link";
import { Photo } from "@/components/photo";
import { MATERIALS_PATH } from "@/lib/materials";
import type { PhotoKey } from "@/lib/photos";

type Fiber = { name: string; line: string; href: string; photo?: PhotoKey; alt?: string };

const FIBERS: Fiber[] = [
  { name: "Living Wool", href: "#living-wool", photo: "fiber-wool", alt: "Crimped cream organic wool fiber", line: "Organic wool from Uruguay that keeps an even temperature and springs back." },
  { name: "Cashmere", href: "#cashmere", photo: "fiber-kashmir", alt: "Long, silky cashmere fiber", line: "Naturally fine and exceptionally soft. OEKO-TEX Standard 100 certified." },
  { name: "Swedish horsehair", href: "#horsehair", photo: "fiber-horsehair", alt: "Curled dark horsehair", line: "Curled strands that act like small springs and let air move through." },
  { name: "Organic cotton", href: "#organic-cotton", photo: "fiber-cotton", alt: "Soft white organic cotton fiber", line: "GOTS-certified, breathable at every layer." },
  { name: "Organic agave", href: "", alt: "Organic agave fiber", line: "[Add a line: what the agave fiber does and where it's used.]" },
  { name: "Sustainably sourced wood", href: "#hardwood", alt: "Solid hardwood", line: "Solid hardwood frames, built by hand to be inherited." },
  { name: "Coconut coir", href: "", alt: "Coconut coir fiber", line: "Springy fiber from coconut husks, used in our foundations in place of foam." },
];

export function Fibers() {
  return (
    <section className="fibers">
      <div className="wrap">
        <div className="center-head">
          <div className="eyebrow light">Our materials</div>
          <h2 className="h2">Furniture materials that are grown, not made.</h2>
        </div>
        <div className="fibers-grid">
          {FIBERS.map((f) => (
            <Link href={MATERIALS_PATH + f.href} className="fiber" key={f.name}>
              <div className="fiber-img"><Photo src={f.photo} label={f.alt ?? f.name} sizes="(max-width: 620px) 50vw, (max-width: 1180px) 25vw, 180px" /></div>
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
