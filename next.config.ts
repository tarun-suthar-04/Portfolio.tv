import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Next.js image optimization instead of serving raw files
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
  },
  // Compress responses
  compress: true,
  // Add performance-oriented HTTP headers
  async headers() {
    return [
      {
        source: "/media/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
  // Bundle analyzer can be toggled via env
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
