/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para producción
  compress: true,
  poweredByHeader: false,
  
  // Configuración de imágenes
  images: {
    domains: ['localhost', 's3.amazonaws.com', 'images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ],
      },
    ]
  },

  // Redirects automáticos
  async redirects() {
    return [
      {
        source: '/profile',
        destination: '/perfil',
        permanent: true,
      },
      {
        source: '/tracking',
        destination: '/seguimiento',
        permanent: true,
      },
    ]
  },

  // Configuración experimental
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Variables de entorno
  env: {
    CUSTOM_KEY: 'wellness-supplements-v1.0.0',
  },

  // Configuración de Webpack para optimizaciones
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fallback para globals en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        global: false,
        Buffer: false,
      }
    }

    // Optimizaciones para producción
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Chunk para vendors principales
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          // Chunk específico para AWS SDK
          aws: {
            name: 'aws-sdk',
            chunks: 'all',
            test: /node_modules\/@aws-sdk/,
            priority: 30
          },
          // Chunk para Stripe
          stripe: {
            name: 'stripe',
            chunks: 'all',
            test: /node_modules\/@stripe/,
            priority: 30
          }
        }
      }
    }

    return config
  },
  
  // Configuración de transpilación
  transpilePackages: ['@aws-sdk'],

  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src']
  },

  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig