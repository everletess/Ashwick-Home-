import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/sections";
import { COLLECTIONS, productsIn, type CollectionHandle } from "@/lib/products";

type Props = { params: Promise<{ handle: string }> };

const isHandle = (h: string): h is CollectionHandle => h in COLLECTIONS;
const TABS: [string, CollectionHandle][] = [["All pieces", "all"], ["Sofas", "sofas"], ["Chairs", "chairs"]];

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  if (!isHandle(handle)) return {};
  return { title: COLLECTIONS[handle].title, description: COLLECTIONS[handle].description };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  if (!isHandle(handle)) notFound();
  const { title, description } = COLLECTIONS[handle];
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">Shop</div>
        <h1 className="h1">{title}</h1>
        <p className="body">{description}</p>
      </section>
      <nav className="tabs wrap" aria-label="Collections">
        {TABS.map(([label, h]) => (
          <Link key={h} href={"/collections/" + h} className={handle === h ? "on" : ""} aria-current={handle === h ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
      <section className="wrap" style={{ paddingBottom: 140 }}>
        <ProductGrid products={productsIn(handle)} />
      </section>
    </main>
  );
}
