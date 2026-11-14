import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Required by @netlify/plugin-nextjs: the runtime expects .next/standalone
     to exist and fails the build otherwise. */
  output: "standalone",
  /* Tailwind CSS v4 is processed through the Turbopack loader.
     This is required — there is no postcss.config in this project. */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  partialPrefetching: false,
};

export default nextConfig;
