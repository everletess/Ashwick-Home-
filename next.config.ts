import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old mattress address, kept working for links already shared.
  async redirects() {
    return [{ source: "/products/natural-mattress", destination: "/products/luxury-organic-mattress", permanent: true }];
  },
};

export default nextConfig;
