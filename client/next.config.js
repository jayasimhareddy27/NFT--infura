/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gateway.pinata.cloud'],
    domains: ['ipfs.io'],
  },
};

module.exports = nextConfig;
