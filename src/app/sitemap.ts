import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wellness-supplements.com'
  
  // URLs estáticas principales
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cuestionario`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/seguimiento`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/perfil`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/registro`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // URLs de categorías de productos
  const categoryRoutes = [
    'vitaminas',
    'minerales',
    'omega-3',
    'probioticos',
    'colageno',
    'adaptogenos',
    'antioxidantes',
    'deportivos'
  ].map(category => ({
    url: `${baseUrl}/productos/categoria/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // En un entorno real, aquí cargarías las URLs de productos dinámicamente
  // desde la base de datos
  const productRoutes: MetadataRoute.Sitemap = []
  
  // TODO: Implementar cuando se tengan productos reales
  // const products = await getProducts()
  // const productRoutes = products.map(product => ({
  //   url: `${baseUrl}/productos/${product.id}`,
  //   lastModified: product.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }))

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
  ]
}