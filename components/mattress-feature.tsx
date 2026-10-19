"use client";

// Home page feature announcing the mattress collection. The color chips switch the photo in place; the buttons then
// open the product page in that color.
import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/photo";
import { MATTRESS, colorById, mattressColorHref } from "@/lib/mattress";
import { ASHBURY_PATH } from "@/lib/materials";

export function MattressFeature() {
  const [color, setColor] = useState(MATTRESS.defaultColor);
  const sel = colorById(color);
  const href = mattressColorHref(color);
  return (
    <section className="sec linen m-feature">
      <div className="wrap m-feature-in">
        <Link href={href} className="m-feature-img" aria-label={`${MATTRESS.title}, shown in ${sel.label}`}>
          {MATTRESS.colors.map((c) => (
            <Photo
              key={c.id}
              src={c.photos[0]}
              label={`${MATTRESS.title} in ${c.label}, shown in a sunlit bedroom.`}
              className={c.id === color ? "on" : undefined}
              sizes="(max-width: 960px) 100vw, 50vw"
            />
          ))}
        </Link>
        <div className="m-feature-t">
          <div className="m-feature-new"><span>New</span>Now introducing</div>
          <h2 className="h2">{MATTRESS.title}</h2>
          <p className="m-feature-coll">{MATTRESS.collection}</p>
          <p className="m-feature-tag">Dare to dream in color.</p>
          <p className="body">
            An all-natural, organic mattress made from nature&apos;s finest materials: Living Wool, cashmere, Swedish horsehair and organic cotton, hand-tufted and made in five colors.
          </p>
          <ul className="m-feature-colors" aria-label="Colors">
            {MATTRESS.colors.map((c) => (
              <li key={c.id}>
                <button type="button" title={c.label} aria-pressed={c.id === color} className={c.id === color ? "on" : undefined} onClick={() => setColor(c.id)}>
                  <span className="m-feature-chip"><Photo src={c.swatch} label="" sizes="56px" /></span>
                  <span className="m-feature-name">{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="btns">
            <Link href={href} className="btn">Shop the Ashbury</Link>
            <Link href={ASHBURY_PATH} className="btn ghost">Inside the Ashbury</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
