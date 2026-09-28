# Handoff: Ashwick Home Website

## Overview
The complete storefront for Ashwick Home. Ashwick Home makes organic furniture by hand, to order, in the USA, using solid hardwood, organic wool, organic linen, kapok and natural oils ("Nothing synthetic"). The site sells 4 sofas and 3 chairs. Each piece can be ordered **as designed** or **customized** (fabric, seat depth, length, wood finish). There are also pages for bespoke enquiries and a trade (designer) program.

## About the design files
The files in this bundle are **design references built in HTML/React**. They show the intended look, copy and behavior; they are not production code. Rebuild them in the target codebase using its existing framework and patterns. If there is no codebase yet, pick a suitable stack; for a furniture store with made-to-order checkout, a Shopify theme or a Next.js + Shopify Storefront API build are sensible choices. The URL structure below (`/collections/...`, `/products/...`, `/pages/...`) already follows Shopify conventions.

- `Ashwick Home Website (standalone).html` is a single-file build with all photos embedded. Open it in any browser to click through the full site.
- `site/index.html` and `site/*.jsx` are the readable source. `index.html` holds **all CSS**, and the JSX files hold the components and data. Photos load from `../shop/photos/`. Serve the bundle root over HTTP and open `/site/index.html`.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy and interactions are final. Recreate them pixel-accurately. Any copy in `[BRACKETS]` is a placeholder the client has not supplied yet (see "Open placeholders").

## Routes / screens
Routing in the prototype is hash-based (`#/products/marlowe`). Use real paths in production.

| Route | Screen |
|---|---|
| `/` | Home |
| `/collections/all`, `/collections/sofas`, `/collections/chairs` | Collection grid (filtered) |
| `/products/:id` | Product page, "As designed" tab |
| `/products/:id/customize` | Product page, "Customize" tab |
| `/pages/design-your-own` | Design your own (customize grid + bespoke enquiry form) |
| `/pages/trade` | Trade program + application form |
| `/pages/our-story` | Brand story (long-form prose) |
| `/pages/materials` | Materials |
| `/account` | Sign in |

### Global shell (`site-shell.jsx`)
- **Announcement bar**: `#2A251F` background, alabaster text, Jost 400 10.5px, letter-spacing .26em, uppercase, 11px vertical padding. Copy: "Handmade to order in the USA · Nothing synthetic".
- **Header**: sticky, alabaster background, 1px hairline bottom border. It is a 3-column grid (`1fr auto 1fr`), 18px × 56px padding, max-width 1440. The left nav is Shop / Sofas / Chairs / Design your own. The centered wordmark is "ASHWICK HOME" (Cormorant 400 19px, letter-spacing .44em) over the italic tagline "Made of nature. Built to last." (Cormorant italic 300 13px, walnut). The right nav is Our story / Materials / Account / Cart (n). Nav links are Jost 400 11px, letter-spacing .2em, uppercase, 30px gap.
- **≤960px**: the navs are hidden, a burger (44×44) appears on the left, and a Cart link on the right. The burger opens a full-screen alabaster menu with the main links in Cormorant 300 38px and secondary links below a hairline.
- **Footer**: ink background, 100px top padding. The grid is `1.6fr 1fr 1fr 1fr`: brand, then 3 link columns. Column titles are Jost 400 10px, letter-spacing .3em, drift `#BCAE96`. The bottom row sits above a rgba(246,242,236,.18) hairline.
- **Cart drawer**: slides from the right, `min(460px,100vw)`, transform .35s `cubic-bezier(.4,0,.2,1)`, scrim rgba(42,37,31,.4). Each line shows a 96px square image, name (Cormorant 22px), mode ("As designed" / "Customized"), option list, qty stepper and Remove. The footer is on linen, with the subtotal in Cormorant 30px, the note "Paid in full at checkout. Taxes and shipping calculated at checkout." and a full-width "Check out" button.

