import Link from "next/link";
import { Photo } from "@/components/photo";
import { MATTRESS, colorById, mattressColorHref } from "@/lib/mattress";

const M = MATTRESS;

/** Dog bed page, under the gallery: the Ashbury in the same color (the mirror of DogBedTeaser on the mattress page). */
export function MattressTeaser({ color }: { color: string }) {
  const c = colorById(color);
  return (
    <Link href={mattressColorHref(c.id)} className="dog-teaser">
      <div className="dog-teaser-imgs">
        <div className="dog-teaser-img"><Photo src={c.photos[0]} label={`${M.title} in ${c.label}`} sizes="(max-width: 640px) 50vw, 300px" /></div>
        <div className="dog-teaser-img"><Photo src={c.cutaway} label={`${M.title} in ${c.label}: the layers inside`} sizes="(max-width: 640px) 50vw, 300px" /></div>
      </div>
      <div className="dog-teaser-t">
        <div className="eyebrow">The matching mattress</div>
        <p className="dog-teaser-h">{M.title}, in {c.label}.</p>
        <p className="body small">
          The same organic cotton twill and Living Wool, made for you. Hand-tufted in the USA, with a {M.guaranteeNights}-night trial.
        </p>
        <span className="ulink">Shop the {M.shortName}</span>
      </div>
    </Link>
  );
}
