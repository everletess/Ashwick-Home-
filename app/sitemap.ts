import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashwickhome.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: `${BASE}/`, priority: 1.0 },
    { url: `${BASE}/products/luxury-organic-mattress`, priority: 1.0 },
    { url: `${BASE}/pages/inside-the-ashbury`, priority: 0.9 },
    { url: `${BASE}/collections/all`, priority: 0.8 },
    { url: `${BASE}/collections/sofas`, priority: 0.8 },
    { url: `${BASE}/collections/chairs`, priority: 0.8 },
    { url: `${BASE}/pages/our-story`, priority: 0.7 },
    { url: `${BASE}/pages/materials`, priority: 0.7 },
    { url: `${BASE}/pages/furniture-materials`, priority: 0.7 },
    { url: `${BASE}/pages/bespoke`, priority: 0.7 },
    { url: `${BASE}/pages/guarantee-warranty`, priority: 0.6 },
    { url: `${BASE}/pages/fabric-swatches`, priority: 0.5 },
    { url: `${BASE}/pages/trade`, priority: 0.4 },
  ].map((p) => ({ ...p, lastModified: now, changeFrequency: "monthly" as const }));

  const productPages = PRODUCTS.map((p) => ({
    url: `${BASE}/products/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
