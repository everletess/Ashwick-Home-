# Ashwick Home

Storefront for Ashwick Home: organic furniture, handmade to order in the USA.
Built with Next.js (App Router) from the design handoff in `docs/design-handoff/`.

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

## Not wired up yet

- **Checkout.** The "Check out" button has no action. The data is shaped to move to the Shopify Storefront API: product ids are handles, and cart lines carry the mode and options.
- **Forms.** Newsletter, bespoke, trade and sign-in don't post anywhere yet. They show the thank-you state from the design.
- **Client placeholders.** `[DIMENSIONS]`, custom option pricing, `[DELIVERY DETAILS]`, `[BESPOKE DETAILS]`, `[BESPOKE ORDERING DETAILS]`, `[TRADE TERMS]`, `[TRADE EMAIL]` and `[APPROVAL DETAILS]`.
- **Pages not designed yet.** These links are `#`: Delivery, Ordering, FAQs, Contact, Care and Fabric swatches.
