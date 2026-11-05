import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MiniCard } from "@/components/black-friday";
import { BundleDetail, CountdownLarge, GiftsRow, NewBadge, StickySuite, SuiteHero } from "@/components/bf-push";
import { PHOTOS } from "@/lib/photos";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { PILLOW_STANDALONE_FILLS, PILLOW_STORY, pillowFromPrice } from "@/lib/pillow";
import { Stars } from "@/components/reviews";
import { cardPrice, fmt, productsIn } from "@/lib/products";
import { REVIEWS, reviewsFor } from "@/lib/reviews";
import { BUNDLE_CONFIG, SALE, salePrice } from "@/lib/sale";

export const metadata: Metadata = {
  title: "Black Friday at Ashwick: 20% off everything",
  description: "20% off the whole collection, mattresses included. Plus two bundles with free white glove delivery for the mattress: the Complete Sleep Suite and the Best Friends Bundle.",
  alternates: { canonical: SALE.path },
  openGraph: {
    type: "website",
    siteName: "Ashwick Home",
    title: "Black Friday at Ashwick: 20% off everything",
    description: "20% off the whole collection, mattresses included. Plus two bundles with free white glove delivery for the mattress: the Complete Sleep Suite and the Best Friends Bundle.",
    images: [{ url: PHOTOS["bf-share"].src, width: 1200, height: 630, alt: "A terracotta Ashbury mattress, a boucle chair and a cream sofa on a rug in an autumn hillside landscape" }],
  },
  twitter: { card: "summary_large_image" },
};

const minPrice = (sizes: { price: number }[]) => Math.min(...sizes.map((z) => z.price));
type Item = { key: string; href: string; photo: Parameters<typeof MiniCard>[0]["photo"]; name: string; price: number; from?: boolean; isNew?: boolean };

