import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Breakdown reports embed their stills, so admin uploads run to a few MB.
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
};

export default nextConfig;
