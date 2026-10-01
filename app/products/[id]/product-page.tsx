import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/product-view";
import { ProductGrid } from "@/components/sections";
import { PHOTOS } from "@/lib/photos";
import { PRODUCTS, constructionFor, getProduct, relatedTo } from "@/lib/products";

// Shared by /products/:id ("As designed") and /products/:id/customize ("Customize").
export type ProductParams = { params: Promise<{ id: string }> };

export function productStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function productMetadata({ params }: ProductParams): Promise<Metadata> {
  const p = getProduct((await params).id);
  if (!p) return {};
  return { title: p.name, description: p.line, openGraph: { images: [PHOTOS[p.photos[0]].src] } };
}

export async function ProductPage({ params, mode }: ProductParams & { mode: "designed" | "custom" }) {
  const p = getProduct((await params).id);
  if (!p) notFound();
  const construction = constructionFor(p);
  return (
    <main>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={"/collections/" + p.category}>{p.category === "sofas" ? "Sofas" : "Chairs"}</Link>
        <span>/</span>
        <span>{p.name}</span>
      </div>
      {/* Keyed so switching products resets the gallery and options. */}
      <ProductView key={p.id} id={p.id} initialMode={mode} />

      <section className="sec linen">
        <div className="wrap specs">
          <div>
            <div className="eyebrow">Details</div>
            <h2 className="h2">{p.name}</h2>
          </div>
          <div className="spec-grid">
            <div className="spec"><div className="eyebrow">Materials</div><p>{p.materials}</p></div>
            <div className="spec"><div className="eyebrow">Dimensions</div><p>[DIMENSIONS]</p></div>
            <div className="spec"><div className="eyebrow">Made</div><p>To order, by hand, in our American workshop.</p></div>
            {p.leadTime && <div className="spec"><div className="eyebrow">Lead time</div><p>{p.leadTime}</p></div>}
            <div className="spec"><div className="eyebrow">Payment</div><p>In full at checkout.</p></div>
          </div>
        </div>
      </section>

      <section className="sec" id="construction">
        <div className="wrap specs">
          <div>
            <div className="eyebrow">Construction</div>
            <h2 className="h2 construct-h">{construction.statement}</h2>
          </div>
          <div>
            <p className="body">{construction.intro}</p>
            <div className="spec-grid construct-grid">
              {construction.rows.map(([k, v]) => (
                <div className="spec" key={k}><div className="eyebrow">{k}</div><p>{v}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">The collection</div>
              <h2 className="h2">More from the collection.</h2>
            </div>
          </div>
          <ProductGrid products={relatedTo(p)} />
        </div>
      </section>
    </main>
  );
}
