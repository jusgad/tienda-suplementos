import crypto from 'crypto'

// Interfaces para la integración con Amazon FBA
export interface FBAProduct {
	asin: string
	sku: string
	title: string
	price: number
	quantity: number
	fulfillmentType: 'FBA' | 'FBM'
	condition: 'NEW' | 'USED' | 'REFURBISHED'
	imageUrl?: string
}

export interface FBAOrder {
	orderId: string
	customerName: string
	customerEmail: string
	shippingAddress: {
		name: string
		addressLine1: string
		addressLine2?: string
		city: string
		stateOrRegion: string
		postalCode: string
		countryCode: string
		phone?: string
	}
	items: Array<{
		sku: string
		quantity: number
		itemPrice: number
		title: string
	}>
	totalAmount: number
	currency: string
	orderDate: Date
	requestedShipDate?: Date
}

export interface FBAInventoryItem {
	sku: string
	asin: string
	fnsku: string
	productName: string
	totalQuantity: number
	inboundQuantity: number
	availableQuantity: number
	reservedQuantity: number
	fulfillableQuantity: number
	lastUpdated: Date
}

export interface FBAShipment {
	shipmentId: string
	trackingNumber?: string
	carrierName?: string
	shipmentStatus: 'WORKING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CHECKED_IN' | 'RECEIVING' | 'CLOSED' | 'CANCELLED' | 'DELETED' | 'ERROR'
	estimatedDeliveryDate?: Date
	actualDeliveryDate?: Date
	items: Array<{
		sku: string
		quantity: number
	}>
}

export class FBAIntegrationService {
	private static baseUrl = 'https://sellingpartnerapi-na.amazon.com'
	private static marketplaceId = process.env.FBA_MARKETPLACE_ID
	private static sellerId = process.env.FBA_SELLER_ID
	private static accessKey = process.env.FBA_ACCESS_KEY
	private static secretKey = process.env.FBA_SECRET_KEY

	// Crear firma AWS4 para autenticación
	private static createSignature(method: string, path: string, queryParams: string, payload: string, timestamp: string): string {
		if (!this.accessKey || !this.secretKey) {
			throw new Error('FBA credentials not configured')
		}

		const algorithm = 'AWS4-HMAC-SHA256'
		const region = 'us-east-1'
		const service = 'execute-api'
		const date = timestamp.split('T')[0]

		// Crear canonical request
		const canonicalRequest = [
			method,
			path,
			queryParams,
			'host:' + new URL(this.baseUrl).host,
			'x-amz-date:' + timestamp,
			'',
			'host;x-amz-date',
			crypto.createHash('sha256').update(payload).digest('hex')
		].join('\n')

		// Crear string to sign
		const credentialScope = `${date}/${region}/${service}/aws4_request`
		const stringToSign = [
			algorithm,
			timestamp,
			credentialScope,
			crypto.createHash('sha256').update(canonicalRequest).digest('hex')
		].join('\n')

		// Calcular signature
		const kDate = crypto.createHmac('sha256', 'AWS4' + this.secretKey).update(date).digest()
		const kRegion = crypto.createHmac('sha256', kDate).update(region).digest()
		const kService = crypto.createHmac('sha256', kRegion).update(service).digest()
		const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest()
		const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex')

		return `${algorithm} Credential=${this.accessKey}/${credentialScope}, SignedHeaders=host;x-amz-date, Signature=${signature}`
	}

	// Realizar solicitud autenticada a la API de FBA
	private static async makeAuthenticatedRequest(
		endpoint: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
		body?: any
	): Promise<any> {
		try {
			// En desarrollo, simular respuestas
			if (process.env.NODE_ENV === 'development') {
				console.log(`🚚 FBA API Call (Dev Mode): ${method} ${endpoint}`)
				return this.getMockResponse(endpoint, method)
			}

			const url = new URL(endpoint, this.baseUrl)
			const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
			const payload = body ? JSON.stringify(body) : ''

			const signature = this.createSignature(
				method,
				url.pathname,
				url.search.substring(1),
				payload,
				timestamp
			)

			const headers = {
				'Authorization': signature,
				'x-amz-date': timestamp,
				'Content-Type': 'application/json',
				'x-amz-access-token': this.accessKey || ''
			}

			const response = await fetch(url.toString(), {
				method,
				headers,
				body: payload || undefined
			})

			if (!response.ok) {
				throw new Error(`FBA API Error: ${response.status} ${response.statusText}`)
			}

			return await response.json()

		} catch (error) {
			console.error('Error in FBA API request:', error)
			throw error
		}
	}

	// Respuestas mock para desarrollo
	private static getMockResponse(endpoint: string, method: string): any {
		if (endpoint.includes('/inventory')) {
			return {
				inventorySummaries: [
					{
						asin: 'B08N5WRWNW',
						sku: 'PROTEIN-WHEY-001',
						fnsku: 'X001ABC123',
						productName: 'Proteína Whey Premium',
						totalQuantity: 150,
						inboundQuantity: 0,
						availableQuantity: 145,
						reservedQuantity: 5,
						fulfillableQuantity: 145,
						lastUpdated: new Date().toISOString()
					}
				]
			}
		}

		if (endpoint.includes('/orders') && method === 'POST') {
			return {
				orderId: `FBA${Date.now()}`,
				status: 'ACCEPTED',
				message: 'Order created successfully'
			}
		}

		if (endpoint.includes('/orders')) {
			return {
				orders: [
					{
						orderId: 'FBA123456789',
						orderStatus: 'SHIPPED',
						trackingNumber: 'TRK123456789',
						estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
					}
				]
			}
		}

		return { success: true, data: [] }
	}

