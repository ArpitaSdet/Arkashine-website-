import type { NextConfig } from "next";

// Scispectrum (researcher edition of the soil-calibration app, Flask) lives at /research.
// Point SCISPECTRUM_URL at wherever app.py runs in production.
const SCISPECTRUM_URL = (process.env.SCISPECTRUM_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/research", destination: `${SCISPECTRUM_URL}/` },
      { source: "/research/:path*", destination: `${SCISPECTRUM_URL}/:path*` },
    ];
  },
  experimental: {
    // batch predictions and multi-model runs can take a while
    proxyTimeout: 300_000,
  },
  cacheComponents: true,
  partialPrefetching: true,
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
