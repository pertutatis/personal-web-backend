/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  output: 'standalone',
  compress: true,

  images: {
    unoptimized: true,
  },

  experimental: {
    serverComponentsExternalPackages: ['pg'],
    typedRoutes: true,
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      config.optimization = {
        minimize: false,
        moduleIds: 'named',
        splitChunks: false,
      };
    }
    return config;
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
