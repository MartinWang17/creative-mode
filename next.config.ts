import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Breakdown reports embed their stills, so admin uploads run to a few MB.
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
  async redirects() {
    // The sales page is singular; people type the plural.
    return [{ source: "/creator-breakdowns", destination: "/creator-breakdown", permanent: false }];
  },
};

export default nextConfig;
