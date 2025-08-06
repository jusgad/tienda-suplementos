import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/hooks/useCart'
import { ConsumptionProvider } from '@/hooks/useConsumption'
import CartSlideOver from '@/components/cart/CartSlideOver'
import { defaultMetadata } from '@/lib/seo'
import AnalyticsService from '@/lib/analytics'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#059669',
  colorScheme: 'light',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="es" className={inter.variable}>
			<head>
				{/* Preconnect to external domains */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="preconnect" href="https://www.google-analytics.com" />
				<link rel="preconnect" href="https://js.stripe.com" />
				
				{/* DNS Prefetch */}
				<link rel="dns-prefetch" href="https://api.stripe.com" />
				<link rel="dns-prefetch" href="https://images.unsplash.com" />
				
				{/* Structured Data - Organization */}
				<Script
					id="structured-data-organization"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							"name": "Wellness Supplements",
							"url": "https://wellness-supplements.com",
							"logo": "https://wellness-supplements.com/logo.png",
							"description": "Plataforma especializada en suplementos dietéticos con recomendaciones personalizadas y seguimiento inteligente de tu bienestar.",
							"sameAs": [
								"https://facebook.com/wellnesssupplements",
								"https://instagram.com/wellness_supplements",
								"https://twitter.com/wellness_supp"
							],
							"contactPoint": {
								"@type": "ContactPoint",
								"telephone": "+34-900-000-000",
								"contactType": "customer service",
								"areaServed": "ES",
								"availableLanguage": ["Spanish", "English"]
							}
						})
					}}
				/>
				
				{/* Google Analytics */}
				{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
					<>
						<Script
							src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
							strategy="afterInteractive"
						/>
						<Script
							id="google-analytics"
							strategy="afterInteractive"
							dangerouslySetInnerHTML={{
								__html: `
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
									page_title: document.title,
									page_location: window.location.href,
								});
								`
							}}
						/>
					</>
				)}
			</head>
			<body className={`${inter.className} font-sans antialiased`}>
				<AuthProvider>
					<CartProvider>
						<ConsumptionProvider>
							<div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
								{children}
								<CartSlideOver />
							</div>
						</ConsumptionProvider>
					</CartProvider>
				</AuthProvider>
				
				{/* Initialize Analytics */}
				<Script
					id="init-analytics"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
						if (typeof window !== 'undefined') {
							// Initialize Analytics Service
							const AnalyticsService = window.AnalyticsService;
							if (AnalyticsService) {
								AnalyticsService.init();
							}
						}
						`
					}}
				/>
			</body>
		</html>
	)
}