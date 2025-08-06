import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe-server'
import { CartItem } from '@/types'

export async function POST(request: NextRequest) {
	try {
		const { items }: { items: CartItem[] } = await request.json()

		if (!items || items.length === 0) {
			return NextResponse.json(
				{ error: 'No items provided' },
				{ status: 400 }
			)
		}

		// Calculate the order amount in cents
		const amount = Math.round(items.reduce((total, item) => {
			return total + (item.price * item.quantity * 100)
		}, 0))

		// Create a PaymentIntent with the order amount and currency
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: 'eur',
			automatic_payment_methods: {
				enabled: true,
			},
			metadata: {
				integration_check: 'accept_a_payment',
				order_id: `order_${Date.now()}`,
				item_count: items.length.toString(),
			},
		})

		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
			amount: amount / 100,
		})
	} catch (error: any) {
		console.error('Error creating payment intent:', error)
		return NextResponse.json(
			{ error: error.message },
			{ status: 500 }
		)
	}
}