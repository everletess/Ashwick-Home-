import type { Metadata } from "next";
import Link from "next/link";
import { CERTIFICATIONS, Columns, Construction, Recovery } from "@/components/mattress";
import { Photo } from "@/components/photo";
import { PageHero } from "@/components/sections";
import { GUARANTEE_PATH, MATTRESS, MATTRESS_PATH } from "@/lib/mattress";

export const metadata: Metadata = {
  title: "Living Wool",
  description: "Organic wool from Lanas Trinidad in Uruguay, at the heart of every Ashwick mattress.",
};

// Copy is final (from the mattress handoff). Living Wool, horsehair and cotton close-ups are placeholders until photographed.
export default function LivingWoolPage() {
  return (
    <main>
      <PageHero
        photo="mattress-safari-room"
        alt="The Ashwick Home Luxury Organic Mattress in Safari on a light oak platform"
        eyebrow="Materials"
        title="Living Wool."
        body="Organic wool from Lanas Trinidad in Uruguay, at the heart of every Ashwick mattress. Grown, not made. Built for the hours your body spends recovering."
      />

      <section className="statement">
        <p className="long">Most mattresses are built from foam. Ours are built from fiber: wool, horsehair and cotton, layered by hand, with nothing synthetic in between.</p>
      </section>

      <section className="sec">
        <div className="wrap">
          <Recovery />
          <div style={{ marginTop: 72 }}>
            <Columns
              items={[
                ["Even temperature", "Wool responds to your body. It holds warmth when the room is cool and releases heat when you run warm, so you aren't waking to adjust the covers."],
                ["A dry surface", "Wool draws moisture away from the skin and lets it go as you shift. The sleep surface stays fresh through the night and through the seasons."],
                ["Support that springs back", "Every wool fiber has a natural crimp that compresses under you and returns when you move. Night after night, it keeps its loft."],
              ]}
            />
          </div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap process">
          <div className="proc">
            <div className="proc-v"><Photo label="Living Wool fiber" /></div>
            <div className="proc-t">
              <div className="eyebrow">Where it comes from</div>
              <h2 className="proc-h">Lanas Trinidad, Uruguay.</h2>
              <p className="body">
                Our wool comes from Lanas Trinidad in Uruguay: GOTS-certified organic, shorn as part of the sheep&apos;s natural seasonal cycle. It forms the comfort layer at the top of the mattress, the surface of the topper, and the cushioning above and below the coils.
              </p>
            </div>
          </div>
          <div className="proc rev">
            <div className="proc-v"><Photo label="Swedish horsehair" /></div>
            <div className="proc-t">
              <div className="eyebrow">Swedish horsehair</div>
              <h2 className="proc-h">The spring inside the softness.</h2>
              <p className="body">
                Our horsehair comes from tail clippings in Sweden. No horse is harmed. Each long, curled strand acts like a small spring: it lets air move freely through the layers and returns to shape under weight. Blended with Living Wool, it gives the mattress and topper their lift and breathability. OEKO-TEX certified.
              </p>
            </div>
          </div>
          <div className="proc">
            <div className="proc-v"><Photo label="Organic cotton" /></div>
            <div className="proc-t">
              <div className="eyebrow">Organic cotton</div>
              <h2 className="proc-h">Breathable at every layer.</h2>
              <p className="body">
                GOTS-certified organic cotton wraps the pocket coils on both sides and forms the quilted shell of the topper. It keeps the layers quiet, holds the fibers in place and lets the whole mattress breathe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Construction />

      <section className="sec">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 64 }}>
            <div className="eyebrow">Certifications</div>
          </div>
          <Columns items={CERTIFICATIONS} />
          <div className="btns m-ctas">
            <Link href={MATTRESS_PATH} className="btn">Shop the {MATTRESS.shortName}</Link>
            <Link href={GUARANTEE_PATH} className="btn ghost">Our 30-night guarantee</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
