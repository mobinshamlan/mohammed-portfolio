import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/site";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
