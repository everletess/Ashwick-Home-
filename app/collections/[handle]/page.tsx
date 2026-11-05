import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogCard } from "@/components/catalog-card";
import { FilterSort } from "@/components/filter-sort";
import { GROUP_ORDER, SECTION_LABEL, TABS, itemsFor, type CatalogItem } from "@/lib/catalog";

type Props = { params: Promise<{ handle: string }> };

const META: Record<string, { title: string; description: string }> = {
  all: { title: "Shop all", description: "Bundles, the Ashbury mattress, pillows, dog beds, sofas and chairs. Everything handmade to order in the USA." },
  bedroom: { title: "For the bedroom", description: "The Ashbury, pillows, dog beds and bundles, handmade to order in the USA." },
  bundles: { title: "Bundles", description: "The Complete Sleep Suite and the Best Friends Bundle." },
  sofas: { title: "Sofas", description: "Organic sofas and a loveseat in linen, wool and cotton on solid hardwood frames, each made to order by hand in the USA." },
  chairs: { title: "Chairs", description: "Organic lounge chairs and an ottoman in linen, wool and cotton on solid hardwood frames, each made to order by hand in the USA." },
  mattress: { title: "Mattress", description: "The Ashbury: an all-natural mattress, hand-tufted and made in color." },
};

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(META).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  return META[handle] ? { title: META[handle].title, description: META[handle].description, alternates: { canonical: `/collections/${handle}` } } : {};
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const meta = META[handle];
  if (!meta) notFound();
  const items = handle === "mattress" ? itemsFor("all").filter((c) => c.group === "ashbury") : itemsFor(handle);
  // On Shop All and Bedroom the grid is split under small section labels.
  const sections: { label: string; items: CatalogItem[] }[] =
    handle === "all"
      ? (["sleep", "living"] as const).map((s) => ({ label: SECTION_LABEL[s], items: items.filter((i) => i.section === s) })).filter((s) => s.items.length)
      : [{ label: "", items }];
  const tabHref = (h: string) => (h === "pillows" ? "/collections/pillows" : h === "dog-beds" ? "/collections/dog-beds" : "/collections/" + h);
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Shop</div>
        <h1 className="h1">{meta.title}</h1>
        <p className="body">{meta.description}</p>
      </section>
      <nav className="tabs wrap" aria-label="Collections">
        {TABS.map(([label, h]) => (
          <Link key={h} href={tabHref(h)} className={handle === h ? "on" : ""} aria-current={handle === h ? "page" : undefined}>{label}</Link>
        ))}
      </nav>
      <FilterSort current={handle} />
      <section className="wrap cc-page">
        {sections.map((s) => (
          <div key={s.label || "all"} className="cc-sec">
            {s.label && <h2 className="cc-sec-h">{s.label}</h2>}
            <div className="cc-grid" data-grid>
              {s.items.map((it, i) => <CatalogCard key={it.id} item={it} priority={i < 4} />)}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
