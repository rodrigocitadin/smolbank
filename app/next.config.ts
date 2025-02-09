import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/smolbank",
  experimental: {
    serverActions: {
      allowedOrigins: ['citadin.cc', '*.citadin.cc'],
    },
  },
};

export default nextConfig;
