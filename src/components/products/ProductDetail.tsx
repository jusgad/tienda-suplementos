'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'

interface ProductDetailProps {
	product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
	const [quantity, setQuantity] = useState(1)
	const [selectedTab, setSelectedTab] = useState('description')
	const { addItem } = useCart()

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR'
		}).format(price)
	}

	const tabs = [
		{ id: 'description', label: 'Descripción' },
		{ id: 'ingredients', label: 'Ingredientes' },
		{ id: 'usage', label: 'Modo de Uso' },
		{ id: 'reviews', label: 'Reseñas' },
	]

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				{/* Product Images */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4">
						<div className="text-primary-600 text-8xl font-bold">
							{product.name.charAt(0)}
						</div>
					</div>
					<div className="grid grid-cols-4 gap-2">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="aspect-square bg-neutral-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors"
							>
								<div className="text-neutral-400 text-sm">
									{product.name.charAt(i % product.name.length)}
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Product Info */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="space-y-6"
				>
					<div>
						<span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full mb-2">
							{product.category}
						</span>
						<h1 className="text-3xl font-bold text-neutral-800 mb-2">
							{product.name}
						</h1>
						<div className="flex items-center mb-4">
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<svg
										key={i}
										className={`w-5 h-5 ${
											i < Math.floor(product.rating)
												? 'text-accent-yellow'
												: 'text-neutral-300'
										}`}
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
								<span className="text-neutral-600 ml-2">
									{product.rating} ({product.reviewsCount} reseñas)
								</span>
							</div>
						</div>
					</div>

					<div className="text-4xl font-bold text-primary-600">
						{formatPrice(product.price)}
					</div>

					<div className="prose text-neutral-600">
						<p>{product.description}</p>
					</div>

					{/* Benefits */}
					<div>
						<h3 className="text-lg font-semibold text-neutral-800 mb-3">
							Beneficios Principales
						</h3>
						<div className="grid grid-cols-2 gap-2">
							{product.benefits.map((benefit, index) => (
								<div key={index} className="flex items-center">
									<svg className="w-4 h-4 text-secondary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									<span className="text-sm text-neutral-700">{benefit}</span>
								</div>
							))}
						</div>
					</div>

					{/* Stock Status */}
					<div className="flex items-center">
						<div className={`w-3 h-3 rounded-full mr-2 ${
							product.stock > 20 ? 'bg-secondary-500' : 
							product.stock > 0 ? 'bg-accent-orange' : 'bg-red-500'
						}`}></div>
						<span className="text-sm text-neutral-600">
							{product.stock > 20 ? 'En stock' : 
							 product.stock > 0 ? `Solo ${product.stock} disponibles` : 'Agotado'}
						</span>
					</div>

					{/* Quantity and Add to Cart */}
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<label className="text-sm font-medium text-neutral-700">
								Cantidad:
							</label>
							<div className="flex items-center border border-neutral-300 rounded-md">
								<motion.button
									whileTap={{ scale: 0.95 }}
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
									className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
								>
									-
								</motion.button>
								<span className="px-4 py-2 text-neutral-800">{quantity}</span>
								<motion.button
									whileTap={{ scale: 0.95 }}
									onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
									className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
								>
									+
								</motion.button>
							</div>
						</div>

						<div className="flex space-x-4">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								disabled={product.stock === 0}
								onClick={() => addItem(product, quantity)}
								className="flex-1 btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Agregar al Carrito
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors"
							>
								❤️
							</motion.button>
						</div>
					</div>

					{/* Warnings */}
					{product.warnings && product.warnings.length > 0 && (
						<div className="bg-accent-orange/10 border border-accent-orange/20 rounded-md p-4">
							<h4 className="text-sm font-medium text-accent-orange mb-2">
								⚠️ Advertencias Importantes:
							</h4>
							<ul className="text-sm text-neutral-700 space-y-1">
								{product.warnings.map((warning, index) => (
									<li key={index}>• {warning}</li>
								))}
							</ul>
						</div>
					)}
				</motion.div>
			</div>

			{/* Product Details Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="mt-16"
			>
				<div className="border-b border-neutral-200">
					<nav className="flex space-x-8">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setSelectedTab(tab.id)}
								className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
									selectedTab === tab.id
										? 'border-primary-500 text-primary-600'
										: 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
								}`}
							>
								{tab.label}
							</button>
						))}
					</nav>
				</div>

				<div className="py-8">
					{selectedTab === 'description' && (
						<div className="prose max-w-none">
							<p className="text-neutral-700 leading-relaxed">
								{product.description}
							</p>
						</div>
					)}

					{selectedTab === 'ingredients' && (
						<div>
							<h3 className="text-lg font-semibold text-neutral-800 mb-4">
								Información Nutricional
							</h3>
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-neutral-200">
									<thead className="bg-neutral-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
												Ingrediente
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
												Cantidad
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
												Valor Diario
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-neutral-200">
										{product.ingredients.map((ingredient, index) => (
											<tr key={index}>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
													{ingredient.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
													{ingredient.amount}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
													{ingredient.dailyValue || 'N/A'}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{selectedTab === 'usage' && (
						<div>
							<h3 className="text-lg font-semibold text-neutral-800 mb-4">
								Modo de Uso
							</h3>
							<div className="bg-blue-50 border border-blue-200 rounded-md p-4">
								<p className="text-neutral-700">{product.usage}</p>
							</div>
						</div>
					)}

					{selectedTab === 'reviews' && (
						<div>
							<h3 className="text-lg font-semibold text-neutral-800 mb-4">
								Reseñas de Clientes
							</h3>
							<div className="text-center py-8">
								<p className="text-neutral-500">
									Las reseñas de clientes se implementarán próximamente.
								</p>
							</div>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	)
}