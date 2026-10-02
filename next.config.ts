import type { NextConfig } from "next";

const SHOPIFY_STORE = "https://1j0scj-ce.myshopify.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy /cart/* and /checkout/* to Shopify so the native checkout
      // works under the ashwickhome.com domain without Next.js 404ing it.
      {
        source: "/cart/:path*",
        destination: `${SHOPIFY_STORE}/cart/:path*`,
      },
      {
        source: "/checkout/:path*",
        destination: `${SHOPIFY_STORE}/checkout/:path*`,
      },
    ];
  },
};

export default nextConfig;
