import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false as any, // Bypass strict type if needed, but false should work in many versions
};

export default nextConfig;
