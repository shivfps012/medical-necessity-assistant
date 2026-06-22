import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`,
        // e.g. /api/backend/analyze → http://localhost:8000/analyze
      },
    ];
  },
};

export default nextConfig;