import { NextRequest, NextResponse } from 'next/server'
import FBAIntegrationService from '@/lib/fba-integration'

interface RouteParams {
	params: Promise<{ orderId: string }>
}

// Obtener estado de pedido
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { orderId } = await params

		if (!orderId) {
			return NextResponse.json(
				{ error: 'Order ID is required' },
				{ status: 400 }
			)
		}

		const shipment = await FBAIntegrationService.getOrderStatus(orderId)

		if (shipment) {
			return NextResponse.json({
				success: true,
				orderId,
				shipment,
				lastChecked: new Date().toISOString()
			})
		} else {
			return NextResponse.json(
				{ 
					success: false, 
					error: 'Order not found or no shipment information available',
					orderId
				},
				{ status: 404 }
			)
		}

	} catch (error: any) {
		console.error('Error fetching FBA order status:', error)
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message || 'Failed to fetch order status'
			},
			{ status: 500 }
		)
	}
}