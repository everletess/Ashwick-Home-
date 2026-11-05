/**
 * GET /api/price-check
 *
 * Compares the prices the site shows (lib/mattress, lib/pillow, lib/dog-bed, lib/sale) with Shopify's, variant by
 * variant: every Ashbury size, the bedding set, every pillow fill and size, and both dog beds. Shopify is what
 * checkout charges, so any "mismatch" here means the site is showing a wrong price (or a "was" price, saving or
 * Sleep Suite figure worked out from one). Open it after any price change in Shopify.
 */
import { NextResponse } from "next/server";
import { fetchVariantPrices } from "@/lib/shopify";
import { MATTRESS } from "@/lib/mattress";
import { PILLOW_ID, PILLOW_SIZES, PILLOW_STANDALONE_FILLS, pillowPrice } from "@/lib/pillow";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { BUNDLE_CONFIG } from "@/lib/sale";

export const dynamic = "force-dynamic";

const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
const parts = (title: string) => title.split(" / ").map(norm);

export async function GET() {
  try {
    const all = await fetchVariantPrices();
    const rows: { item: string; site: number; shopify: number[]; ok: boolean }[] = [];
    const check = (item: string, site: number, matches: { price: number }[]) => {
      const shopify = [...new Set(matches.map((m) => m.price))];
      rows.push({ item, site, shopify, ok: shopify.length > 0 && shopify.every((p) => Math.abs(p - site) < 0.005) });
    };

    const mattressHandle = ["luxury-organic-mattress", MATTRESS.handle, "the-ashbury"].find((h) => all.some((v) => v.handle === h));
    for (const s of MATTRESS.sizes) {
      check(`The Ashbury, ${s.label}`, s.price, all.filter((v) => v.handle === mattressHandle && parts(v.title).some((p) => p === norm(s.label) || p.startsWith(norm(s.label) + " "))));
    }
    check(BUNDLE_CONFIG.beddingSet.name, BUNDLE_CONFIG.beddingSet.price, all.filter((v) => v.handle === BUNDLE_CONFIG.beddingSet.handle));
    for (const f of PILLOW_STANDALONE_FILLS) {
      for (const z of PILLOW_SIZES) {
        const size = norm(z.label.split(" ")[0]);
        check(`Pillow, ${f.label}, ${z.label}`, pillowPrice(f.id, z.id),
          all.filter((v) => v.handle === PILLOW_ID && parts(v.title).includes(norm(f.label)) && parts(v.title).some((p) => p.startsWith(size))));
      }
    }
    for (const bed of [DOG_BED, NOOK]) {
      for (const z of bed.sizes) check(`${bed.title}, ${z.label}`, z.price, all.filter((v) => v.handle === bed.id && norm(v.title.split(" / ")[0]) === norm(z.label)));
    }

    const problems = rows.filter((r) => !r.ok);
    return NextResponse.json({
      ok: problems.length === 0,
      summary: problems.length === 0 ? `All ${rows.length} prices match Shopify.` : `${problems.length} of ${rows.length} prices differ from Shopify (or weren't found there).`,
      problems,
      checked: rows,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
