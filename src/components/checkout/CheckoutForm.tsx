'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	PaymentElement,
	AddressElement,
	useStripe,
	useElements
} from '@stripe/react-stripe-js'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'

interface CheckoutFormProps {
	clientSecret: string
	amount: number
}

export default function CheckoutForm({ clientSecret, amount }: CheckoutFormProps) {
	const stripe = useStripe()
	const elements = useElements()
	const { items, clearCart } = useCart()
	const { user } = useAuth()

	const [isLoading, setIsLoading] = useState(false)
	const [message, setMessage] = useState('')

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR'
		}).format(price)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!stripe || !elements) {
			return
		}

		setIsLoading(true)
		setMessage('')

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/checkout/success`,
			},
		})

		if (error) {
			if (error.type === 'card_error' || error.type === 'validation_error') {
				setMessage(error.message || 'Error en el pago')
			} else {
				setMessage('Ha ocurrido un error inesperado.')
			}
		}

		setIsLoading(false)
	}

	const paymentElementOptions = {
		layout: 'tabs' as const,
		defaultValues: {
			billingDetails: {
				name: user ? `${user.firstName} ${user.lastName}` : '',
				email: user?.email || '',
				phone: user?.phone || '',
			}
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-white rounded-lg shadow-md overflow-hidden"
			>
				{/* Order Summary */}
				<div className="bg-neutral-50 p-6 border-b border-neutral-200">
					<h2 className="text-xl font-semibold text-neutral-800 mb-4">
						Resumen del Pedido
					</h2>
					<div className="space-y-3">
						{items.map((item) => (
							<div key={item.productId} className="flex justify-between items-center">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded flex items-center justify-center">
										<span className="text-primary-600 font-bold text-sm">
											{item.product.name.charAt(0)}
										</span>
									</div>
									<div>
										<p className="text-sm font-medium text-neutral-800">
											{item.product.name}
										</p>
										<p className="text-xs text-neutral-600">
											Cantidad: {item.quantity}
										</p>
									</div>
								</div>
								<span className="text-sm font-semibold text-neutral-800">
									{formatPrice(item.price * item.quantity)}
								</span>
							</div>
						))}
						<div className="border-t border-neutral-200 pt-3 mt-3">
							<div className="flex justify-between items-center">
								<span className="text-lg font-semibold text-neutral-800">
									Total
								</span>
								<span className="text-xl font-bold text-primary-600">
									{formatPrice(amount)}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Payment Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					<div>
						<h3 className="text-lg font-semibold text-neutral-800 mb-4">
							Dirección de Envío
						</h3>
						<AddressElement 
							options={{
								mode: 'shipping',
								allowedCountries: ['ES', 'FR', 'IT', 'PT'],
							}}
						/>
					</div>

					<div>
						<h3 className="text-lg font-semibold text-neutral-800 mb-4">
							Información de Pago
						</h3>
						<PaymentElement options={paymentElementOptions} />
					</div>

					{message && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
						>
							{message}
						</motion.div>
					)}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						disabled={isLoading || !stripe || !elements}
						type="submit"
						className="w-full btn-primary py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
								Procesando Pago...
							</div>
						) : (
							`Pagar ${formatPrice(amount)}`
						)}
					</motion.button>

					<p className="text-xs text-neutral-500 text-center">
						Tu información de pago está protegida con encriptación SSL de nivel bancario.
						No almacenamos información de tarjetas de crédito.
					</p>
				</form>
			</motion.div>
		</div>
	)
}