	// Obtener inventario disponible
	static async getInventory(): Promise<FBAInventoryItem[]> {
		try {
			const response = await this.makeAuthenticatedRequest(
				`/fba/inventory/v1/summaries?details=true&granularityType=Marketplace&granularityId=${this.marketplaceId}&marketplaceIds=${this.marketplaceId}`
			)

			return response.inventorySummaries?.map((item: any) => ({
				sku: item.sku,
				asin: item.asin,
				fnsku: item.fnsku,
				productName: item.productName,
				totalQuantity: item.totalQuantity || 0,
				inboundQuantity: item.inboundQuantity || 0,
				availableQuantity: item.availableQuantity || 0,
				reservedQuantity: item.reservedQuantity || 0,
				fulfillableQuantity: item.fulfillableQuantity || 0,
				lastUpdated: new Date(item.lastUpdated || new Date())
			})) || []

		} catch (error) {
			console.error('Error fetching FBA inventory:', error)
			return []
		}
	}

	// Crear pedido en FBA
	static async createOrder(order: FBAOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
		try {
			const fbaOrderRequest = {
				marketplaceId: this.marketplaceId,
				displayableOrderId: order.orderId,
				displayableOrderDate: order.orderDate.toISOString(),
				displayableOrderComment: `Order from WellnessSupplements - ${order.customerEmail}`,
				fulfillmentAction: 'Ship',
				fulfillmentPolicy: 'FillOrKill',
				destinationAddress: {
					name: order.shippingAddress.name,
					addressLine1: order.shippingAddress.addressLine1,
					addressLine2: order.shippingAddress.addressLine2,
					city: order.shippingAddress.city,
					stateOrProvinceCode: order.shippingAddress.stateOrRegion,
					postalCode: order.shippingAddress.postalCode,
					countryCode: order.shippingAddress.countryCode,
					phone: order.shippingAddress.phone
				},
				items: order.items.map(item => ({
					sellerSku: item.sku,
					quantity: item.quantity,
					perUnitDeclaredValue: {
						currencyCode: order.currency,
						value: item.itemPrice
					}
				}))
			}

			const response = await this.makeAuthenticatedRequest(
				'/fba/outbound/2020-07-01/fulfillmentOrders',
				'POST',
				fbaOrderRequest
			)

			return {
				success: true,
				orderId: response.orderId || order.orderId
			}

		} catch (error: any) {
			console.error('Error creating FBA order:', error)
			return {
				success: false,
				error: error.message
			}
		}
	}

	// Obtener estado de pedido
	static async getOrderStatus(orderId: string): Promise<FBAShipment | null> {
		try {
			const response = await this.makeAuthenticatedRequest(
				`/fba/outbound/2020-07-01/fulfillmentOrders/${orderId}`
			)

			const fulfillmentOrder = response.fulfillmentOrder
			const shipments = response.fulfillmentShipments || []

			if (shipments.length > 0) {
				const shipment = shipments[0]
				return {
					shipmentId: shipment.amazonShipmentId,
					trackingNumber: shipment.fulfillmentCenterId,
					carrierName: shipment.shippingMethod,
					shipmentStatus: shipment.shipmentStatus,
					estimatedDeliveryDate: shipment.estimatedDeliveryDateTime ? 
						new Date(shipment.estimatedDeliveryDateTime) : undefined,
					actualDeliveryDate: shipment.actualDeliveryDateTime ? 
						new Date(shipment.actualDeliveryDateTime) : undefined,
					items: shipment.fulfillmentShipmentItems?.map((item: any) => ({
						sku: item.sellerSku,
						quantity: item.quantity
					})) || []
				}
			}

			return null

		} catch (error) {
			console.error('Error fetching order status:', error)
			return null
		}
	}

	// Sincronizar inventario con productos locales
	static async syncInventoryWithLocalProducts(localProducts: any[]): Promise<{ updated: number; errors: string[] }> {
		let updated = 0
		const errors: string[] = []

		try {
			const fbaInventory = await this.getInventory()
			
			for (const product of localProducts) {
				const fbaItem = fbaInventory.find(item => 
					item.sku === product.sku || item.asin === product.asin
				)

				if (fbaItem) {
					// Aquí actualizarías la base de datos local con el stock de FBA
					console.log(`📦 Syncing ${product.name}: ${fbaItem.availableQuantity} units available`)
					updated++
				} else {
					errors.push(`Product ${product.name} not found in FBA inventory`)
				}
			}

		} catch (error: any) {
			errors.push(`Sync error: ${error.message}`)
		}

		return { updated, errors }
	}

	// Webhook handler para actualizaciones de FBA
	static async handleFBAWebhook(webhookData: any): Promise<void> {
		try {
			const { eventType, orderId, shipmentId, status } = webhookData

			switch (eventType) {
				case 'ORDER_STATUS_CHANGED':
					console.log(`📦 Order ${orderId} status changed to: ${status}`)
					// Actualizar base de datos local
					// Enviar notificación al cliente
					break

				case 'SHIPMENT_CREATED':
					console.log(`🚚 Shipment ${shipmentId} created for order ${orderId}`)
					// Enviar notificación de envío
					break

				case 'SHIPMENT_DELIVERED':
					console.log(`✅ Shipment ${shipmentId} delivered`)
					// Enviar notificación de entrega
					break

				case 'INVENTORY_UPDATED':
					console.log('📊 Inventory levels updated')
					// Sincronizar inventario
					break

				default:
					console.log(`ℹ️ Unhandled FBA webhook event: ${eventType}`)
			}

		} catch (error) {
			console.error('Error handling FBA webhook:', error)
		}
	}
}

export default FBAIntegrationService