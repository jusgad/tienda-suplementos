import { NextRequest, NextResponse } from 'next/server'
import FBAIntegrationService from '@/lib/fba-integration'
import { NotificationService } from '@/lib/notifications'
import crypto from 'crypto'

// Webhook para recibir actualizaciones de FBA
export async function POST(request: NextRequest) {
	try {
		const webhookSecret = process.env.FBA_WEBHOOK_SECRET
		const signature = request.headers.get('x-amz-sns-signature')
		const body = await request.text()

		// Verificar firma del webhook (en producción)
		if (process.env.NODE_ENV === 'production' && webhookSecret && signature) {
			const expectedSignature = crypto
				.createHmac('sha256', webhookSecret)
				.update(body)
				.digest('hex')

			if (signature !== expectedSignature) {
				return NextResponse.json(
					{ error: 'Invalid webhook signature' },
					{ status: 401 }
				)
			}
		}

		const webhookData = JSON.parse(body)

		// Procesar el webhook
		await FBAIntegrationService.handleFBAWebhook(webhookData)

		// Enviar notificaciones específicas según el tipo de evento
		if (webhookData.eventType === 'SHIPMENT_CREATED' && webhookData.customerEmail) {
			await NotificationService.sendOrderUpdateNotification({
				userId: webhookData.userId || 'unknown',
				orderId: webhookData.orderId,
				status: 'shipped',
				email: webhookData.customerEmail,
				orderUrl: `/perfil/pedidos/${webhookData.orderId}`
			})
		}

		if (webhookData.eventType === 'SHIPMENT_DELIVERED' && webhookData.customerEmail) {
			await NotificationService.sendOrderUpdateNotification({
				userId: webhookData.userId || 'unknown',
				orderId: webhookData.orderId,
				status: 'delivered',
				email: webhookData.customerEmail,
				orderUrl: `/perfil/pedidos/${webhookData.orderId}`
			})
		}

		return NextResponse.json({
			success: true,
			message: 'Webhook processed successfully',
			eventType: webhookData.eventType
		})

	} catch (error: any) {
		console.error('Error processing FBA webhook:', error)
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message || 'Failed to process webhook'
			},
			{ status: 500 }
		)
	}
}

// Endpoint para validar la configuración del webhook
export async function GET(request: NextRequest) {
	const challenge = request.nextUrl.searchParams.get('hub.challenge')
	
	if (challenge) {
		// Responder al challenge de verificación de webhook
		return new NextResponse(challenge, {
			status: 200,
			headers: { 'Content-Type': 'text/plain' }
		})
	}

	return NextResponse.json({
		success: true,
		message: 'FBA Webhook endpoint is active',
		timestamp: new Date().toISOString()
	})
}