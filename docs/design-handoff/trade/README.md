# Handoff: Ashwick Home: Trade page (rebuild)

## Overview
This is a full rebuild of the `/pages/trade` route on the Ashwick Home storefront. The new page follows a standard furniture trade program layout: program overview, hospitality offer, materials, collection links, fabric swatches, membership prompts, a detailed trade application form and a hospitality request form. **Only the Trade page changed.** Every other route, the shell and the design tokens are the same as in the main website handoff (`design_handoff_ashwick_website/README.md`). Read that file for tokens, typography and global components.

## About the design files
These files are **design references built in HTML/React**, not production code. Rebuild the page in the target codebase using its existing patterns.
- `Ashwick Home Website (standalone).html`: open it in a browser and use the footer or nav to go to Trade (hash route `#/pages/trade`).
- `site/site-pages.jsx`: source. Look for `US_STATES`, `ContactFields`, `TradeApplyForm`, `HospitalityForm` and `TradePage`.
- `site/index.html`: all CSS. The new rules are listed under "New CSS" below.

## Fidelity
**High-fidelity.** Copy in `[BRACKETS]` is a placeholder the client hasn't supplied yet.

## Page structure (top to bottom)
All sections use `.wrap` (max-width 1440px, 56px gutter, 20px at ≤960px). Sections are `.sec`, with 140px vertical padding (88px at ≤960px).

1. **Page head** (`.page-head`, centered, 96px top / 64px bottom padding)
   - Eyebrow: "Ashwick Trade"
   - H1: "For designers, architects and hospitality."
   - Body: "Already a member? **Sign in** to your trade account." "Sign in" links to `/account` and has a 1px currentColor underline (`.inl`).
2. **Jump tabs** (`.tabs`, centered, hairline bottom border). The tabs are Trade program → `#program`, Hospitality → `#hospitality`, Swatches → `#swatches` and Apply → `#apply`. They smooth-scroll to the section with a 90px offset for the sticky header.
3. **Wide image** (`.trade-hero`): `csofa-a.jpg`, aspect 21/9, `object-fit:cover`, linen background. At ≤960px the aspect becomes 4/3.
4. **Four benefits** (`.offer-grid`: 4 columns, 32px gap; 2 columns at ≤960px). Each is a `.tstep`: a top rule in rgba(42,37,31,.28), an italic Cormorant number in clay, an H3 and small body text.
   - 01 **Trade terms**: [TRADE TERMS]
   - 02 **Made to order**: "Every piece is built by hand in our American workshop once the order is placed."
   - 03 **Custom and bespoke**: "Specify fabric, seat depth, length and wood finish, or commission a piece that doesn't exist yet."
   - 04 **Personal support**: "Talk through proportions, materials and specification with us before you order."
5. **Program rows** (`.sec.linen`, `.process` with a 96px row gap). Each row is a 2-column `.proc` with a 4:3 image.
   - `#program`: image `marlowe-2.jpg` on the left. Eyebrow "The trade program"; H "Organic furniture, specified to your project."; two body paragraphs (see source); ulink "Apply for a trade account" → `#apply`.
   - `#hospitality` (`.proc.rev`, image on the right): `cchair-c.jpg`. Eyebrow "Hospitality"; H "Rooms your guests will remember."; body ending in [HOSPITALITY DETAILS]; ulink "Send a hospitality request" → `#hospitality-form`.
6. **Materials**: reuses the home page `MaterialsBlock`, a 5-column materials grid followed by the closing line "Nothing synthetic…".
7. **Explore the collection** (`.sec.tint`, `#F1ECE3`). A centered head, then `.grid3` with 3 tiles:
   - Sofas → `/collections/sofas` (`csofa-b.jpg`)
   - Chairs → `/collections/chairs` (`cchair-studio.jpg`)
   - Design your own → `/pages/design-your-own` (`frame-fill-cover.jpg`)

   Each tile has a 4:5 image, and the image scales 1.025 on hover over 1.2s `cubic-bezier(.2,.6,.2,1)`. Below it is a row with the name (Cormorant 300 28px) and a right-aligned "View" ulink.
8. **Fabric swatches** (`#swatches`, `.proc`: text on the left, swatch grid on the right). Eyebrow "Fabric swatches"; H "Feel the fabrics before you specify."; body ending in [SWATCH TERMS]; ulink "Request swatches" → `#apply`. The right side is a 2×2 `.swgrid` of fabric colors with texture overlays: linen `#DDD3BE`, bouclé `#ECE5D8`, wool `#B8AB96`, leather `#A36A40` (leather has a light label).
9. **Membership band** (`.statement`: ink background, centered, 170px padding). The eyebrow "Trade membership" is in drift. Below it, `.member` is 2 columns (1 at ≤960px), max-width 960px, with a 96px gap. Each column has a top rule in rgba(246,242,236,.25) and 40px padding-top.
   - "Not a member yet?" (italic Cormorant, clamp(28px, 3vw, 40px)); body "Apply below. [APPROVAL DETAILS]" in oat; `.btn.light` "Apply" → `#apply`.
   - "Already a member?"; body "Sign in to your trade account."; `.btn.outline-light` "Sign in" → `/account`.
