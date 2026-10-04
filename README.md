# Ashwick Home

Storefront for Ashwick Home: organic furniture, handmade to order in the USA.
Built with Next.js (App Router) from the design handoffs in `docs/design-handoff/` (the Trade page follows `docs/design-handoff/trade/`).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are statically prerendered)
npm run lint
npm run typecheck
```

Set `NEXT_PUBLIC_SITE_URL` in production so Open Graph image URLs resolve.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/collections/all` · `/sofas` · `/chairs` | Collection grid |
| `/products/:id` | Product, "As designed" tab |
| `/products/:id/customize` | Product, "Customize" tab |
| `/pages/design-your-own` | Customize grid + bespoke enquiry |
| `/pages/trade` | Trade program + application |
| `/pages/our-story` | Brand story |
| `/pages/materials` | Materials |
| `/account` | Sign in |

## Layout

- `app/globals.css`: all styles and design tokens, ported from the prototype. Fonts (Cormorant Garamond, Jost) load through `next/font`.
- `lib/products.ts`: products, fabrics, options and collections. `lib/photos.ts`: photography (in `assets/photos/`), served through `next/image`.
- `components/cart.tsx`: cart state, persisted to `localStorage`.
- `components/shell.tsx`: announcement bar, header, mobile menu and cart drawer. `components/footer.tsx`: footer.
- `components/product-view.tsx`: product gallery, the As designed/Customize toggle and add to cart.
- `components/sections.tsx`: product card and grid, and shared page sections. `components/forms.tsx`: newsletter, bespoke, trade and sign-in forms.

## Forms

The newsletter, bespoke, trade application, hospitality request and product "Customize" forms all post to `app/api/forms/route.ts`, which emails each submission to hello@ashwickhome.com through [Resend](https://resend.com). The customer's address is the reply-to, and uploads (up to 4 MB in total) come as attachments. If sending fails, the form shows an error with the studio's email address.

Setup, once:
1. Create a Resend account and add the domain `ashwickhome.com` (Domains → Add domain), then add the DNS records it shows at your domain registrar.
2. Create an API key in Resend.
3. In Vercel → Project → Settings → Environment Variables, add `RESEND_API_KEY`, then redeploy.

Optional variables: `FORMS_TO` (default `hello@ashwickhome.com`) and `FORMS_FROM` (default `Ashwick Home <forms@ashwickhome.com>`; must be on the verified domain).

## Not wired up yet

- **Checkout pricing.** Checkout goes to Shopify (`app/api/checkout`, `lib/shopify.ts`), mapping each piece to one Shopify product; fabric, color and wood go along as line notes, so per-fabric prices must match in Shopify.
- **Swatch payment.** Swatch requests (/pages/fabric-swatches, $7 each) are emailed; the studio sends a payment link.
- **Client placeholders.** `[DIMENSIONS]`, custom option pricing, `[DELIVERY DETAILS]`, `[BESPOKE DETAILS]`, `[BESPOKE ORDERING DETAILS]`, `[TRADE TERMS]`, `[TRADE EMAIL]`, `[APPROVAL DETAILS]` and `[HOSPITALITY DETAILS]`.
- **Pages not designed yet.** These links are `#`: Delivery, Ordering, FAQs, Contact and Care.
