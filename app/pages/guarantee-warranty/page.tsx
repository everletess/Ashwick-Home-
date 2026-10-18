import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, Columns } from "@/components/mattress";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { WARRANTY_PATH } from "@/lib/trade-terms";

const M = MATTRESS;

export const metadata: Metadata = {
  title: "Guarantee & warranty",
  description: "A hundred nights to be sure. A lifetime to keep it. The Ashbury guarantee and warranty.",
};

function Terms({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="deflist">
      {rows.map(([k, v]) => (
        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  );
}

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="note">
      <p className="note-h">{title}</p>
      <p className="body small">{children}</p>
    </aside>
  );
}

// Copy is final (from the mattress handoff); bracketed values are pending and live in lib/mattress.ts.
export default function GuaranteePage() {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">{M.title}</div>
        <h1 className="h1">Sleep on it.</h1>
        <p className="body">A hundred nights to be sure. A lifetime to keep it.</p>
      </section>

      <section className="sec linen">
        <div className="wrap grid2">
          <div className="panel">
            <div className="eyebrow">{M.guaranteeNights} nights</div>
            <h2 className="proc-h">Sleep on it at home.</h2>
            <p className="body">Sleep on it for at least {M.guaranteeMinNights} nights. If it isn&apos;t right within {M.guaranteeNights} nights of delivery, we&apos;ll collect it at no cost to you and refund you in full.</p>
          </div>
          <div className="panel">
            <div className="eyebrow">For life</div>
            <h2 className="proc-h">Built to be inherited.</h2>
            <p className="body">Every Ashwick mattress is covered against defects in materials and workmanship for as long as you own it.</p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap specs">
          <div>
            <div className="eyebrow">{M.guarantee}</div>
            <h2 className="h2">How it works</h2>
          </div>
          <div>
            <Terms
              rows={[
                [`Your ${M.guaranteeNights} nights`, "Begin the day your mattress is delivered."],
                ["Minimum", `Please sleep on it for at least ${M.guaranteeMinNights} nights before requesting a return. Returns can be requested from night ${M.guaranteeMinNights} to night ${M.guaranteeNights}.`],
                ["Returns", "Free. We arrange collection from your home and cover the return freight."],
                ["Your refund", "The full purchase price, returned to your original payment method after collection."],
                ["Condition", "The mattress should be clean and free of stains or damage. We recommend a breathable mattress protector from the first night."],
                ["Custom sizes", "Custom sizes are made just for you and aren't covered by the guarantee."],
                ["What happens next", "Returned mattresses are donated, never resold as new."],
              ]}
            />
            <Note title="Give it a few nights.">
              A natural mattress feels different from foam. Wool and horsehair settle gently to your body over the first weeks, which is why we ask you to sleep on it for at least {M.guaranteeMinNights} nights before deciding.
            </Note>
          </div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap specs">
          <div>
            <div className="eyebrow">{M.warranty}</div>
            <h2 className="h2">What&apos;s covered</h2>
          </div>
          <div>
            <Terms
              rows={[
                ["Who", "The original purchaser, for as long as they own the mattress."],
                ["Covered", <>Defects in materials and workmanship, including broken or loose coils, failed seams or tufting, and body impressions beyond normal settling when the mattress is on a suitable foundation.</>],
                ["Not covered", "Normal wear, stains, misuse, and natural settling of the wool and horsehair layers within normal limits."],
                ["Our remedy", "We'll repair the affected mattress. Shipping to and from our workshop is paid by the customer."],
                ["Care", "Rotate the mattress 180° every 3–6 months and keep it on a supportive base. This helps the natural layers wear evenly."],
              ]}
            />
            <Note title="About natural settling.">
              Unlike foam, wool and horsehair gently conform to the person sleeping on them. A slight impression in the first months is normal and is part of how a natural mattress becomes yours. Regular rotation keeps it even.
            </Note>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 64 }}>
            <h2 className="h2">Making a claim or a return</h2>
          </div>
          <Columns
            numbered
            items={[
              ["Get in touch.", <>Email <a href="mailto:hello@ashwickhome.com" className="inl">hello@ashwickhome.com</a> with your order number and, for warranty claims, a few photos.</>],
              ["We arrange it.", "We'll confirm the details and schedule a collection or repair at a time that suits you."],
              ["It's resolved.", "Refunds are issued after collection. Warranty repairs or replacements are made by hand, like the original."],
            ]}
          />
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap specs">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2 className="h2">Questions</h2>
          </div>
          <Accordion
            items={[
              ["Does the guarantee cover the topper?", <p className="body small" key="1">The mattress and topper are sold as one system, and the guarantee covers the set.</p>],
              [
                `Why is there a ${M.guaranteeMinNights}-night minimum?`,
                <p className="body small" key="min">
                  Wool and horsehair take a few weeks to settle to your body, and most people need that long to adjust from foam. After {M.guaranteeMinNights} nights you&apos;ll know how it really sleeps, and you can still return it any time up to night {M.guaranteeNights}.
                </p>,
              ],
              ["What if my mattress arrives damaged?", <p className="body small" key="2">Contact us as soon as possible after delivery with photos, and we&apos;ll replace it.</p>],
              ["Can I choose between soft and firm?", <p className="body small" key="3">Yes. The {M.shortName} comes in soft and firm. If you&apos;re unsure, our team can help you choose before you order.</p>],
              [
                "Do furniture pieces have the same guarantee?",
                <p className="body small" key="4">
                  The {M.guaranteeNights}-night guarantee applies to the {M.shortName}. Our made-to-order furniture is covered by the <Link href={WARRANTY_PATH} className="inl">lifetime warranty</Link>.
                </p>,
              ],
            ]}
          />
        </div>
      </section>

      <section className="sec">
        <div className="wrap center-head">
          <Link href={MATTRESS_PATH} className="btn">Shop the {M.shortName}</Link>
        </div>
      </section>
    </main>
  );
}
