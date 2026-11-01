"use client";

import Link from "next/link";
import styles from "@/components/cart-upsell.module.css";
import { Photo } from "@/components/photo";
import { bundleIdOf, type CartLine } from "@/components/cart";
import { BUNDLE, BUNDLE_CONFIG, SLEEP_SUITE, salePrice, sleepSuitePrice, SALE } from "@/lib/sale";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS } from "@/lib/mattress";
import { fmt } from "@/lib/products";

const isDogBed = (id: string) => id === DOG_BED.id || id === NOOK.id;

function Price({ list, sale }: { list: number; sale: number }) {
  return SALE.active && sale !== list ? <><s>{fmt(list)}</s>{fmt(sale)}</> : <>{fmt(list)}</>;
}

/** Compact bundle nudge and "Complete the set" row shown above Check out. Links only, so nothing implies loose items get a bundle perk. */
export function CartUpsell({ items, onNavigate }: { items: CartLine[]; onNavigate: () => void }) {
  const hasBundle = items.some((i) => bundleIdOf(i));
  if (hasBundle) return null;
  const standaloneMattress = items.some((i) => i.id === MATTRESS.id);
  const hasDogBed = items.some((i) => isDogBed(i.id));
  const bedFrom = Math.min(...DOG_BED.sizes.map((s) => s.price));

  const suite = sleepSuitePrice(0);
  const bf = { list: suite.list + bedFrom, sale: suite.sale + salePrice(bedFrom) };
  const showDogBed = !hasDogBed && !DOG_BED.comingSoon;
  if (!standaloneMattress && !showDogBed) return null;

  return (
    <div className={styles.wrap}>
      {standaloneMattress && (
        <div className={styles.card}>
          <div className={styles.title}>
            Make it a bundle: free white glove delivery for your mattress (a ${BUNDLE_CONFIG.whiteGloveValue} value)
          </div>
          <div className={styles.btns}>
            <Link href={SLEEP_SUITE.path} className={styles.btn} onClick={onNavigate}>
              {SLEEP_SUITE.name}<small>from <Price list={suite.list} sale={suite.sale} /></small>
            </Link>
            <Link href={BUNDLE.path} className={styles.btn} onClick={onNavigate}>
              {BUNDLE.title}<small>from <Price list={bf.list} sale={bf.sale} /></small>
            </Link>
          </div>
        </div>
      )}
      {showDogBed && (
        <>
          <div className={styles.eyebrow}>Complete the set</div>
          <div className={styles.row}>
            <div className={styles.thumb}>
              <Photo src={DOG_BED.colors.find((c) => c.id === DOG_BED.defaultColor)?.photos[0] ?? DOG_BED.colors[0].photos[0]} label={DOG_BED.title} className="line-img" sizes="48px" />
            </div>
            <div className={styles.name}>{DOG_BED.title}<small>from <Price list={bedFrom} sale={salePrice(bedFrom)} /></small></div>
            <Link href={DOG_BED.path} className={styles.add} onClick={onNavigate}>Choose</Link>
          </div>
        </>
      )}
    </div>
  );
}
