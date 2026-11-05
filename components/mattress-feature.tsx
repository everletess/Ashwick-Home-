"use client";

// Home page: the Ashbury in one screen: one photo, "Dare to dream in color", four color dots that switch the photo,
// the price and one button to the product page in that color. Opens on Flint (the hero above is Sorrel); Sorrel uses
// the clean room photo (the usual one has "shown in sorrel" printed on it).
import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/photo";
import { Price } from "@/components/sale";
import { MATTRESS, colorById, mattressColorHref } from "@/lib/mattress";

export function MattressFeature() {
  const [color, setColor] = useState("dove");
  const sel = colorById(color);
  const href = mattressColorHref(color);
  return (
    <section className="m-feature">
      <Link href={href} className="m-feature-img" aria-label={`${MATTRESS.title}, shown in ${sel.label}`}>
        {MATTRESS.colors.map((c) => (
          <Photo key={c.id} src={c.id === "mocha" ? "mattress-mocha-bedroom" : c.photos[0]} label={`${MATTRESS.title} in ${c.label}, shown in a sunlit bedroom.`} className={c.id === color ? "on" : undefined} sizes="(max-width: 960px) 100vw, 50vw" />
        ))}
      </Link>
      <div className="m-feature-t">
        <div className="eyebrow">{MATTRESS.title}</div>
        <h2 className="h2">Dare to dream in color</h2>
        <ul className="m-dots" aria-label="Colors">
          {MATTRESS.colors.map((c) => (
            <li key={c.id}>
              <button type="button" title={c.label} aria-label={c.label} aria-pressed={c.id === color} className={c.id === color ? "on" : undefined} onClick={() => setColor(c.id)}>
                <Photo src={c.swatch} label="" sizes="32px" />
              </button>
            </li>
          ))}
        </ul>
        <p className="m-feature-p"><Price price={Math.min(...MATTRESS.sizes.map((z) => z.price))} whole /></p>
        <div className="btns"><Link href={href} className="btn">Shop the Ashbury</Link></div>
      </div>
    </section>
  );
}
