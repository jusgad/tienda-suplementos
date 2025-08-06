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
			whileHover={{ scale: 1.03, y: -8 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary-100 hover:border-primary-300 overflow-hidden group"
		>
			<Link href={`/productos/${product.id}`}>
				<div className="relative">
					<div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-brand-wellness-blue via-white to-brand-fresh-green">
						<div className="w-full h-56 bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-secondary-100/30"></div>
							<motion.div
								className="relative z-10 w-20 h-24 bg-gradient-to-b from-white to-primary-50 rounded-lg border-2 border-primary-200 shadow-lg flex items-center justify-center"
								whileHover={{ rotate: [0, -5, 5, 0] }}
								transition={{ duration: 0.5 }}
							>
								<div className="text-primary-600 text-2xl font-bold">
									{product.name.charAt(0)}
								</div>
							</motion.div>
							<div className="absolute top-2 left-2 w-3 h-3 bg-primary-300 rounded-full opacity-60"></div>
							<div className="absolute bottom-4 right-4 w-2 h-2 bg-secondary-300 rounded-full opacity-40"></div>
							<div className="absolute top-1/2 right-2 w-1.5 h-1.5 bg-primary-400 rounded-full opacity-50"></div>
						</div>
					</div>
					{product.stock < 20 && (
						<motion.div 
							className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 text-xs font-medium rounded-full shadow-md"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring" }}
						>
							¡Últimas!
						</motion.div>
					)}
				</div>

				<div className="p-6">
					<div className="mb-3">
						<span className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
							{product.category}
						</span>
					</div>

					<h3 className="text-xl font-bold text-neutral-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
						{product.name}
					</h3>

					<p className="text-neutral-600 text-sm mb-4 line-clamp-3 leading-relaxed">
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

					<div className="flex items-center justify-between mb-4">
						<div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
							{formatPrice(product.price)}
						</div>
						<motion.button
							whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)" }}
							whileTap={{ scale: 0.95 }}
							className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg"
							onClick={(e) => {
								e.preventDefault()
								addItem(product, 1)
							}}
						>
							Agregar al carrito
						</motion.button>
					</div>

					<div className="flex flex-wrap gap-2">
						{product.benefits.slice(0, 3).map((benefit, index) => (
							<span
								key={index}
								className="inline-block bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full border border-primary-200"
							>
								{benefit}
							</span>
						))}
						{product.benefits.length > 3 && (
							<span className="inline-block text-neutral-500 text-xs font-medium px-3 py-1.5 bg-neutral-100 rounded-full">
								+{product.benefits.length - 3} más
							</span>
						)}
					</div>
				</div>
			</Link>
		</motion.div>
	)
}