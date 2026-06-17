/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint runs separately via CI — skip during builds to avoid missing plugin errors
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