/** /black-friday (Tessa's brief, 05/11): the Sleep Suite leads; gifts, pillows and everything else follow. */
export default function BlackFridayPage() {
  if (!SALE.active) notFound();

  const FILL_ORDER = ["living-wool-horse-hair", "living-wool-latex", "organic-cotton"];
  const groups: { id: string; title: string; items: Item[] }[] = [
    { id: "mattress", title: `The organic Ashbury, from ${fmt(salePrice(minPrice(MATTRESS.sizes)))}`, items: [{ key: "mattress", href: MATTRESS_PATH, photo: "mattress-room-sorrel", name: MATTRESS.title, price: minPrice(MATTRESS.sizes), from: true }] },
    {
      id: "pillows", title: "Pillows",
      items: [...PILLOW_STANDALONE_FILLS].sort((a, b) => FILL_ORDER.indexOf(a.id) - FILL_ORDER.indexOf(b.id))
        .map((f) => ({ key: f.id, href: f.path, photo: PILLOW_STORY[f.id].card, name: f.label, price: pillowFromPrice(f.id), from: true, isNew: true })),
    },
    {
      id: "dog-beds", title: "Dog beds",
      items: [
        { key: "dog", href: DOG_BED.path, photo: "dog-bed-sorrel-room-golden", name: DOG_BED.title, price: minPrice(DOG_BED.sizes), from: true },
        { key: "nook", href: NOOK.path, photo: "nook-olive-room", name: NOOK.title, price: minPrice(NOOK.sizes), from: true },
      ],
    },
    { id: "sofas", title: "Sofas", items: productsIn("sofas").map((p) => ({ key: p.id, href: "/products/" + p.id, photo: p.cardPhoto ?? p.photos[0], name: p.name, price: cardPrice(p).price, from: cardPrice(p).from })) },
    { id: "chairs", title: "Chairs and ottoman", items: productsIn("chairs").map((p) => ({ key: p.id, href: "/products/" + p.id, photo: p.cardPhoto ?? p.photos[0], name: p.name, price: cardPrice(p).price, from: cardPrice(p).from })) },
  ];
  const chips: [string, React.ReactNode][] = [
    ["top", "All"], ["bundles", "Bundles"], ["gifts", "Gifts under $300"], ["pillows", <>Pillows <NewBadge /></>],
    ["mattress", "Mattress"], ["dog-beds", "Dog Beds"], ["sofas", "Sofas"], ["chairs", "Chairs"],
  ];

  const rvAll = REVIEWS.filter((r) => ["ashbury", "ashbury-dog-bed", "nook"].includes(r.product));
  const rvCount = rvAll.length;
  const avg = Math.round((rvAll.reduce((a, r) => a + r.rating, 0) / rvCount) * 10) / 10;
  const quote = (frag: string) => {
    const r = reviewsFor("ashbury").items.find((x) => x.body.includes(frag));
    if (!r) throw new Error("review quote not found: " + frag);
    return { t: frag + "…", by: r.author };
  };
  const quotes = [
    quote("The Ashbury is not only gorgeous it’s the most comfortable mattress I’ve ever slept on"),
    quote("The Ashbury has been game changing in sleep, comfort, breathability and support"),
  ];
  quotes[1].t = "…" + quotes[1].t;
  const faq: [string, string][] = [
    ["When will it ship?", "Mattresses and dog beds ship within 3–4 days of your order. Furniture as designed ships within 3–4 weeks; customized furniture within 8–12 weeks."],
    ["What is the return policy?", "Mattress: a 100-night trial, with a 30-night minimum before you request a return. Dog beds: 30 days from delivery. Furniture as designed: 14 days from delivery, unused, less return shipping and a 15% restocking fee. Customized furniture is final sale."],
    ["What does white glove delivery cost?", `$${BUNDLE_CONFIG.whiteGloveValue} per mattress and a flat $450 per order for furniture, however many pieces. It is free for the mattress in a bundle.`],
    ["Can I pay in installments?", "Yes. Shop Pay Installments is offered at checkout on the mattress and on furniture, subject to approval."],
  ];

  return (
    <main className="bf2" id="top">
      <SuiteHero />
      <CountdownLarge />

      <nav className="bf2-chips" aria-label="Jump to a section">
        {chips.map(([id, label]) => <a key={id} href={"#" + id} className="bf2-chip">{label}</a>)}
      </nav>

      <div className="wrap bf2-bundles" id="bundles">
        <BundleDetail which="suite" />
        <BundleDetail which="bf" />
      </div>

      <GiftsRow id="gifts" />

      <section className="wrap bf2-rs" aria-label="Customer reviews">
        <div className="bf2-rs-top"><Stars rating={avg} /> <strong>{avg.toFixed(1)}</strong> <span>· {rvCount} reviews across all products</span></div>
        <ul className="bf2-rs-q">{quotes.map((q) => <li key={q.by}>&ldquo;{q.t}&rdquo; <span>{q.by}</span></li>)}</ul>
      </section>

      <section className="wrap bf2-all" aria-labelledby="bf2-all-h">
        <h2 className="bf2-h" id="bf2-all-h">Everything {SALE.percent}% off</h2>
        {groups.map((g) => (
          <div key={g.id} className="bf2-group" id={g.id}>
            <h3 className="bf2-gh">{g.title}{g.id === "pillows" && <> <NewBadge /></>}</h3>
            <div className="bf-grid">
              {g.items.map((it) => <div key={it.key} className="bf-cell"><MiniCard href={it.href} photo={it.photo} name={it.name} price={it.price} from={it.from} badge={it.isNew ? <NewBadge /> : undefined} /></div>)}
            </div>
          </div>
        ))}
      </section>

      <section className="wrap bf2-faq" aria-labelledby="bf2-faq-h">
        <h2 className="bf2-h" id="bf2-faq-h">Good to know</h2>
        <div className="bf-faq">{faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        <p className="bf-fine">Discount applied automatically at checkout. Taxes calculated at checkout. <Link href="/collections/all">All products</Link></p>
      </section>
      <StickySuite />
    </main>
  );
}
