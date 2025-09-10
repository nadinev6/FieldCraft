import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for Replit environment
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Development server configuration removed - devIndicators.buildActivity is deprecated
};

export default nextConfig;