### Home (`site-home.jsx`)
In order:
1. **Hero**: full-bleed `hero.jpg`, height 88vh (min 640, max 1000), `object-fit:cover`. Bottom scrim `linear-gradient(180deg, rgba(20,18,14,0) 30%, rgba(20,18,14,.52) 100%)`. The text is centered and sits 10% from the bottom. Eyebrow "Organic furniture · Handmade in the USA", then an italic H1 (max 14ch), body, and two buttons (light fill + light outline).
2. **Values strip**: 4 columns separated by hairlines. Each has a Cormorant 22px title and a Jost 13.5px walnut description.
3. **Collection grid**: `.grid3`, 3 columns, gap 72px row / 32px column. Copy: "Four sofas and three chairs. Order each as we designed it, or make it yours."
4. **As designed / Make it yours**: two panels. The first uses `marlowe-2.jpg` (4:3); the second is a 2×2 fabric swatch grid.
5. **Made by hand**: 2 columns, gap 96. The left is `frame-fill-cover.jpg` at **2:3**, uncropped. The right has the eyebrow "Made by hand, in the USA", the H2 "Started when you order it. Finished for your home." and 3 numbered steps: The frame / The fill / The cover.
6. **Materials**: 5 columns. Solid hardwood, Organic wool, Organic linen, Kapok, Natural oils.
7. **Name story**: the product names listed large in italic Cormorant, linking to each product page.
8. **Newsletter**: an underline-style email input with a text button.

### Product card (`ProductCard`, used on Home / Collection / Design your own)
- Square image (`aspect-ratio:1/1`, linen background, `object-fit:cover`).
- **Hover**: the image scales 1.025 over 1.2s `cubic-bezier(.2,.6,.2,1)`. If the product has a second photo **and** `cardSingle` is not set, the second photo crossfades in over .6s. A CTA bar ("Shop now" / "Customize") slides up 8px and fades in over .35s; it sits 16px from the edges, rgba(246,242,236,.96), Jost 500 10px, .26em. The CTA is hidden at ≤960px.
- **Per-product crop overrides** (keep these; they frame the furniture properly):
  - Marlowe: `scale(1.18)`, origin `39% 66%`, hover `scale(1.2)`.
  - Pembroke: `scale(1.28)`, origin `52% 60%`, hover `scale(1.31)`.
- Below the image: a row with the name (Cormorant 300 28px) and price (Cormorant 300 21px; prefixed with "From " when `priceFrom`). Then the one-line description (Jost 15px walnut, max 40ch) and a meta line "{Type} · Made to order · Customizable" (Jost 400 10px, .22em uppercase).

### Product page (`site-pages.jsx` → `ProductPage`)
- Breadcrumb, then a 2-column grid (`1.25fr 1fr`, gap 80).
- **Gallery**: the main image uses `object-fit:contain`, max-height 82vh, on linen. Below it are 84px square thumbnails with a 1px hairline border (ink when active).
- **Info column** (sticky, top 120px):
  - Eyebrow "{Type} · Made to order · Handmade in the USA".
  - Name in Cormorant 300 clamp(44px, 4.6vw, 68px).
  - Price in Cormorant 30px, with "From " when applicable.
  - Description line.
  - Mode toggle: 2 equal buttons, 52px tall, 1px ink border; the active one is ink-filled.
  - **As designed** shows a definition list of the designed fabric and options. **Customize** shows option groups rendered as pills (44px min height; the active pill is ink-filled). The groups are Fabric (swatch chips), Seat depth, Length and Wood finish, and each is shown only if the product flag is true.
  - Full-width "Add to cart · $X" button, then assurance tags with sage dots: Made to order / Handmade in the USA / Paid in full at checkout.
- **Specs**: Materials / Dimensions / Made / Payment.
- **Related**: 3 more products, same category first.

### Design your own, Trade, Story, Materials, Account
See `site-pages.jsx` for the exact copy.
- **Design your own**: a 6-step process list, a customize grid (every product card links to `/customize`), and a bespoke enquiry form.
- **Trade**: offer grid (4 columns), 3 steps, and an application form. The form fields are underline-only inputs (1px rgba(42,37,31,.4) border, ink on focus) and there is a file upload. Submitting swaps to a "Thank you." state.

## Product data (`site-data.jsx` → `PRODUCTS`)
| id | Name | Type | Price | Photos (first = card image) |
|---|---|---|---|---|
| marlowe | The Marlowe | Sofa | $8,500 | marlowe-studio, marlowe-1, marlowe-2 (card: single) |
| chatsworth | The Chatsworth | Sofa | $10,500 | chatsworth-s1 |
| cotswold | The Cotswold | Sofa | From $8,500 | csofa-front, csofa-studio, csofa-b, csofa-c, csofa-a, cchair-c, csofa-d (card: single) |
| burford | The Burford | Sofa | From $6,500 | burford-1 |
| pembroke | The Pembroke | Chair | $5,000 | pembroke-1 |
| cotswold-chair | The Cotswold Chair | Chair | $4,000 | cchair-studio, cchair-c (card: single) |
| clifton | The Clifton | Chair | $5,500 | clifton-s1, clifton-s2 |

