/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.cache = false; // Disable Webpack caching
    return config;
  },
};

module.exports = nextConfig;
