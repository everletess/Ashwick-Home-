/**
 * What the site assistant knows. Prices, sizes, colors, guarantee terms, products, fabrics and materials are read from
 * the same data the pages use (lib/mattress.ts, lib/products.ts, lib/materials.ts, lib/trade-terms.ts), so they stay in
 * sync when those change. The short passages written out below (care, foundation, Bespoke) repeat page copy that lives
 * in the page files; if that copy changes, update it here too. Anything not in here, the assistant sends to the studio email.
 */
import { BESPOKE_PATH, BESPOKE_REPLY } from "@/lib/bespoke";
import { ASHBURY_GROUPS, ASHBURY_PATH, FURNITURE_GROUPS, FURNITURE_MATERIALS_PATH, type MaterialGroup } from "@/lib/materials";
import { DOG_BED } from "@/lib/dog-bed";
import { GUARANTEE_PATH, MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { FABRICS, LEAD_TIMES, PRODUCTS, cardPrice, fmt } from "@/lib/products";
import { STUDIO_EMAIL, STUDIO_PHONE } from "@/lib/site";
import { TRADE_TERMS, WARRANTY_PATH } from "@/lib/trade-terms";

const SITE = "https://ashwickhome.com";
const M = MATTRESS;
const T = TRADE_TERMS;

/** The welcome offer from the email sign-up pop-up (components/email-popup.tsx). */
export const WELCOME_OFFER = { percent: 15, code: "ASHWICK15" };

const materials = (groups: MaterialGroup[]) =>
  groups
    .flatMap((g) => g.materials.map((m) => `- ${m.name} (${g.eyebrow.replace(/^The /, "")}): ${m.body} Where: ${m.where}${m.origin ? ` ${m.origin}.` : ""}`))
    .join("\n");

const fabric = (id: keyof typeof FABRICS) => {
  const f = FABRICS[id];
  const colors = f.colors?.map((c) => c.label).join(", ");
  return `${f.label}${f.detail ? ` (${f.detail.replace(/\.$/, "")})` : ""}${colors ? `: ${colors}` : ""}`;
};

const product = (p: (typeof PRODUCTS)[number]) => {
  const { price, from } = cardPrice(p);
  return [
    `- ${p.name} (${p.type}), ${from ? "from " : ""}${fmt(price)}. ${p.line}`,
    `  Materials: ${p.materials}.`,
    `  Fabrics: ${p.fabrics.map(fabric).join("; ")}.${p.wood ? " Plinth in walnut or oak." : ""}`,
    p.dimensions ? `  Size: ${p.dimensions.overall}.` : "",
    p.delivery ? `  ${p.delivery.label}: ${fmt(p.delivery.price)} per piece.` : "",
    p.preorder ? "  Available to pre-order; we confirm the order and estimated ship date by email." : `  ${p.leadTime ?? LEAD_TIMES}`,
    `  Page: ${SITE}/products/${p.id}`,
  ].filter(Boolean).join("\n");
};

export const ASSISTANT_KNOWLEDGE = `
ABOUT
Ashwick Home makes organic, natural furniture and the Ashbury mattress, made to order by hand in the USA. Nothing synthetic: no polyurethane foam, no chemical flame retardants. Contact: email ${STUDIO_EMAIL} or call ${STUDIO_PHONE}.

EMAIL OFFER
New email subscribers get ${WELCOME_OFFER.percent}% off their first order. They sign up through the email pop-up on the site, and the code arrives by email.

THE ASHBURY MATTRESS (${SITE}${MATTRESS_PATH})
${M.title}, ${M.collection}. An all-natural mattress, hand-tufted and made in color. An ${M.mattressHeight} mattress with a ${M.topperHeight} topper included (${M.combinedHeight} in total).
Sizes and prices (topper included; white glove delivery is ${fmt(M.delivery.price)} extra):
${M.sizes.map((s) => `- ${s.label}: ${s.dims}, ${fmt(s.price)}`).join("\n")}
${M.customSize}
Feels (same price): Soft, a deeper, more cushioned top for side sleepers and anyone who likes to sink in. Firm, more supportive and even, for back and stomach sleepers. Both share the same materials and construction.
Colors (same price): ${M.colors.map((c) => c.label).join(", ")}. The cover is super soft 100% organic cotton twill (GOTS) colored with GOTS-approved plant dyes.
Construction. Topper (${M.topperHeight}): cashmere (OEKO-TEX Standard 100), Living Wool (GOTS, OEKO-TEX), Swedish horsehair (OEKO-TEX), hand-tufted with wool rosettes. Mattress (${M.mattressHeight}), top to bottom: organic cotton, Living Wool, double-tempered steel pocket coils, a base of coconut coir and agave (in every size and feel; agave helps with temperature control and breathability), organic cotton, organic wool. No foam, no chemical flame retardants and no glue. Single-sided.
Certifications: GOTS-certified organic wool and cotton, made by a GOTS-certified manufacturer (${M.gotsManufacturer}). OEKO-TEX Standard 100. Meets US federal mattress flammability standards without chemical flame retardants; wool provides the natural barrier.
Ordering: ${M.leadTime} ${M.shipping} Every mattress arrives wrapped in biodegradable paper. Pay in full at checkout, or over time with Shop Pay Installments (subject to approval).
Foundation: needs a firm, flat base that lets it breathe: a solid platform, or slats no more than 3" apart. For Queen, King and Cal King, a base with a center support rail and legs. A rigid foundation (no springs) or an adjustable base also works. Avoid old box springs and placing it on the floor for long periods. A supportive base is a condition of the warranty.
Sheets: deep-pocket sheets, 15"+ pocket depth with the topper, 12"+ without.
Care: rotate 180° every 3–6 months; no flipping. Air it occasionally. Spot clean only. A breathable mattress protector is recommended from the first night. Wool and horsehair gently settle to you over the first months, which is normal.

GUARANTEE AND WARRANTY (${SITE}${GUARANTEE_PATH})
${M.guarantee}. The ${M.guaranteeNights} nights begin on delivery. Sleep on it for at least ${M.guaranteeMinNights} nights; returns can be requested from night ${M.guaranteeMinNights} to night ${M.guaranteeNights}. Returns are free: we collect it from the home and refund the full purchase price to the original payment method after collection. The mattress should be clean and free of stains or damage. Custom sizes are not covered by the guarantee. Returned mattresses are donated, never resold. The guarantee covers the mattress and topper as a set and applies only to the ${M.shortName}.
${M.warranty}: defects in materials and workmanship for as long as the original purchaser owns it, on a suitable foundation. Furniture has a lifetime warranty against defects in materials and workmanship for the original purchaser (${SITE}${WARRANTY_PATH}). Claims: email ${STUDIO_EMAIL} with the order number and photos.

ORDERS, RETURNS AND DELIVERY (${SITE}/pages/terms)
Changes and cancellations: any order can be changed or cancelled for a full refund within 12 hours of placing it, by emailing ${STUDIO_EMAIL} with the order number. After 12 hours it's in production and can't be changed or cancelled.
Furniture returns: every piece is made to order. Pieces ordered as designed, without customization, can be returned within 14 days of delivery in original, unused condition; the refund is reduced by return shipping and a 15% restocking fee. Email us to arrange it first. Final sale unless they arrive damaged: customized furniture, custom-size mattresses, Bespoke commissions and fabric swatches.
Delivery: within the contiguous United States. If anything arrives damaged, email ${STUDIO_EMAIL} with photos within 5 business days of delivery and we repair or replace it at no cost. Warranty repairs and replacements are free; the customer covers shipping to and from the workshop.

THE ASHBURY DOG BED (${SITE}/products/organic-dog-bed)
Handmade to order in the USA from GOTS and OEKO-TEX certified materials: organic cotton, Living Wool and cashmere, in a 100% organic cotton twill cover. Sizes and prices: ${DOG_BED.sizes.map((z) => `${z.label} ${z.dims} ${fmt(z.price)}`).join("; ")}. Colors, same price: Fleece, Flint, Flax and Sorrel, matching the Ashbury. Ships within 3–4 days, free delivery. 30-day return window; returned dog beds are donated. 1-year warranty against defects in materials and workmanship. It is not covered by the 100-night mattress guarantee or the lifetime furniture warranty. The 15% welcome code ASHWICK15 applies.

MATTRESS MATERIALS (${SITE}${ASHBURY_PATH})
${materials(ASHBURY_GROUPS)}

FURNITURE (${SITE}/collections/all)
Every piece is made to order by hand in the USA on a solid hardwood frame, and can be ordered as designed or customized (fabric, and on some pieces seat depth, length or wood finish). Fabric swatches can be ordered at ${SITE}/pages/fabric-swatches.
${PRODUCTS.map(product).join("\n")}

FURNITURE MATERIALS (${SITE}${FURNITURE_MATERIALS_PATH})
${materials(FURNITURE_GROUPS)}

BESPOKE (${SITE}${BESPOKE_PATH})
Ashwick Bespoke: tailor a piece from the collection, or commission something new (sofas, chairs, beds, headboards, benches, daybeds, window seats, mattresses in any size or shape). The process: share your idea, a design consultation by video or phone (we reply ${BESPOKE_REPLY}), a scaled drawing with a material proposal and quote, swatches at home, made by hand in our USA workshop with progress photos, then white-glove delivery. Lead time depends on the project; commissions are paid in full when commissioned. Customer-supplied natural-fiber fabric is welcome. Bespoke pieces carry the same lifetime warranty. Start at ${SITE}${BESPOKE_PATH}#commission.

TRADE
Interior designers and trade professionals can apply to the Ashwick Trade program (${SITE}/pages/trade): ${T.tiers.map((t) => `${t.name} ${t.discount}% off`).join(", ")}, a dedicated contact and samples. Applications are reviewed within ${T.reviewDays} business days. Full terms: ${SITE}/pages/trade-terms.
`.trim();
