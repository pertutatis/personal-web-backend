/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica
  reactStrictMode: false,
  poweredByHeader: false,
  distDir: '.next',

  // Configuración para API
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },

  // Optimizaciones
  output: 'standalone',
  compress: true,

  // Configuración de imágenes (deshabilitada para API)
  images: {
    unoptimized: true,
  },

  // Características experimentales
  experimental: {
    serverComponentsExternalPackages: ['pg'],
    typedRoutes: true,
    serverMinification: false,
    serverSourceMaps: true,
  },

  // Optimizaciones para API
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones de producción
    if (!dev && isServer) {
      config.optimization = {
        minimize: false,
        moduleIds: 'named',
        splitChunks: false,
      };
    }

    return config;
  },

  // Headers de seguridad básicos
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

  // Manejo de errores personalizado
  onError(error) {
    console.error('Next.js build error:', error);
  },
  onBuildError(error) {
    console.error('Next.js runtime error:', error);
  },
};

module.exports = nextConfig;
