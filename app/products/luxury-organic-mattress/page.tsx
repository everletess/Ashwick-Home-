import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Accordion, Construction, Feels, Recovery } from "@/components/mattress";
import { MattressView, MattressViewFromURL } from "@/components/mattress-view";
import { Photo } from "@/components/photo";
import { GUARANTEE_PATH, MATTRESS } from "@/lib/mattress";
import { ASHBURY_PATH } from "@/lib/materials";
import { PHOTOS } from "@/lib/photos";
import { fmt } from "@/lib/products";

const M = MATTRESS;

export const metadata: Metadata = {
  title: `${M.title} · ${M.collection}`,
  description: `An all-natural, organic mattress made from nature's finest materials: Living Wool, organic cotton and Swedish horsehair, hand-tufted and made in color. An ${M.mattressHeight} mattress with a ${M.topperHeight} topper included.`,
  openGraph: { images: [PHOTOS["mattress-mocha-bedroom"].src] },
};

const MATERIALS: [string, string][] = [
  ["Living Wool", "Organic wool from Lanas Trinidad in Uruguay. Keeps an even temperature and a dry surface, and gives buoyant support that springs back."],
  ["Swedish horsehair", "From tail clippings; no horse is harmed. Each curled strand acts like a small spring, letting air move through the layers."],
  ["Organic cotton", "GOTS-certified. A super soft 100% organic cotton twill, plant-dyed, covers the entire mattress, and inside it wraps the coils on both sides."],
];

export default function MattressPage() {
  const details: [string, React.ReactNode][] = [
    [
      "Dimensions & sizing",
      <>
        <table className="terms-table">
          <thead><tr><th scope="col">Size</th><th scope="col">Dimensions</th><th scope="col">Price</th></tr></thead>
          <tbody>
            {M.sizes.map((s) => (
              <tr key={s.id}>
                <th scope="row" data-label="Size">{s.label}</th>
                <td data-label="Dimensions">{s.dims}</td>
                <td data-label="Price">{fmt(s.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="body small">
          Mattress {M.mattressHeight}, topper {M.topperHeight}, combined {M.combinedHeight}. Deep-pocket sheets recommended: 15&quot;+ pocket depth with the topper, 12&quot;+ without.
        </p>
      </>,
    ],
    [
      "Foundation",
      <p className="body small" key="f">
        The Ashbury needs a firm, flat base that lets it breathe. Use a solid platform, or a slatted base with slats no more than 3&quot; apart. For Queen, King and Cal King, choose a base with a center support rail and legs. A rigid foundation (no springs) works too. It also works on an adjustable base. Avoid old box springs, which can sag and make the mattress uneven, and avoid placing it directly on the floor for long periods, since wool needs airflow underneath. A supportive base is a condition of the lifetime limited warranty.
      </p>,
    ],
    [
      "Delivery",
      <p className="body small" key="d">
        Made to order and ships in 1–2 weeks. Standard delivery is included in the price; white-glove delivery is available for an additional fee. Every mattress arrives wrapped in biodegradable paper.
      </p>,
    ],
    [
      "Care — mattress",
      <p className="body small" key="cm">
        Single-sided; no flipping needed. Rotate 180° every 3–6 months. Air it occasionally by removing the bedding for an hour. Spot clean only; do not saturate. Use a professional cleaner for deeper care. We recommend a breathable mattress protector.
      </p>,
    ],
    [
      "Care — topper",
      <p className="body small" key="ct">
        Rotate regularly and air when you can. Do not machine wash. Spot clean only; use a professional cleaner for deeper care. Store flat if removed.
      </p>,
    ],
    [
      "Certifications",
      <p className="body small" key="c">
        GOTS-certified organic wool and cotton, made by a GOTS-certified manufacturer ({M.gotsManufacturer}). OEKO-TEX certified horsehair. OEKO-TEX Standard 100 certified cashmere. Meets US federal mattress flammability standards without chemical flame retardants.
      </p>,
    ],
  ];

  return (
    <main>
      <div className="crumb wrap">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Mattress</span>
      </div>
      <Suspense fallback={<MattressView />}>
        <MattressViewFromURL />
      </Suspense>

      <section className="sec linen">
        <div className="wrap">
          <div className="center-head">
            <h2 className="h2">Your bed, in color.</h2>
            <p className="body" style={{ marginTop: 24 }}>
              Natural mattresses are almost always white. Ours comes in five colors drawn from the English countryside, made to be seen: {M.colors.map((c) => c.label).join(", ").replace(/, ([^,]*)$/, " and $1")}.
            </p>
          </div>
          <div className="m-colors">
            {M.colors.map((c) => (
              <figure className="m-color" key={c.id}>
                <div className="m-color-img"><Photo src={c.swatch} label={`${c.label} fabric, hand-tufted`} sizes="(max-width: 960px) 100vw, 33vw" /></div>
                <figcaption className="card-name">{c.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Feels />

      <section className="sec linen">
        <div className="wrap">
          <div className="tsteps">
            {MATERIALS.map(([t, d]) => (
              <div className="tstep" key={t}>
                <h3 className="proc-h small">{t}</h3>
                <p className="body small">{d}</p>
              </div>
            ))}
          </div>
          <div className="m-more"><Link href={ASHBURY_PATH} className="ulink">Inside the Ashbury →</Link></div>
        </div>
      </section>

      <Construction />

      <section className="sec">
        <div className="wrap"><Recovery /></div>
      </section>

      <section className="sec linen">
        <div className="wrap specs">
          <div>
            <div className="eyebrow">Details</div>
            <h2 className="h2">{M.title}</h2>
          </div>
          <Accordion items={details} />
        </div>
      </section>

      <section className="statement">
        <p>Sleep on it.</p>
        <span className="body statement-body">30 nights to be sure, with free return pickup and a full refund. A lifetime limited warranty to keep it.</span>
        <Link href={GUARANTEE_PATH} className="btn light">Guarantee &amp; warranty</Link>
      </section>
    </main>
  );
}
