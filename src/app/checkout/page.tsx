'use client'

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import stripePromise from '@/lib/stripe-client'
import Header from '@/components/shared/Header'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'

export default function CheckoutPage() {
	const [clientSecret, setClientSecret] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const { items, total } = useCart()
	const { user } = useAuth()

	useEffect(() => {
		if (!user) {
			window.location.href = '/login?redirect=/checkout'
			return
		}

		if (items.length === 0) {
			window.location.href = '/productos'
			return
		}

		// Create PaymentIntent as soon as the page loads
		fetch('/api/create-payment-intent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					setError(data.error)
				} else {
					setClientSecret(data.clientSecret)
				}
				setLoading(false)
			})
			.catch((err) => {
				setError('Error al inicializar el pago')
				setLoading(false)
			})
	}, [items, user])

	const appearance = {
		theme: 'stripe' as const,
		variables: {
			colorPrimary: '#2563eb',
			colorBackground: '#ffffff',
			colorText: '#1f2937',
			colorDanger: '#ef4444',
			fontFamily: 'Inter, system-ui, sans-serif',
			spacingUnit: '4px',
			borderRadius: '8px',
		},
	}

	const options = {
		clientSecret,
		appearance,
	}

	if (loading) {
		return (
			<>
				<Header />
				<main className="min-h-screen flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center"
					>
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
						<p className="text-neutral-600">Preparando el checkout...</p>
					</motion.div>
				</main>
			</>
		)
	}

	if (error) {
		return (
			<>
				<Header />
				<main className="min-h-screen flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center"
					>
						<div className="text-6xl text-red-400 mb-4">❌</div>
						<h1 className="text-2xl font-bold text-neutral-800 mb-2">
							Error en el Checkout
						</h1>
						<p className="text-neutral-600 mb-6">{error}</p>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => window.location.href = '/productos'}
							className="btn-primary"
						>
							Volver a Productos
						</motion.button>
					</motion.div>
				</main>
			</>
		)
	}

	return (
		<>
			<Header />
			<main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center mb-8"
					>
						<h1 className="text-3xl font-bold text-neutral-800 mb-2">
							Finalizar Compra
						</h1>
						<p className="text-lg text-neutral-600">
							Completa tu pedido de forma segura
						</p>
					</motion.div>

					{clientSecret && (
						<Elements options={options} stripe={stripePromise}>
							<CheckoutForm clientSecret={clientSecret} amount={total} />
						</Elements>
					)}
				</div>
			</main>
		</>
	)
}