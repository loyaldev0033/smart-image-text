/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}
      config.resolve.alias['canvas'] = false
      config.resolve.alias['konva'] = false
      config.resolve.alias['react-konva'] = false
    }
    return config
  }
};

export default nextConfig;