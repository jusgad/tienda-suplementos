import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { type, endpoint } = body

		if (!type || !endpoint) {
			return NextResponse.json(
				{ error: 'Missing required fields: type and endpoint' },
				{ status: 400 }
			)
		}

		let result = false

		switch (type) {
			case 'email':
				// Validar formato de email
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
				if (!emailRegex.test(endpoint)) {
					return NextResponse.json(
						{ error: 'Invalid email format' },
						{ status: 400 }
					)
				}
				result = await NotificationService.subscribeEmail(endpoint)
				break

			case 'sms':
				// Validar formato de teléfono (básico)
				const phoneRegex = /^\+?[\d\s-()]+$/
				if (!phoneRegex.test(endpoint)) {
					return NextResponse.json(
						{ error: 'Invalid phone number format' },
						{ status: 400 }
					)
				}
				result = await NotificationService.subscribeSMS(endpoint)
				break

			default:
				return NextResponse.json(
					{ error: 'Invalid subscription type. Use "email" or "sms"' },
					{ status: 400 }
				)
		}

		if (result) {
			return NextResponse.json({ 
				success: true, 
				message: `Successfully subscribed ${endpoint} to ${type} notifications` 
			})
		} else {
			return NextResponse.json(
				{ error: 'Failed to subscribe to notifications' },
				{ status: 500 }
			)
		}

	} catch (error: any) {
		console.error('Error in subscription API:', error)
		return NextResponse.json(
			{ error: error.message || 'Internal server error' },
			{ status: 500 }
		)
	}
}