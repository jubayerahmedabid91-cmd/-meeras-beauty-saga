import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Serve original image files instead of routing them through the
     Netlify image optimizer. Keeps next/image working on Netlify
     without depending on the optimizer runtime. */
  images: {
    unoptimized: true,
  },
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
