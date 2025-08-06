import { SNSClient, PublishCommand, CreateTopicCommand, SubscribeCommand } from '@aws-sdk/client-sns'

const snsClient = new SNSClient({
	region: process.env.AWS_REGION || 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	}
})

export interface NotificationData {
	userId: string
	type: 'replenishment' | 'order_update' | 'recommendation' | 'promotion'
	title: string
	message: string
	email?: string
	phone?: string
	actionUrl?: string
}

export class NotificationService {
	private static topicArn = process.env.SNS_TOPIC_ARN

	static async sendReplenishmentNotification(data: {
		userId: string
		productName: string
		daysRemaining: number
		email: string
		productUrl?: string
	}) {
		const notification: NotificationData = {
			userId: data.userId,
			type: 'replenishment',
			title: 'Tiempo de Reponer tu Suplemento',
			message: `Tu suplemento ${data.productName} se está agotando. Quedan aproximadamente ${data.daysRemaining} días. ¡No te quedes sin él!`,
			email: data.email,
			actionUrl: data.productUrl
		}

		return this.sendNotification(notification)
	}

	static async sendOrderUpdateNotification(data: {
		userId: string
		orderId: string
		status: string
		email: string
		orderUrl?: string
	}) {
		const statusMessages = {
			processing: 'Tu pedido está siendo preparado',
			shipped: 'Tu pedido ha sido enviado',
			delivered: 'Tu pedido ha sido entregado',
			cancelled: 'Tu pedido ha sido cancelado'
		}

		const notification: NotificationData = {
			userId: data.userId,
			type: 'order_update',
			title: 'Actualización de tu Pedido',
			message: `Pedido ${data.orderId}: ${statusMessages[data.status as keyof typeof statusMessages] || 'Estado actualizado'}`,
			email: data.email,
			actionUrl: data.orderUrl
		}

		return this.sendNotification(notification)
	}

	static async sendRecommendationNotification(data: {
		userId: string
		productNames: string[]
		email: string
		questionnaireBased?: boolean
	}) {
		const notification: NotificationData = {
			userId: data.userId,
			type: 'recommendation',
			title: 'Nuevas Recomendaciones para Ti',
			message: data.questionnaireBased 
				? `Basado en tu perfil de bienestar, te recomendamos: ${data.productNames.join(', ')}`
				: `Productos que podrían interesarte: ${data.productNames.join(', ')}`,
			email: data.email,
			actionUrl: '/productos'
		}

		return this.sendNotification(notification)
	}

	static async sendPromotionNotification(data: {
		userId: string
		promotionTitle: string
		discount: string
		email: string
		validUntil?: Date
	}) {
		const notification: NotificationData = {
			userId: data.userId,
			type: 'promotion',
			title: data.promotionTitle,
			message: `¡Oferta especial! ${data.discount} de descuento${data.validUntil ? ` válida hasta ${data.validUntil.toLocaleDateString('es-ES')}` : ''}. ¡No te la pierdas!`,
			email: data.email,
			actionUrl: '/productos'
		}

		return this.sendNotification(notification)
	}

	private static async sendNotification(notification: NotificationData): Promise<boolean> {
		try {
			if (!this.topicArn) {
				console.warn('SNS Topic ARN not configured')
				// En desarrollo, solo log la notificación
				console.log('📧 Notification (Dev Mode):', notification)
				return true
			}

			// Preparar el mensaje con estructura JSON
			const messageData = {
				default: notification.message,
				email: this.formatEmailMessage(notification),
				sms: notification.message.substring(0, 160), // Límite SMS
			}

			const messageAttributes = {
				userId: {
					DataType: 'String',
					StringValue: notification.userId
				},
				notificationType: {
					DataType: 'String',
					StringValue: notification.type
				},
				email: {
					DataType: 'String',
					StringValue: notification.email || ''
				}
			}

			const command = new PublishCommand({
				TopicArn: this.topicArn,
				Message: JSON.stringify(messageData),
				Subject: notification.title,
				MessageStructure: 'json',
				MessageAttributes: messageAttributes
			})

			const result = await snsClient.send(command)
			console.log('✅ Notification sent successfully:', result.MessageId)
			return true

		} catch (error) {
			console.error('❌ Error sending notification:', error)
			
			// En desarrollo, simular el envío exitoso
			if (process.env.NODE_ENV === 'development') {
				console.log('📧 Notification (Dev Mode):', notification)
				return true
			}
			
			return false
		}
	}

	private static formatEmailMessage(notification: NotificationData): string {
		return `
			<html>
				<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
						<h2 style="color: #2563eb; margin-bottom: 16px;">${notification.title}</h2>
						<p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
							${notification.message}
						</p>
						${notification.actionUrl ? `
							<a href="${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${notification.actionUrl}" 
							   style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
								Ver Más
							</a>
						` : ''}
						<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
						<p style="color: #6b7280; font-size: 14px; margin: 0;">
							Este correo fue enviado por WellnessSupplements - Tu Asesor Digital de Bienestar
						</p>
					</div>
				</body>
			</html>
		`.trim()
	}

	// Métodos para gestión de suscripciones
	static async subscribeEmail(email: string): Promise<boolean> {
		try {
			if (!this.topicArn) {
				console.log('📧 Email subscription (Dev Mode):', email)
				return true
			}

			const command = new SubscribeCommand({
				TopicArn: this.topicArn,
				Protocol: 'email',
				Endpoint: email
			})

			const result = await snsClient.send(command)
			console.log('✅ Email subscribed successfully:', result.SubscriptionArn)
			return true

		} catch (error) {
			console.error('❌ Error subscribing email:', error)
			return false
		}
	}

	static async subscribeSMS(phoneNumber: string): Promise<boolean> {
		try {
			if (!this.topicArn) {
				console.log('📱 SMS subscription (Dev Mode):', phoneNumber)
				return true
			}

			const command = new SubscribeCommand({
				TopicArn: this.topicArn,
				Protocol: 'sms',
				Endpoint: phoneNumber
			})

			const result = await snsClient.send(command)
			console.log('✅ SMS subscribed successfully:', result.SubscriptionArn)
			return true

		} catch (error) {
			console.error('❌ Error subscribing SMS:', error)
			return false
		}
	}
}

// Función helper para automatizar notificaciones de reposición
export async function checkAndSendReplenishmentNotifications() {
	// Esta función se ejecutaría como un cron job o tarea programada
	console.log('🔍 Checking for replenishment notifications...')
	
	// En una implementación real, consultarías la base de datos
	// para obtener todos los registros de consumo que necesitan reposición
	
	// Simulación para desarrollo
	if (process.env.NODE_ENV === 'development') {
		console.log('📅 Replenishment check completed (Dev Mode)')
	}
}

export default NotificationService