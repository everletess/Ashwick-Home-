import type { Metadata } from "next";
import Link from "next/link";
import { Block, InfoPage } from "@/components/info-page";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { STUDIO_EMAIL } from "@/lib/site";
import { WARRANTY_PATH } from "@/lib/trade-terms";

export const metadata: Metadata = {
  title: "Care",
  description: "Caring for your Ashbury mattress, topper and Ashwick furniture: wood, linen, wool upholstery and natural-fill cushions.",
};

const email = <a href={`mailto:${STUDIO_EMAIL}`} className="inl">{STUDIO_EMAIL}</a>;

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const L = ordered ? "ol" : "ul";
  return <L className="body terms-list">{items.map((t) => <li key={t}>{t}</li>)}</L>;
}

// Mattress and topper care repeat the mattress page's Care rows (app/products/luxury-organic-mattress/page.tsx).
export default function CarePage() {
  return (
    <InfoPage eyebrow="Help" title="Care" intro="Natural materials, looked after simply, last for years.">
      <Block title={`The ${MATTRESS.shortName} mattress`}>
        <p className="body">
          Single-sided; no flipping needed. Rotate 180° every 3–6 months. Air it occasionally by removing the bedding for an hour. Spot clean only; do not saturate. Use a professional cleaner for deeper care. We recommend a breathable mattress protector from the first night.
        </p>
        <p className="body">Wool and horsehair gently settle to you over the first months. This is normal.</p>
      </Block>
      <Block title="The topper">
        <p className="body">Rotate regularly and air when you can. Do not machine wash. Spot clean only; use a professional cleaner for deeper care. Store flat if removed.</p>
      </Block>
      <Block title="Foundation and sheets">
        <p className="body">
          The {MATTRESS.shortName} needs a firm, flat base that lets it breathe: a solid platform, or slats no more than 3&quot; apart. For Queen, King and Cal King, choose a base with a center support rail and legs. Avoid old box springs and placing it directly on the floor for long periods. Use deep-pocket sheets: 15&quot;+ pocket depth with the topper, 12&quot;+ without.{" "}
          <Link href={MATTRESS_PATH} className="inl">Mattress details</Link>
        </p>
      </Block>
      <section id="furniture-care" className="care-furniture">
        <div className="terms-block">
          <div className="eyebrow terms-h">Furniture</div>
          <h2 className="proc-h">Caring for natural materials.</h2>
          <p className="body">
            Wool, linen and oiled wood are materials made to be lived with. They soften, settle and gain character over the years. A little regular care keeps them looking their best, and most of it takes minutes.
          </p>
        </div>
        <Block title="Everyday care" level={3}>
          <List items={[
            "Vacuum weekly with a soft upholstery brush on low suction, including under and between cushions.",
            "Plump and rotate cushions every week or two. Natural fills compress as you sit and recover when plumped. Turning and swapping cushions helps them wear evenly.",
            "Dust wood with a soft, dry cloth, following the grain.",
          ]} />
        </Block>
        <Block title="Where it lives" level={3}>
          <List items={[
            "Keep it out of strong, direct sunlight. Natural fibers and wood can fade or change color in direct sun. Sheer curtains or blinds help.",
            "Keep it at least 12\" from heat: radiators, vents, fireplaces and heaters dry out wood and fibers.",
            "Aim for steady humidity, around 35–55%. Solid wood naturally moves a little with the seasons. Large swings in humidity can cause cracks or gaps.",
            "Lift, don't drag, when moving a piece. Felt pads under legs protect both the furniture and your floors.",
          ]} />
        </Block>
        <Block title="Solid wood and natural oils" id="wood" level={3}>
          <p className="body">Our hardwood is finished with natural oils that soak into the grain instead of sealing it under a plastic coating. That keeps the wood warm to the touch.</p>
          <List items={[
            "Wipe spills right away. An oiled finish resists water briefly but isn't waterproof.",
            "Use coasters, placemats and trivets under drinks, plants and anything hot.",
            "To clean, use a soft cloth dampened with water and wrung out well, then dry immediately. For sticky marks, add a drop of mild, pH-neutral soap to the water.",
            "If the wood looks dry or picks up a scratch, email us before applying any oil or treatment, and we'll tell you what to use.",
            "Never use silicone polishes, furniture sprays, waxes, or all-purpose or ammonia cleaners. They can build up on an oiled finish.",
          ]} />
        </Block>
        <Block title="Linen" id="linen" level={3}>
          <p className="body">Linen is strong and breathable, and it gets softer with use. Natural creasing and a relaxed texture are part of its character.</p>
          <List items={[
            "Blot spills immediately with a clean, white, absorbent cloth. Don't rub.",
            "For marks, dab with cool water and a little mild, pH-neutral detergent, then blot with plain water and let it air dry.",
            "All our linen is washable. Wash cold on a gentle cycle with a mild detergent, no bleach. Line dry, or tumble on low and remove while still slightly damp. Put the cover back on while it's a little damp so it relaxes into shape.",
            "To smooth creases, press on medium heat while slightly damp, or use a handheld steamer from a distance.",
          ]} />
        </Block>
        <Block title="Wool upholstery" id="wool-upholstery" level={3}>
          <p className="body">Wool naturally resists dirt and repels moisture for a moment before it soaks in, which gives you time to blot.</p>
          <List items={[
            "Vacuum gently with a soft brush. Bouclé has looped yarns, so avoid stiff brushes and beater bars.",
            "Blot spills right away with a dry, white cloth, working from the outside of the spill inward.",
            "For marks, dab with cool water and a small amount of wool-safe detergent, then blot dry. Never use hot water, which can shrink or felt wool.",
            "Pilling is normal in the first months as loose fibers work free. Remove pills gently with a fabric comb or fabric shaver.",
            "Snagged loop? Don't pull it. Ease it back in, or trim it level with sharp scissors.",
            "Pets: claws can catch on looped fabrics like bouclé. A throw on a favorite spot helps.",
            "For deep cleaning, use a professional upholstery cleaner experienced with wool.",
          ]} />
        </Block>
        <Block title="Cushions and natural fills" id="cushions" level={3}>
          <p className="body">Our cushions are filled with natural fibers instead of foam. Fills vary by piece; see each product&apos;s specifications for exactly what&apos;s inside.</p>
          <List items={[
            "Plump and rotate regularly. Natural fills settle with use, and that's expected. Plumping brings back their loft.",
            "Expect the seat to soften over the first weeks as it relaxes to your body. That's natural fill doing what it should.",
            "Don't open, wash or remove the fill or inner casings. Any zips are there for construction, not for cleaning.",
            "Keep cushions dry. If one gets wet, blot it, then let it air dry fully away from direct heat before using it again.",
          ]} />
        </Block>
        <Block title="Spills: what to do" level={3}>
          <List ordered items={[
            "Act fast. Most spills come out if you deal with them right away.",
            "Blot, don't rub. Use a clean, white, absorbent cloth and press. Rubbing pushes the spill deeper and roughens the fibers.",
            "Work from the outside in so the spill doesn't spread.",
            "Test first. Before using water or any cleaner, test on a hidden spot and let it dry.",
            "Go gently. Use cool water and a little mild, pH-neutral detergent, then blot with plain water and let it air dry.",
          ]} />
        </Block>
        <Block title="What to avoid" level={3}>
          <List items={[
            "Bleach, ammonia, solvents, oxygen cleaners and stain-removal sprays",
            "Steam cleaners and hot water on fabrics",
            "Silicone polishes, aerosol sprays and waxes on wood",
            "Hair dryers or heaters to speed up drying",
            "Sitting on arms or the backs of sofas",
          ]} />
        </Block>
        <Block title="When to call us" level={3}>
          <p className="body">
            For large stains, burns, water damage, or anything you&apos;re unsure about, email {email} with a photo before you try to treat it. We&apos;ll tell you exactly what to do, or arrange a professional cleaner or repair.
          </p>
          <p className="body">Need the cleaning code for your fabric, or planning a professional clean? Email {email} and we&apos;ll send it.</p>
        </Block>
        <p className="body">
          Following this guide helps your piece last a lifetime. Damage caused by cleaning methods or products outside this guide, or by direct sun, heat or excess moisture, isn&apos;t covered by the{" "}
          <Link href={WARRANTY_PATH} className="inl">lifetime limited warranty</Link>.
        </p>
      </section>
    </InfoPage>
  );
}
