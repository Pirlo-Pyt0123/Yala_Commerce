import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "yala-api.onrender.com" },
      { protocol: "https", hostname: "**.wikimedia.org" },
      { protocol: "https", hostname: "**.wikipedia.org" },
      { protocol: "http", hostname: "localhost", port: "3001" },
    ],
  },
};

export default nextConfig;
