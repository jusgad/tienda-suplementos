'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/shared/Header'
import { useCart } from '@/hooks/useCart'

export default function CheckoutSuccessPage() {
	const [paymentStatus, setPaymentStatus] = useState<'loading' | 'succeeded' | 'processing' | 'failed'>('loading')
	const searchParams = useSearchParams()
	const { clearCart } = useCart()

	useEffect(() => {
		const paymentIntent = searchParams.get('payment_intent')
		const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret')
		const redirectStatus = searchParams.get('redirect_status')

		if (redirectStatus === 'succeeded') {
			setPaymentStatus('succeeded')
			// Clear the cart after successful payment
			clearCart()
		} else if (redirectStatus === 'processing') {
			setPaymentStatus('processing')
		} else {
			setPaymentStatus('failed')
		}
	}, [searchParams, clearCart])

	if (paymentStatus === 'loading') {
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
						<p className="text-neutral-600">Verificando el pago...</p>
					</motion.div>
				</main>
			</>
		)
	}

	if (paymentStatus === 'succeeded') {
		return (
			<>
				<Header />
				<main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="max-w-md w-full text-center"
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6"
						>
							<svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="text-3xl font-bold text-neutral-800 mb-4"
						>
							¡Pago Exitoso!
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="text-lg text-neutral-600 mb-8"
						>
							Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación con todos los detalles.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="space-y-4"
						>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => window.location.href = '/perfil'}
								className="w-full btn-primary py-3"
							>
								Ver Mis Pedidos
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => window.location.href = '/productos'}
								className="w-full btn-secondary py-3"
							>
								Continuar Comprando
							</motion.button>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.6 }}
							className="mt-8 p-4 bg-blue-50 rounded-lg"
						>
							<h3 className="text-sm font-semibold text-blue-800 mb-2">
								Próximos Pasos:
							</h3>
							<ul className="text-sm text-blue-700 space-y-1">
								<li>• Recibirás un email de confirmación</li>
								<li>• Prepararemos tu pedido en 1-2 días hábiles</li>
								<li>• Te notificaremos cuando sea enviado</li>
								<li>• Entrega estimada: 3-5 días hábiles</li>
							</ul>
						</motion.div>
					</motion.div>
				</main>
			</>
		)
	}

	if (paymentStatus === 'processing') {
		return (
			<>
				<Header />
				<main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="max-w-md w-full text-center"
					>
						<div className="w-20 h-20 bg-accent-orange rounded-full flex items-center justify-center mx-auto mb-6">
							<svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</div>

						<h1 className="text-3xl font-bold text-neutral-800 mb-4">
							Procesando Pago
						</h1>

						<p className="text-lg text-neutral-600 mb-8">
							Tu pago está siendo procesado. Te notificaremos por email cuando se complete.
						</p>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => window.location.href = '/productos'}
							className="btn-primary"
						>
							Continuar Comprando
						</motion.button>
					</motion.div>
				</main>
			</>
		)
	}

	// Payment failed
	return (
		<>
			<Header />
			<main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="max-w-md w-full text-center"
				>
					<div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>

					<h1 className="text-3xl font-bold text-neutral-800 mb-4">
						Error en el Pago
					</h1>

					<p className="text-lg text-neutral-600 mb-8">
						Hubo un problema procesando tu pago. Por favor, intenta nuevamente.
					</p>

					<div className="space-y-4">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => window.location.href = '/checkout'}
							className="w-full btn-primary py-3"
						>
							Intentar Nuevamente
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => window.location.href = '/productos'}
							className="w-full btn-secondary py-3"
						>
							Volver a Productos
						</motion.button>
					</div>
				</motion.div>
			</main>
		</>
	)
}