Each product also has these fields: `line` (description), `materials`, `fabrics[]`, `designedFabric`, and the `depth` / `length` / `finish` option flags.

- **Fabrics**: Organic linen `#DDD3BE`, Organic wool bouclé `#ECE5D8`, Brushed organic wool `#B8AB96`, Vegetable-tanned leather `#A36A40`. Swatch chips use subtle CSS texture overlays (`.tex-*` classes).
- **Depth / Length / Finish options**: see `DEPTHS`, `LENGTHS` and `FINISHES` (Natural / Warm / Deep).
- **Pricing note**: customized options don't change the price yet. "From" prices go to the cart as the base price.

## State
- `route`: parsed from the URL.
- `cart`: `{ items[], open }`. Each item is `{ id, name, photo, price, qty, mode, options[[label,value]] }`. Actions are add (opens the drawer), remove, qty, and setOpen. `subtotal` and `count` are derived.
- Product page: `mode` ('designed' | 'custom'), the active gallery index, and the selected fabric, depth, length and finish.
- Forms: local `sent` flag (no backend in the prototype).

## Design tokens
**Colors**
- `--alabaster #F6F2EC`: page background
- `--linen #EAE3D6`: image wells, sections
- `#F1ECE3`: tinted section background
- `--oat #D8CDB8`
- `--drift #BCAE96`: footer labels
- `--ash #9C9180`
- `--clay #8A7B66`: numbers, hover accent
- `--walnut #4B4137`: secondary text
- `--ink #2A251F`: primary text, buttons, dark sections
- `--sage #818A77`: assurance dots
- Hairline: `rgba(42,37,31,.16)`; stronger rule: `rgba(42,37,31,.28)`

**Typography**
- **Fonts**: Cormorant Garamond (300/400, with italics) for display; Jost (300/400/500) for UI and body. Both are on Google Fonts.
- H1: Cormorant 300 clamp(46px, 6vw, 92px), line-height 1.02, letter-spacing −.012em (italic in the hero).
- H2: Cormorant 300 clamp(34px, 4vw, 58px), line-height 1.08, `text-wrap:balance`.
- H3: Cormorant 300 30px.
- Body: Jost 300 17px, line-height 1.75, walnut, max 52ch.
- Fine print: Jost 300 13px.
- Eyebrow: Jost 400 11px, letter-spacing .3em, uppercase, walnut.
- Button / link labels: Jost 500 11px, letter-spacing .26em, uppercase.

**Buttons**
- `.btn`: min-height 52px, 0×34px padding, ink fill, alabaster text, square corners. Hover changes it to walnut over .2s.
- Variants: `.ghost`, `.light`, `.outline-light`.
- `.ulink`: text link with a 1px underline and 5px bottom padding.

**Layout**
- Container max-width 1440px, 56px side gutter (20px at ≤960px).
- Sections have 140px vertical padding (88px at ≤960px).
- No border radius anywhere and no shadows.

**Breakpoints**
- 1180px: grid3 → 2 columns.
- 960px: mobile header; most 2-column layouts stack.
- 620px: grid3 → 1 column; buttons go full-width.

## Assets
All photos are in `shop/photos/`, JPEG, around 1400px wide. The client supplied them; several are AI-generated renders and should be replaced with final photography when it's available.
- `csofa-front.jpg` was made square by mirroring a strip of the wall at the top and the floor at the bottom. Replace it with a native square crop if one is supplied.
- `csofa-studio.jpg` is the white-backdrop sofa shot, padded to square on white.
- The favicon, logo files and fabric swatch photos are not included; swatches are CSS color + texture for now.

## Open placeholders (client to supply)
- [DIMENSIONS] for all products
- Custom option pricing
- [DELIVERY DETAILS]
- [BESPOKE DETAILS]
- [BESPOKE ORDERING DETAILS]
- [TRADE TERMS]
- [TRADE EMAIL]
- [APPROVAL DETAILS]
- Pages linked but not yet designed: Delivery, Ordering, FAQs, Contact, Care, Fabric swatches.

## Files
- `Ashwick Home Website (standalone).html`: single-file clickable build.
- `site/index.html`: all CSS, plus script loading.
- `site/site-data.jsx`: products, fabrics, options, router, `Photo`, cart state.
- `site/site-shell.jsx`: announcement bar, header, mobile menu, footer, cart drawer.
- `site/site-home.jsx`: home sections and `ProductCard`.
- `site/site-pages.jsx`: Collection, Product, Design your own, Trade, Story, Materials, Account.
- `site/site-app.jsx`: route switch.
- `shop/photos/*.jpg`: photography.
