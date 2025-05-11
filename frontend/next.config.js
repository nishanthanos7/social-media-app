/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'randomuser.me',
      'picsum.photos',
      'ui-avatars.com',
      'example.com',
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:3000/api/v1/:path*',
      },
    ];
  },
  // Add this to prevent connection timeouts
  experimental: {
    proxyTimeout: 30000, // 30 seconds
  },
};

module.exports = nextConfig;
