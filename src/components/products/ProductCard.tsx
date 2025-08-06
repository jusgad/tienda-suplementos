'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
	product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
	const { addItem } = useCart()
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR'
		}).format(price)
	}

	return (
		<motion.div
			whileHover={{ scale: 1.02, y: -5 }}
			transition={{ duration: 0.2 }}
			className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-neutral-200 overflow-hidden"
		>
			<Link href={`/productos/${product.id}`}>
				<div className="relative">
					<div className="aspect-w-16 aspect-h-12 bg-neutral-100">
						{/* Placeholder for product image */}
						<div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
							<div className="text-primary-600 text-4xl font-bold">
								{product.name.charAt(0)}
							</div>
						</div>
					</div>
					{product.stock < 20 && (
						<div className="absolute top-2 right-2 bg-accent-orange text-white px-2 py-1 text-xs rounded-full">
							¡Últimas unidades!
						</div>
					)}
				</div>

				<div className="p-4">
					<div className="mb-2">
						<span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
							{product.category}
						</span>
					</div>

					<h3 className="text-lg font-semibold text-neutral-800 mb-2 line-clamp-2">
						{product.name}
					</h3>

					<p className="text-neutral-600 text-sm mb-3 line-clamp-2">
						{product.description}
					</p>

					<div className="flex items-center mb-3">
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<svg
									key={i}
									className={`w-4 h-4 ${
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
							<span className="text-sm text-neutral-600 ml-2">
								{product.rating} ({product.reviewsCount})
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="text-2xl font-bold text-primary-600">
							{formatPrice(product.price)}
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
							onClick={(e) => {
								e.preventDefault()
								addItem(product, 1)
							}}
						>
							Agregar
						</motion.button>
					</div>

					<div className="mt-3 flex flex-wrap gap-1">
						{product.benefits.slice(0, 3).map((benefit, index) => (
							<span
								key={index}
								className="inline-block bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded"
							>
								{benefit}
							</span>
						))}
						{product.benefits.length > 3 && (
							<span className="inline-block text-neutral-500 text-xs px-2 py-1">
								+{product.benefits.length - 3} más
							</span>
						)}
					</div>
				</div>
			</Link>
		</motion.div>
	)
}