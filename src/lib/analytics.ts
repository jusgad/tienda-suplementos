declare global {
	interface Window {
		gtag: (...args: any[]) => void
		dataLayer: any[]
	}
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const gtag = (...args: any[]) => {
	if (typeof window !== 'undefined' && window.gtag) {
		window.gtag(...(args as [any, ...any[]]))
	}
}

// Inicializar Google Analytics
export const initGA = () => {
	if (!GA_MEASUREMENT_ID) {
		console.warn('Google Analytics Measurement ID not configured')
		return
	}

	gtag('js', new Date())
	gtag('config', GA_MEASUREMENT_ID, {
		page_title: document.title,
		page_location: window.location.href,
	})
}

// Eventos de página
export const pageView = (url: string) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('config', GA_MEASUREMENT_ID, {
		page_path: url,
		page_title: document.title,
		page_location: window.location.href,
	})
}

// Eventos de comercio electrónico
export const trackPurchase = (transactionId: string, items: any[], value: number, currency: string = 'EUR') => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'purchase', {
		transaction_id: transactionId,
		value: value,
		currency: currency,
		items: items.map(item => ({
			item_id: item.productId || item.id,
			item_name: item.product?.name || item.name,
			category: item.product?.category || item.category,
			quantity: item.quantity,
			price: item.price
		}))
	})
}

export const trackAddToCart = (item: any) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'add_to_cart', {
		currency: 'EUR',
		value: item.price,
		items: [{
			item_id: item.productId || item.id,
			item_name: item.product?.name || item.name,
			category: item.product?.category || item.category,
			quantity: item.quantity || 1,
			price: item.price
		}]
	})
}

export const trackRemoveFromCart = (item: any) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'remove_from_cart', {
		currency: 'EUR',
		value: item.price,
		items: [{
			item_id: item.productId || item.id,
			item_name: item.product?.name || item.name,
			category: item.product?.category || item.category,
			quantity: item.quantity || 1,
			price: item.price
		}]
	})
}

export const trackViewItem = (item: any) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'view_item', {
		currency: 'EUR',
		value: item.price,
		items: [{
			item_id: item.id,
			item_name: item.name,
			category: item.category,
			price: item.price
		}]
	})
}

export const trackBeginCheckout = (items: any[], value: number) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'begin_checkout', {
		currency: 'EUR',
		value: value,
		items: items.map(item => ({
			item_id: item.productId || item.id,
			item_name: item.product?.name || item.name,
			category: item.product?.category || item.category,
			quantity: item.quantity,
			price: item.price
		}))
	})
}

// Eventos de usuario
export const trackLogin = (method: string = 'email') => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'login', {
		method: method
	})
}

export const trackSignUp = (method: string = 'email') => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'sign_up', {
		method: method
	})
}

export const trackSearch = (searchTerm: string, category?: string) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'search', {
		search_term: searchTerm,
		category: category
	})
}

// Eventos personalizados para la plataforma de bienestar
export const trackQuestionnaireStart = () => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'questionnaire_start', {
		event_category: 'wellness',
		event_label: 'wellness_questionnaire'
	})
}

export const trackQuestionnaireComplete = (score: number, recommendationsCount: number) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'questionnaire_complete', {
		event_category: 'wellness',
		event_label: 'wellness_questionnaire',
		value: score,
		custom_parameter_1: recommendationsCount
	})
}

export const trackConsumptionAdd = (productName: string, dailyDose: number) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'consumption_tracking_add', {
		event_category: 'wellness',
		event_label: productName,
		value: dailyDose
	})
}

export const trackConsumptionComplete = (productName: string, totalDays: number) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'consumption_tracking_complete', {
		event_category: 'wellness',
		event_label: productName,
		value: totalDays
	})
}

export const trackReplenishmentAlert = (productName: string, daysRemaining: number) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'replenishment_alert', {
		event_category: 'wellness',
		event_label: productName,
		value: daysRemaining
	})
}

// Eventos de engagement
export const trackCustomEvent = (eventName: string, parameters?: any) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', eventName, parameters)
}

export const trackException = (description: string, fatal: boolean = false) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'exception', {
		description: description,
		fatal: fatal
	})
}

export const trackTiming = (name: string, value: number, category?: string) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('event', 'timing_complete', {
		name: name,
		value: value,
		event_category: category || 'performance'
	})
}

// Configuración de usuario
export const setUserProperties = (properties: { [key: string]: any }) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('config', GA_MEASUREMENT_ID, {
		custom_map: properties
	})
}

export const setUserId = (userId: string) => {
	if (!GA_MEASUREMENT_ID) return

	gtag('config', GA_MEASUREMENT_ID, {
		user_id: userId
	})
}

// Clase para gestión completa de analytics
export class AnalyticsService {
	private static isInitialized = false

	static init() {
		if (typeof window === 'undefined' || this.isInitialized) return

		// Cargar script de Google Analytics
		if (GA_MEASUREMENT_ID) {
			const script = document.createElement('script')
			script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
			script.async = true
			document.head.appendChild(script)

			// Inicializar dataLayer
			window.dataLayer = window.dataLayer || []
			window.gtag = function() {
				window.dataLayer.push(arguments)
			}

			initGA()
			this.isInitialized = true
			console.log('🔍 Google Analytics initialized')
		} else {
			console.warn('🔍 Google Analytics not configured (missing MEASUREMENT_ID)')
		}
	}

	static trackPageView(url: string) {
		pageView(url)
	}

	static trackEcommerce = {
		purchase: trackPurchase,
		addToCart: trackAddToCart,
		removeFromCart: trackRemoveFromCart,
		viewItem: trackViewItem,
		beginCheckout: trackBeginCheckout,
	}

	static trackUser = {
		login: trackLogin,
		signUp: trackSignUp,
		search: trackSearch,
		setUserId: setUserId,
		setProperties: setUserProperties,
	}

	static trackWellness = {
		questionnaireStart: trackQuestionnaireStart,
		questionnaireComplete: trackQuestionnaireComplete,
		consumptionAdd: trackConsumptionAdd,
		consumptionComplete: trackConsumptionComplete,
		replenishmentAlert: trackReplenishmentAlert,
	}

	static trackEngagement = {
		customEvent: trackCustomEvent,
		exception: trackException,
		timing: trackTiming,
	}

	// Método para consent management (GDPR)
	static setConsent(granted: boolean) {
		if (!GA_MEASUREMENT_ID) return

		gtag('consent', granted ? 'grant' : 'deny', {
			'analytics_storage': granted,
			'functionality_storage': granted,
			'security_storage': granted,
		})
	}

	// Método para opt-out completo
	static optOut() {
		if (typeof window !== 'undefined') {
			(window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = true
		}
	}

	// Método para obtener client ID
	static getClientId(): Promise<string> {
		return new Promise((resolve) => {
			if (!GA_MEASUREMENT_ID) {
				resolve('no-ga-id')
				return
			}

			gtag('get', GA_MEASUREMENT_ID, 'client_id', (clientId: string) => {
				resolve(clientId)
			})
		})
	}
}

export default AnalyticsService