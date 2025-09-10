import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for Replit environment
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Development server configuration
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      buildActivity: false,
    },
  }),
};

export default nextConfig;
