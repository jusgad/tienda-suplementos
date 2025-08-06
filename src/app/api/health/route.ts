import { NextResponse } from 'next/server'
import DynamoDBService from '@/lib/dynamodb'

export async function GET() {
	try {
		const dbHealth = await DynamoDBService.healthCheck()
		
		const healthStatus = {
			status: 'ok',
			timestamp: new Date().toISOString(),
			version: '1.0.0',
			services: {
				database: dbHealth,
				api: {
					status: 'healthy'
				},
				environment: {
					nodeEnv: process.env.NODE_ENV,
					region: process.env.AWS_REGION || 'us-east-1'
				}
			}
		}

		// Determinar código de estado HTTP
		const httpStatus = dbHealth.status.includes('healthy') ? 200 : 503

		return NextResponse.json(healthStatus, { status: httpStatus })

	} catch (error: any) {
		console.error('Health check failed:', error)
		
		return NextResponse.json({
			status: 'error',
			timestamp: new Date().toISOString(),
			error: error.message || 'Health check failed',
			services: {
				database: { status: 'unhealthy' },
				api: { status: 'degraded' }
			}
		}, { status: 503 })
	}
}