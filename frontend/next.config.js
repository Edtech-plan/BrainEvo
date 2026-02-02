/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment variables
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  },

  // Image configuration
  images: {
    // Add your production image domains here
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**.netlify.app',
      },
      // Add your backend domain when deployed
      // {
      //   protocol: 'https',
      //   hostname: 'your-backend-domain.com',
      // },
    ],
  },

  // Output configuration for Netlify
  // The @netlify/plugin-nextjs handles output automatically
  // No need to set output: 'standalone'

  // Only use rewrites in development (local)
  // In production, use NEXT_PUBLIC_API_URL directly
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

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
