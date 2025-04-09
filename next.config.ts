import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 experimental: {
    turbo: {
      enabled: false // Disable Turbopack
    }
  }
};

export default nextConfig;
