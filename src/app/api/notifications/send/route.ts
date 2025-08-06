import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { type, data } = body

		if (!type || !data) {
			return NextResponse.json(
				{ error: 'Missing required fields: type and data' },
				{ status: 400 }
			)
		}

		let result = false

		switch (type) {
			case 'replenishment':
				result = await NotificationService.sendReplenishmentNotification(data)
				break

			case 'order_update':
				result = await NotificationService.sendOrderUpdateNotification(data)
				break

			case 'recommendation':
				result = await NotificationService.sendRecommendationNotification(data)
				break

			case 'promotion':
				result = await NotificationService.sendPromotionNotification(data)
				break

			default:
				return NextResponse.json(
					{ error: 'Invalid notification type' },
					{ status: 400 }
				)
		}

		if (result) {
			return NextResponse.json({ 
				success: true, 
				message: 'Notification sent successfully' 
			})
		} else {
			return NextResponse.json(
				{ error: 'Failed to send notification' },
				{ status: 500 }
			)
		}

	} catch (error: any) {
		console.error('Error in notification API:', error)
		return NextResponse.json(
			{ error: error.message || 'Internal server error' },
			{ status: 500 }
		)
	}
}