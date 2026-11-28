"use client";

import { useState } from "react";
import styles from "@/components/dog-bed-set.module.css";
import { Photo } from "@/components/photo";
import { Pills } from "@/components/product-view";
import { useCart, type CartLine } from "@/components/cart";
import { trackCustom } from "@/lib/pixel";
import { fmt } from "@/lib/products";
import { salePrice } from "@/lib/sale";
import type { PhotoKey } from "@/lib/photos";
import { PILLOW_COVERS, PILLOW_ID, PILLOW_SIZES, PILLOW_TYPES, pillowPrice } from "@/lib/pillow";
import { pillowSetUnit } from "@/lib/pillow-sets";

/**
 * The dog bed + pillow set (Tessa, Nov 28 2026): the Ashbury Dog Bed with two Living Wool + horsehair pillows for the
 * owner, in the bed's color, added in one tap. No Shopify bundle: it adds the two products the site already sells, so
 * checkout, the pillow pair saving and the sale all work as they do for each one. A Large bed with two Queen pillows
 * is about $967 at full price (pillows priced as a pair), the step toward a $1,000 order.
 */
const FILL_ID = "living-wool-horse-hair";
const PILLOW_PHOTO: Record<string, PhotoKey> = { natural: "pillow-fleece", dove: "pillow-flint", safari: "pillow-flax", mocha: "pillow-sorrel" };
const SIZE_OPTIONS = PILLOW_SIZES.map((s) => ({ id: s.id, label: s.label.split(" ")[0] }));

export function DogBedSet({ bedLine, colorId }: { bedLine: Omit<CartLine, "lineId">; colorId: string }) {
  const cart = useCart();
  const [size, setSize] = useState<string>("queen");
  const fill = PILLOW_TYPES.find((f) => f.id === FILL_ID);
  const cover = PILLOW_COVERS.find((c) => c.id === colorId);
  const sz = PILLOW_SIZES.find((s) => s.id === size) ?? PILLOW_SIZES[1];
  if (!fill || !cover || bedLine.price == null) return null;

  const each = pillowPrice(FILL_ID, sz.id);
  const pair = Math.round(pillowSetUnit(each, 2) * 2 * 100) / 100;
  const total = Math.round((salePrice(bedLine.price) + pair) * 100) / 100;

  const add = () => {
    trackCustom("AddDogBedSet", { content_ids: [bedLine.id, PILLOW_ID], pillow_size: sz.id, value: total });
    cart.addMany([
      bedLine,
      {
        id: PILLOW_ID,
        name: "The Ashwick Pillow",
        photo: PILLOW_PHOTO[cover.id] ?? "pillow-hero",
        price: each,
        qty: 2,
        mode: "As designed",
        options: [["Fill", fill.label], ["Size", sz.label], ["Cover color", cover.label]],
      },
    ]);
  };

  return (
    <div className={styles.card} aria-labelledby="dog-set-h">
      <div className={styles.head}>
        <div className={styles.thumb}><Photo src={PILLOW_PHOTO[cover.id] ?? "pillow-hero"} label={`Ashwick Pillow in ${cover.label}`} className="line-img" sizes="64px" /></div>
        <div>
          <div className="eyebrow" id="dog-set-h">Make it a set</div>
          <p className={styles.title}>Two pillows for you, in {cover.label}.</p>
          <p className={styles.sub}>Living Wool and horsehair, handmade to order in the same organic cotton twill as the bed. Priced as a pair: {fmt(pair)}.</p>
        </div>
      </div>
      <div className={styles.sizes} role="group" aria-label="Pillow size">
        <Pills options={SIZE_OPTIONS} value={size} onChange={setSize} />
      </div>
      <button type="button" className="btn ghost full" onClick={add}>Add the set · {fmt(total)}</button>
    </div>
  );
}
