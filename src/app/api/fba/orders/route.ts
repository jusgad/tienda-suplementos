import { NextRequest, NextResponse } from 'next/server'
import FBAIntegrationService from '@/lib/fba-integration'
import { NotificationService } from '@/lib/notifications'

// Crear pedido en FBA
export async function POST(request: NextRequest) {
	try {
		const orderData = await request.json()

		// Validar datos requeridos
		if (!orderData.orderId || !orderData.customerEmail || !orderData.items || !orderData.shippingAddress) {
			return NextResponse.json(
				{ error: 'Missing required order data' },
				{ status: 400 }
			)
		}

		// Crear pedido en FBA
		const result = await FBAIntegrationService.createOrder({
			orderId: orderData.orderId,
			customerName: orderData.customerName || 'Customer',
			customerEmail: orderData.customerEmail,
			shippingAddress: orderData.shippingAddress,
			items: orderData.items,
			totalAmount: orderData.totalAmount || 0,
			currency: orderData.currency || 'EUR',
			orderDate: new Date(orderData.orderDate || new Date()),
			requestedShipDate: orderData.requestedShipDate ? new Date(orderData.requestedShipDate) : undefined
		})

		if (result.success) {
			// Enviar notificación de confirmación de pedido
			try {
				await NotificationService.sendOrderUpdateNotification({
					userId: orderData.userId || 'unknown',
					orderId: orderData.orderId,
					status: 'processing',
					email: orderData.customerEmail,
					orderUrl: `/perfil/pedidos/${orderData.orderId}`
				})
			} catch (notificationError) {
				console.warn('Failed to send order notification:', notificationError)
			}

			return NextResponse.json({
				success: true,
				orderId: result.orderId,
				message: 'Order created successfully in FBA'
			})
		} else {
			return NextResponse.json(
				{ 
					success: false, 
					error: result.error || 'Failed to create order in FBA'
				},
				{ status: 500 }
			)
		}

	} catch (error: any) {
		console.error('Error in FBA order creation:', error)
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message || 'Internal server error'
			},
			{ status: 500 }
		)
	}
}