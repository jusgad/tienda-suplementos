import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wellness Supplements - Tu Asesor Digital de Bienestar',
    short_name: 'Wellness Supplements',
    description: 'Plataforma especializada en suplementos dietéticos con recomendaciones personalizadas y seguimiento inteligente de tu bienestar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669', // Verde esmeralda principal
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'es-ES',
    
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    
    categories: [
      'health',
      'wellness',
      'nutrition',
      'supplements',
      'fitness'
    ],
    
    shortcuts: [
      {
        name: "Catálogo de Productos",
        short_name: "Productos",
        description: "Explorar todos nuestros suplementos",
        url: "/productos",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
      },
      {
        name: "Cuestionario de Salud",
        short_name: "Cuestionario",
        description: "Obtener recomendaciones personalizadas",
        url: "/cuestionario",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
      },
      {
        name: "Seguimiento",
        short_name: "Tracking",
        description: "Ver tu progreso y consumo",
        url: "/seguimiento",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
      }
    ],
    
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Pantalla principal de Wellness Supplements'
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Vista móvil del catálogo de productos'
      }
    ],
    
    related_applications: [
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=com.wellness.supplements',
        id: 'com.wellness.supplements'
      },
      {
        platform: 'itunes',
        url: 'https://apps.apple.com/app/wellness-supplements/id123456789'
      }
    ],
    
    prefer_related_applications: false
  }
}