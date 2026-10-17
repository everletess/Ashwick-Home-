import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old mattress address, kept working for links already shared.
  async redirects() {
    return [
      { source: "/products/natural-mattress", destination: "/products/luxury-organic-mattress", permanent: true },
      // The Living Wool page became the Living Wool entry on Inside the Ashbury.
      { source: "/pages/living-wool", destination: "/pages/inside-the-ashbury#living-wool", permanent: true },
      // Design your own became Ashwick Bespoke; its old #choose and #bespoke anchors are mapped on the page.
      { source: "/pages/design-your-own", destination: "/pages/bespoke", permanent: true },
    ];
  },
};

export default nextConfig;
