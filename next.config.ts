import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/work/reporting-speed-dashboard",
        destination: "/work/executive-sales-dashboard",
        permanent: true,
      },
      {
        source: "/work/internal-ops-web-app",
        destination: "/work/operations-data-platform",
        permanent: true,
      },
      {
        source: "/work/whatsapp-crm-qualification-flow",
        destination: "/work",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;