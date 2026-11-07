"use client";

import Link from "next/link";
import styles from "@/components/cart-upsell.module.css";
import { Photo } from "@/components/photo";
import { pillowsFrom } from "@/components/bf-push";
import { QuickAddSheet } from "@/components/catalog-card";
import { useState } from "react";
import { bundleIdOf, useCart, type CartLine } from "@/components/cart";
import { SALE, SLEEP_SUITE, salePrice, sleepSuiteLines, suiteVsAshbury } from "@/lib/sale";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS } from "@/lib/mattress";
import { PILLOW_ID, PILLOW_PATH } from "@/lib/pillow";
import { fmt } from "@/lib/products";
import { trackCustom } from "@/lib/pixel";

const opt = (l: CartLine, k: string) => l.options.find(([key]) => key === k)?.[1] ?? "";

/** A standalone Ashbury's size, feel and color ids, read back from its cart options. */
function ashburyChoice(l: CartLine) {
  const size = MATTRESS.sizes.find((s) => opt(l, "Size").startsWith(`${s.label} (`)) ?? MATTRESS.sizes[0];
  const feel = MATTRESS.feels.find((f) => f.label === opt(l, "Feel")) ?? MATTRESS.feels[0];
  const color = MATTRESS.colors.find((c) => c.label === opt(l, "Color")) ?? MATTRESS.colors[0];
  return { size, feel, color };
}

/**
 * At the top of the cart: an Ashbury on its own can become the Sleep Suite in one tap, same size, feel and color.
 * The message is worked out for that size: save $X, $X more, or (after the sale) just "complete your bed".
 */
export function CartUpgrade() {
  const cart = useCart();
  const loose = cart.items.filter((i) => i.id === MATTRESS.id && !bundleIdOf(i));
  if (loose.length !== 1 || loose[0].qty !== 1) return null;
  const line = loose[0];
  const { size, feel, color } = ashburyChoice(line);
  const { diff } = suiteVsAshbury(size.id);
  const what = "two pillows, a Mattress Protector and free white glove delivery";
  const lead = !SALE.active || diff === 0
    ? <><strong>Complete your bed with the Sleep Suite:</strong> {what}.</>
    : diff < 0
      ? <><strong>Get the Sleep Suite instead and save {fmt(-diff)}:</strong> add {what}.</>
      : <><strong>Upgrade to the Sleep Suite for just {fmt(diff)} more:</strong> {what}.</>;
  const upgrade = () => {
    trackCustom("UpgradeToSleepSuite", { content_ids: [MATTRESS.id], size: size.id, value: diff });
    cart.remove(line.lineId);
    cart.addMany(sleepSuiteLines({ sizeId: size.id, feelId: feel.id, colorId: color.id }));
  };
  return (
    <div className={styles.card} style={{ marginBottom: 12 }}>
      <div className={styles.title}>{lead}</div>
      <div className={styles.title} style={{ color: "var(--walnut)" }}>Keeps your {size.label}, {feel.label}, {color.label}.</div>
      <button type="button" className={styles.btn} style={{ background: "var(--ink)", color: "var(--alabaster)", cursor: "pointer" }} onClick={upgrade}>
        Upgrade to {SLEEP_SUITE.name}
      </button>
    </div>
  );
}


/** Above Check out: extra pillows for a bed, or gift ideas for a pillows-only cart. */
export function CartUpsell({ items, onNavigate }: { items: CartLine[]; onNavigate: () => void }) {
  const hasBed = items.some((i) => i.id === MATTRESS.id);
  const onlyPillows = items.length > 0 && items.every((i) => i.id === PILLOW_ID);
  if (hasBed) return <ExtraPillows />;
  if (!onlyPillows) return null;
  const gifts = [DOG_BED, NOOK].filter((b) => !items.some((i) => i.id === b.id));
  return (
    <div className={styles.wrap}>
      <div className={styles.eyebrow}>{SALE.active ? "Gifts under $300" : "Gifts"}</div>
      {gifts.map((b) => {
        const from = Math.min(...b.sizes.map((s) => s.price));
        const c = b.colors.find((x) => x.id === b.defaultColor) ?? b.colors[0];
        return (
          <div className={styles.row} key={b.id}>
            <div className={styles.thumb}><Photo src={c.photos[0] ?? c.swatch} label={b.title} className="line-img" sizes="48px" /></div>
            <div className={styles.name}>{b.title}<small>from {SALE.active && <s>{fmt(from)} </s>}{fmt(salePrice(from))}</small></div>
            <Link href={b.path} className={styles.add} onClick={onNavigate}>Choose</Link>
          </div>
        );
      })}
    </div>
  );
}

/** One compact line in the cart footer: extra pillows, with Quick add (fill, size and color in the sheet). */
function ExtraPillows() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <div className={styles.thumb}><Photo src="pillow-sorrel" label="Ashwick pillows" className="line-img" sizes="48px" /></div>
        <div className={styles.name}>Add extra pillows<small>from {fmt(pillowsFrom())}</small></div>
        <button type="button" className={styles.add} style={{ background: "none", cursor: "pointer" }} onClick={() => setOpen(true)}>Quick add</button>
      </div>
      {open && <QuickAddSheet kind="pillow" href={PILLOW_PATH} onClose={() => setOpen(false)} />}
    </div>
  );
}
