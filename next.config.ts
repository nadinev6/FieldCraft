import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for Replit environment
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
