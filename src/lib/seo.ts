import { Metadata } from 'next'

// Configuración base de SEO
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellness-supplements.com'
const siteName = 'Wellness Supplements'
const siteDescription = 'Plataforma especializada en suplementos dietéticos con recomendaciones personalizadas y seguimiento inteligente de tu bienestar.'

// Metadata por defecto
export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} - Tu Asesor Digital de Bienestar`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'suplementos dietéticos',
    'vitaminas',
    'minerales',
    'bienestar',
    'salud',
    'nutrición',
    'omega-3',
    'probióticos',
    'colágeno',
    'multivitamínicos',
    'asesor digital',
    'recomendaciones personalizadas',
    'seguimiento de salud',
    'España'
  ],
  authors: [
    {
      name: 'Wellness Supplements Team',
      url: baseUrl,
    },
  ],
  creator: 'Wellness Supplements',
  publisher: 'Wellness Supplements',
  category: 'Health & Wellness',
  classification: 'Business',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: baseUrl,
    siteName,
    title: `${siteName} - Tu Asesor Digital de Bienestar`,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${siteName} - Suplementos de calidad premium`,
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: `${siteName} Logo`,
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    site: '@wellness_supp',
    creator: '@wellness_supp',
    title: `${siteName} - Tu Asesor Digital de Bienestar`,
    description: siteDescription,
    images: ['/og-image.png'],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
    },
  },
  
  // App Links
  appLinks: {
    web: {
      url: baseUrl,
      should_fallback: true,
    },
  },
  
  // Alternate languages
  alternates: {
    canonical: baseUrl,
    languages: {
      'es-ES': baseUrl,
      'en-US': `${baseUrl}/en`,
      'ca-ES': `${baseUrl}/ca`,
    },
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#059669',
      },
    ],
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // Additional meta tags
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteName,
    'application-name': siteName,
    'msapplication-TileColor': '#059669',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#059669',
  },
}

// Función para generar metadata para páginas de productos
export function generateProductMetadata(product: {
  id: string
  name: string
  description: string
  category: string
  price: number
  image?: string
  rating?: number
  reviews?: number
}): Metadata {
  const title = `${product.name} - ${product.category} | ${siteName}`
  const description = `${product.description} Precio: €${product.price}. ${product.rating ? `⭐ ${product.rating}/5 (${product.reviews} reseñas)` : ''}`
  const url = `${baseUrl}/productos/${product.id}`
  
  return {
    title,
    description,
    keywords: [
      product.name,
      product.category,
      'suplemento',
      'vitamina',
      'mineral',
      'bienestar',
      'salud',
      'nutrición',
    ],
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: product.image ? [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        }
      ] : undefined,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : undefined,
    },
    alternates: {
      canonical: url,
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'EUR',
      'product:availability': 'in stock',
      'product:category': product.category,
      'product:brand': siteName,
    },
  }
}

// Función para generar metadata para categorías
export function generateCategoryMetadata(category: string): Metadata {
  const categoryNames: { [key: string]: string } = {
    'vitaminas': 'Vitaminas',
    'minerales': 'Minerales',
    'omega-3': 'Omega-3',
    'probioticos': 'Probióticos',
    'colageno': 'Colágeno',
    'adaptogenos': 'Adaptógenos',
    'antioxidantes': 'Antioxidantes',
    'deportivos': 'Suplementos Deportivos',
  }
  
  const categoryName = categoryNames[category] || category
  const title = `${categoryName} - Suplementos de Calidad Premium | ${siteName}`
  const description = `Descubre nuestra selección de ${categoryName.toLowerCase()} de la más alta calidad. Suplementos certificados con envío gratuito y asesoramiento personalizado.`
  const url = `${baseUrl}/productos/categoria/${category}`
  
  return {
    title,
    description,
    keywords: [
      categoryName,
      'suplementos',
      'vitaminas',
      'minerales',
      'bienestar',
      'salud',
      'nutrición',
      'calidad premium',
      'certificados',
    ],
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}

// Función para generar structured data (JSON-LD)
export function generateStructuredData(type: string, data: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
  }
  
  switch (type) {
    case 'organization':
      return {
        ...baseStructuredData,
        '@type': 'Organization',
        name: siteName,
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: siteDescription,
        sameAs: [
          'https://facebook.com/wellnesssupplements',
          'https://instagram.com/wellness_supplements',
          'https://twitter.com/wellness_supp',
          'https://linkedin.com/company/wellness-supplements',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+34-900-000-000',
          contactType: 'customer service',
          areaServed: 'ES',
          availableLanguage: ['Spanish', 'English'],
        },
      }
      
    case 'product':
      return {
        ...baseStructuredData,
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.image,
        brand: {
          '@type': 'Brand',
          name: siteName,
        },
        category: data.category,
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: siteName,
          },
        },
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.reviews,
          bestRating: 5,
          worstRating: 1,
        } : undefined,
      }
      
    case 'website':
      return {
        ...baseStructuredData,
        '@type': 'WebSite',
        name: siteName,
        url: baseUrl,
        description: siteDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/productos?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }
      
    default:
      return baseStructuredData
  }
}

// Función para generar breadcrumbs structured data
export function generateBreadcrumbsStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}