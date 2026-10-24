"use client";

import { useState } from "react";
import { DogBedNotify } from "@/components/dog-bed-notify";
import { Photo } from "@/components/photo";
import { OptGroup } from "@/components/product-view";
import { DOG_BED } from "@/lib/dog-bed";
import { PHOTOS } from "@/lib/photos";

const D = DOG_BED;

/** Gallery and color choice for the dog bed; the gallery follows the color. */
export function DogBedView({ children }: { children?: React.ReactNode }) {
  const [color, setColorState] = useState(D.defaultColor);
  const [img, setImg] = useState(0);
  const sel = D.colors.find((c) => c.id === color) ?? D.colors[0];
  const alt = `${D.title} in ${sel.label}`;
  const setColor = (c: string) => {
    setColorState(c);
    setImg(0);
  };

  return (
    <section className="pdp wrap">
      <div className="gal">
        <div className="gal-main">
          <div className="gal-photo"><Photo src={sel.photos[img]} label={alt} sizes="(max-width: 960px) 100vw, 56vw" preload={img === 0} /></div>
        </div>
        {sel.photos.length > 1 && (
          <div className="gal-thumbs">
            {sel.photos.map((ph, i) => (
              <button key={ph} className={i === img ? "on" : ""} aria-label={"Image " + (i + 1)} aria-pressed={i === img} onClick={() => setImg(i)}>
                <Photo src={ph} label="" sizes="84px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="info">
        <div className="eyebrow">{D.comingSoon ? "Coming soon" : "Dog bed · Made to order"}</div>
        <h1 className="pdp-name">{D.title}</h1>
        <div className="pdp-collection">{D.collection}</div>
        <p className="m-feature-tag dog-tag">{D.tagline}</p>
        <p className="body">A bed for the newest member of the family, made to match the Ashbury.</p>

        <div className="choices">
          <OptGroup label="Color" value={sel.label}>
            {D.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                className={"chip color-chip mattress-chip" + (color === c.id ? " on" : "")}
                style={{ backgroundImage: `url(${PHOTOS[c.swatch].src})` }}
                title={c.label}
                aria-label={c.label}
                aria-pressed={color === c.id}
                onClick={() => setColor(c.id)}
              />
            ))}
          </OptGroup>
        </div>

        {D.comingSoon && (
          <div className="dog-soon">
            <p className="body small">Launching soon. Sign up and we&apos;ll let you know the day it&apos;s here, with 15% off your first order.</p>
            <DogBedNotify />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
