import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/product-view";
import { ProductGrid } from "@/components/sections";
import { FURNITURE_MATERIALS_PATH } from "@/lib/materials";
import { PHOTOS } from "@/lib/photos";
import { LEAD_TIMES, PRODUCTS, constructionFor, getProduct, relatedTo, type Product } from "@/lib/products";
import { abs } from "@/lib/mattress-feed";

// Shared by /products/:id ("As designed") and /products/:id/customize ("Customize").
export type ProductParams = { params: Promise<{ id: string }> };

export function productStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

/** Search title: the name, plus the type when the name leaves it out. */
function seoTitle(p: Product) {
  const named = p.name.toLowerCase().includes(p.type.toLowerCase());
  return `${named ? p.name : `${p.name} ${p.type}`} — Handmade to Order in the USA`;
}

/** What it is, then the made-to-order line and the price. Only facts already on the page. */
function seoDescription(p: Product) {
  return `${p.line} Handmade to order in the USA, ${p.priceFrom ? "from" : "priced at"} $${p.price.toLocaleString("en-US")}.`;
}

export async function productMetadata({ params }: ProductParams): Promise<Metadata> {
  const p = getProduct((await params).id);
  if (!p) return {};
  return {
    title: { absolute: `${seoTitle(p)} | Ashwick Home` },
    description: seoDescription(p),
    alternates: { canonical: `/products/${p.id}` },
    openGraph: { images: [PHOTOS[p.photos[0]].src] },
  };
}

/** Product and breadcrumb markup for Google. Price and availability come from the same data the page shows. */
function productJsonLd(p: Product) {
  const url = abs(`/products/${p.id}`);
  const prices = [p.price, ...Object.values(p.fabricPrices ?? {})];
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.line,
      brand: { "@type": "Brand", name: "Ashwick Home" },
      category: p.type,
      material: p.materials,
      url,
      image: p.photos.map((k) => abs(PHOTOS[k].src)),
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        availability: p.preorder ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
        url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
        { "@type": "ListItem", position: 2, name: p.category === "sofas" ? "Sofas" : "Chairs", item: abs(`/collections/${p.category}`) },
        { "@type": "ListItem", position: 3, name: p.name, item: url },
      ],
    },
  ];
}

export async function ProductPage({ params, mode }: ProductParams & { mode: "designed" | "custom" }) {
  const p = getProduct((await params).id);
  if (!p) notFound();
  const construction = constructionFor(p);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)).replace(/</g, "\\u003c") }} />
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
            {p.dimensions && (
              <div className="spec">
                <div className="eyebrow">Dimensions</div>
                <p>{p.dimensions.overall}</p>
                <dl className="dims">
                  {p.dimensions.rows.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
            )}
            <div className="spec"><div className="eyebrow">Made</div><p>To order, by hand, in our American workshop.</p></div>
            <div className="spec"><div className="eyebrow">Lead time</div><p>{p.leadTime ?? LEAD_TIMES}</p></div>
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
            <Link href={FURNITURE_MATERIALS_PATH} className="ulink construct-more">Explore our furniture materials →</Link>
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
