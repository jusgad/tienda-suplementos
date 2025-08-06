'use client'

import { Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/hooks/useCart'

export default function CartSlideOver() {
	const { items, isOpen, total, itemCount, removeItem, updateQuantity, setCartOpen } = useCart()

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR'
		}).format(price)
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<Fragment>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setCartOpen(false)}
						className="fixed inset-0 bg-black bg-opacity-50 z-40"
					/>

					{/* Slide Over Panel */}
					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-neutral-200">
							<h2 className="text-lg font-semibold text-neutral-800">
								Carrito de Compras ({itemCount})
							</h2>
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => setCartOpen(false)}
								className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
							>
								<svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</motion.button>
						</div>

						{/* Cart Items */}
						<div className="flex-1 overflow-y-auto p-6">
							{items.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl text-neutral-300 mb-4">🛒</div>
									<h3 className="text-lg font-medium text-neutral-800 mb-2">
										Tu carrito está vacío
									</h3>
									<p className="text-neutral-600 mb-6">
										Agrega algunos productos para comenzar tu compra
									</p>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setCartOpen(false)}
										className="btn-primary"
									>
										Explorar Productos
									</motion.button>
								</div>
							) : (
								<div className="space-y-4">
									{items.map((item) => (
										<motion.div
											key={item.productId}
											layout
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg"
										>
											{/* Product Image Placeholder */}
											<div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
												<span className="text-primary-600 font-bold text-lg">
													{item.product.name.charAt(0)}
												</span>
											</div>

											{/* Product Details */}
											<div className="flex-1 min-w-0">
												<h3 className="text-sm font-medium text-neutral-800 truncate">
													{item.product.name}
												</h3>
												<p className="text-sm text-neutral-600">
													{formatPrice(item.price)} cada uno
												</p>
												<div className="flex items-center mt-2">
													<motion.button
														whileTap={{ scale: 0.9 }}
														onClick={() => updateQuantity(item.productId, item.quantity - 1)}
														className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
													>
														-
													</motion.button>
													<span className="mx-3 text-sm font-medium text-neutral-800">
														{item.quantity}
													</span>
													<motion.button
														whileTap={{ scale: 0.9 }}
														onClick={() => updateQuantity(item.productId, item.quantity + 1)}
														className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
													>
														+
													</motion.button>
												</div>
											</div>

											{/* Price and Remove */}
											<div className="flex flex-col items-end space-y-2">
												<span className="text-sm font-semibold text-primary-600">
													{formatPrice(item.price * item.quantity)}
												</span>
												<motion.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
													onClick={() => removeItem(item.productId)}
													className="text-red-500 hover:text-red-700 transition-colors"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
													</svg>
												</motion.button>
											</div>
										</motion.div>
									))}
								</div>
							)}
						</div>

						{/* Footer */}
						{items.length > 0 && (
							<div className="border-t border-neutral-200 p-6 space-y-4">
								{/* Subtotal */}
								<div className="flex justify-between items-center">
									<span className="text-base font-medium text-neutral-800">
										Subtotal
									</span>
									<span className="text-lg font-semibold text-primary-600">
										{formatPrice(total)}
									</span>
								</div>

								{/* Shipping Info */}
								<p className="text-xs text-neutral-500">
									Los gastos de envío se calcularán en el checkout
								</p>

								{/* Checkout Button */}
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => window.location.href = '/checkout'}
									className="w-full btn-primary py-3 text-lg font-medium"
								>
									Proceder al Pago
								</motion.button>

								{/* Continue Shopping */}
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setCartOpen(false)}
									className="w-full border border-neutral-300 text-neutral-700 py-3 rounded-md hover:bg-neutral-50 transition-colors"
								>
									Continuar Comprando
								</motion.button>
							</div>
						)}
					</motion.div>
				</Fragment>
			)}
		</AnimatePresence>
	)
}