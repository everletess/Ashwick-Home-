"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { klaviyoTrack } from "@/lib/klaviyo";
import { catalogId } from "@/lib/pixel";
import { SALE, salePrice } from "@/lib/sale";

type Ld = Record<string, unknown>;

/** The page's own Product / ProductGroup markup (the same data Google reads), so every product page is covered. */
function productLd(): Ld | null {
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const parsed = JSON.parse(s.textContent ?? "");
      for (const o of (Array.isArray(parsed) ? parsed : [parsed]) as Ld[]) {
        if (o && (o["@type"] === "Product" || o["@type"] === "ProductGroup")) return o;
      }
    } catch {}
  }
  return null;
}

const num = (v: unknown) => (typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" && !isNaN(Number(v)) ? Number(v) : null);

/** The lowest list price on the page, or null when the piece is priced upon request (no offers in the markup). */
function lowestPrice(ld: Ld): number | null {
  const offers = ld.offers as Ld | undefined;
  const direct = offers ? (num(offers.lowPrice) ?? num(offers.price)) : null;
  if (direct != null) return direct;
  const variants = (ld.hasVariant as Ld[] | undefined) ?? [];
  const prices = variants.map((v) => num((v.offers as Ld | undefined)?.price)).filter((p): p is number => p != null);
  return prices.length ? Math.min(...prices) : null;
}

function firstImage(ld: Ld): string {
  const img = ld.image;
  if (typeof img === "string") return img;
  if (Array.isArray(img) && typeof img[0] === "string") return img[0];
  const og = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
  return og ?? "";
}

/**
 * Records "Viewed Product" in Klaviyo on every product and bundle page, for visitors klaviyo.js recognises.
 * This is what the browse-abandonment flow listens for. Anonymous visitors are ignored by Klaviyo.
 */
export function KlaviyoProductView() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || !/^\/(products|bundles)\/[^/]+\/?$/.test(pathname)) return;
    const t = window.setTimeout(() => {
      try {
        const ld = productLd();
        if (!ld) return;
        const siteId = pathname.replace(/\/$/, "").split("/").pop() ?? "";
        const list = lowestPrice(ld);
        const onRequest = list == null;
        const sale = list != null && SALE.active ? salePrice(list) : null;
        klaviyoTrack("Viewed Product", {
          ProductName: String(ld.name ?? document.title),
          ProductID: catalogId(siteId),
          SiteProductID: siteId,
          Categories: ld.category ? [String(ld.category)] : [],
          Brand: "Ashwick Home",
          URL: typeof ld.url === "string" ? ld.url : `https://ashwickhome.com${pathname}`,
          ImageURL: firstImage(ld),
          // "From" price. During the sale, Price is what the shopper pays and CompareAtPrice is the list price.
          Price: onRequest ? null : (sale ?? list),
          CompareAtPrice: sale != null ? list : null,
          PriceOnRequest: onRequest,
        });
      } catch {}
    }, 600);
    return () => window.clearTimeout(t);
  }, [pathname]);
  return null;
}
