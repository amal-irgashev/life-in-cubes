/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [], // Add any image domains you need
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:8000/admin/:path*',
      },
    ]
  },
};

export default nextConfig;
