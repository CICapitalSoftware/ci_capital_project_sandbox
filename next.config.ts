// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // If you have a remote Strapi, add it here:
      // {
      //   protocol: 'https',
      //   hostname: 'your-strapi-domain.com',
      //   port: '',
      //   pathname: '/uploads/**',
      // },
    ],
    // Fallback for older Next.js versions
    domains: ['localhost', '127.0.0.1'],
  },
};

module.exports = nextConfig;