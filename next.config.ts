import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // Old mattress address, kept working for links already shared.
  async redirects() {
    return [
      { source: "/products/natural-mattress", destination: "/products/luxury-organic-mattress", permanent: true },
      // Shopify handle used in ad URLs — redirect to the canonical mattress page.
      { source: "/products/the-ashbury", destination: "/products/luxury-organic-mattress", permanent: false },
      // The Living Wool page became the Living Wool entry on Inside the Ashbury.
      { source: "/pages/living-wool", destination: "/pages/inside-the-ashbury#living-wool", permanent: true },
      // Design your own became Ashwick Bespoke; its old #choose and #bespoke anchors are mapped on the page.
      { source: "/pages/design-your-own", destination: "/pages/bespoke", permanent: true },
      // The single pillow page became one page per fill, under a Pillows collection.
      { source: "/products/ashwick-pillow", destination: "/collections/pillows", permanent: true },
      // Shopify links that land on our domain (abandoned-checkout emails, the Shop app, cart permalinks in ads):
      // cart permalinks (/cart/{variant}:{qty}), cart tokens (/cart/c/…) and checkouts go to Shopify's own domain,
      // which opens checkout with those items. /cart itself is our cart page (app/cart/page.tsx).
      { source: "/cart/:path+", destination: "https://1j0scj-ce.myshopify.com/cart/:path+", permanent: false },
      { source: "/checkouts/:path*", destination: "https://1j0scj-ce.myshopify.com/checkouts/:path*", permanent: false },
      { source: "/:shop(\\d+)/checkouts/:path*", destination: "https://1j0scj-ce.myshopify.com/:shop/checkouts/:path*", permanent: false },
      // The Wren dog bed was renamed the Nook.
      { source: "/products/wren-dog-bed", destination: "/products/nook-dog-bed", permanent: true },
    ];
  },
};

export default nextConfig;
