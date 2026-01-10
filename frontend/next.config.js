/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Add any build-time environment variables here
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