10. **Trade application** (`#apply`, `.trade-apply`: 2 columns, `1fr 1.3fr`, 96px gap; stacks at ≤960px).
    - Left: eyebrow "Apply"; H2 "Join the trade program."; body; a contact block "Trade enquiries" with [TRADE EMAIL].
    - Right: the `TradeApplyForm` (fields below).
11. **Hospitality request** (`#hospitality-form`, `.sec.linen`, same 2-column layout). H2 "Send a hospitality request."; the `HospitalityForm` is on the right.

## Forms
Layout is `.tform`: 2 columns, gaps of 28px (rows) and 32px (columns); 1 column at ≤960px. Labels are Jost 400 11px eyebrows. Inputs have only a bottom border (1px rgba(42,37,31,.4), ink on focus), with 12px vertical padding, Jost 300 17px text and no border radius. `*` marks a required field.

**Shared contact fields (`ContactFields`)**
- First name*, Last name*
- Company*, Title
- Business phone* (tel), Email* (email)
- Business address* (full width)
- City*, then State* and ZIP* side by side (`.tform-pair`, `1.4fr 1fr`, 20px gap). State is a `<select>` of the 50 states plus DC.
- Company website (url), Instagram or social link

**Trade application (`TradeApplyForm`)**
- Profession* (full-width select): Interior designer, Architect, Stylist, Hospitality, Developer, Other
- The shared contact fields
- "Business card or business license *", with the helper "Upload either one. JPG, PNG or PDF." Two file inputs, Business card and Business license, accept `.jpg,.jpeg,.png,.pdf`. **Validation: at least one file is required.** The prototype does not enforce this yet, so implement it.
- "Is your business eligible for tax exemption?" uses Yes/No pills (`.pill`, 44px min height; the active pill is ink-filled). The default is **No**. Picking **Yes** reveals a full-width "Tax ID" input.
- Full-width `.btn` "Submit application"
- On submit, the form is replaced with a success state: rule, "Thank you." (Cormorant H3), "We've received your application and will be in touch."

**Hospitality request (`HospitalityForm`)**
- The shared contact fields
- "Your project*": textarea, 5 rows, placeholder "The property, the rooms, the pieces and quantities, your timeline"
- "Plans, sketches or references": multiple files, images or PDF
- "Send request" button, then a success state ("…received your request…").

**Backend**: neither form posts anywhere in the prototype. Wire them to the store's form or CRM handling (e.g. Shopify customer + tag `trade-pending`, or a form service), with the file uploads going to secure storage. Suggested state per form: `sent: boolean`; the trade form also needs `tax: 'yes' | 'no'`.

## New CSS (add to the stylesheet)
```css
.trade-hero{aspect-ratio:21/9;overflow:hidden;background:var(--linen)}
.trade-hero img{width:100%;height:100%;object-fit:cover}
.inl{border-bottom:1px solid currentColor}
.tform-pair{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:0 20px}
.tform-note{display:flex;flex-direction:column;gap:6px}
.tform .full{grid-column:1/-1}
.tile{display:block}
.tile-img{aspect-ratio:4/5;overflow:hidden;background:var(--linen)}
.tile-img img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.6,.2,1)}
.tile:hover .tile-img img{transform:scale(1.025)}
.tile-row{display:flex;justify-content:space-between;align-items:baseline;margin-top:20px}
.member{display:grid;grid-template-columns:1fr 1fr;gap:96px;max-width:960px;width:100%;text-align:center}
.member>div{display:flex;flex-direction:column;align-items:center;gap:18px;border-top:1px solid rgba(246,242,236,.25);padding-top:40px}
.member p{font-size:clamp(28px,3vw,40px)}
.member .body{color:var(--oat);margin-bottom:12px}
@media (max-width:960px){.trade-hero{aspect-ratio:4/3}.member{grid-template-columns:1fr;gap:48px}}
```
Existing classes reused from the main site: `.page-head`, `.tabs`, `.offer-grid`, `.tstep`, `.proc`, `.proc.rev`, `.proc-v`, `.proc-t`, `.proc-n`, `.proc-h`, `.swgrid`, `.swt`, `.tex-*`, `.statement`, `.trade-apply`, `.trade-contact`, `.trade-done`, `.tform`, `.pill`, `.btn`, `.ulink`, `.grid3`, `.card-name`, `.mat-grid`.

## Assets
Images are in `shop/photos/`: `csofa-a.jpg`, `marlowe-2.jpg`, `cchair-c.jpg`, `csofa-b.jpg`, `cchair-studio.jpg`, `frame-fill-cover.jpg`.

## Open placeholders (client to supply)
- [TRADE TERMS] (discount / pricing structure)
- [HOSPITALITY DETAILS]
- [SWATCH TERMS] (free or paid, how many, turnaround)
- [APPROVAL DETAILS] (review time, criteria)
- [TRADE EMAIL]
