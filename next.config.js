/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/manifest\.json$/],
  fallbacks: {
    document: "/offline",
  },
});

const nextConfig = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["src"],
  },
  images: { unoptimized: true },
  // reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    // Remove GenerateSW plugin in development mode
    if (dev) {
      config.plugins = config.plugins.filter((plugin) => {
        return plugin.constructor.name !== "GenerateSW";
      });
    }
    return config;
  },
  // rewrites: async () => [
  //   {
  //     source: '/referral',
  //     destination: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/sign-referral`
  //   }
  // ],
});

module.exports = nextConfig;
