import { NextRequest, NextResponse } from 'next/server'
import FBAIntegrationService from '@/lib/fba-integration'

export async function GET(request: NextRequest) {
	try {
		const inventory = await FBAIntegrationService.getInventory()

		return NextResponse.json({
			success: true,
			data: inventory,
			count: inventory.length,
			lastUpdated: new Date().toISOString()
		})

	} catch (error: any) {
		console.error('Error in FBA inventory API:', error)
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message || 'Failed to fetch inventory',
				data: []
			},
			{ status: 500 }
		)
	}
}

// Sincronizar inventario con productos locales
export async function POST(request: NextRequest) {
	try {
		const { products } = await request.json()

		if (!products || !Array.isArray(products)) {
			return NextResponse.json(
				{ error: 'Invalid products data' },
				{ status: 400 }
			)
		}

		const result = await FBAIntegrationService.syncInventoryWithLocalProducts(products)

		return NextResponse.json({
			success: true,
			message: `Synchronized ${result.updated} products`,
			updated: result.updated,
			errors: result.errors
		})

	} catch (error: any) {
		console.error('Error in FBA inventory sync:', error)
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message || 'Failed to sync inventory'
			},
			{ status: 500 }
		)
	}
}