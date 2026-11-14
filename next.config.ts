import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Production asset prefix for Netlify (auto-detected from ASSET_PREFIX env var) */
  assetPrefix: process.env.ASSET_PREFIX,
  /* Keep false for proper client-side routing on Netlify */
  partialPrefetching: false,
};

export default nextConfig;
