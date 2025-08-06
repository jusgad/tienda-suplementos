import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://wellness-supplements.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/productos',
          '/productos/*',
          '/cuestionario',
          '/login',
          '/registro',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/perfil',
          '/perfil/*',
          '/seguimiento',
          '/seguimiento/*',
          '/checkout',
          '/checkout/*',
          '/*?*', // Parámetros de query
          '/search', // Páginas de búsqueda para evitar contenido duplicado
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/productos',
          '/productos/*',
          '/cuestionario',
          '/login',
          '/registro',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/perfil',
          '/perfil/*',
          '/seguimiento',
          '/seguimiento/*',
          '/checkout',
          '/checkout/*',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/productos',
          '/productos/*',
          '/cuestionario',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/perfil',
          '/perfil/*',
          '/seguimiento',
          '/seguimiento/*',
          '/checkout',
          '/checkout/*',
          '/login',
          '/registro',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}