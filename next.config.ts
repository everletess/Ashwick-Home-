import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old mattress address, kept working for links already shared.
  async redirects() {
    return [
      { source: "/products/natural-mattress", destination: "/products/luxury-organic-mattress", permanent: true },
      // The Living Wool page became the Living Wool entry on Our Materials.
      { source: "/pages/living-wool", destination: "/pages/materials#living-wool", permanent: true },
    ];
  },
};

export default nextConfig;
