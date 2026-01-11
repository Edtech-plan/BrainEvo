/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  },
  images: {
    domains: ['localhost'],
  },
  // Only use rewrites in development (local)
  // In production on Vercel, use NEXT_PUBLIC_API_URL directly
  async rewrites() {
    // Only apply rewrites in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5001/api/:path*',
        },
      ];
    }
    return [];
  },
}

module.exports = nextConfig
