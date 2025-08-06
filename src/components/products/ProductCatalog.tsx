'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import ProductCard from './ProductCard'
import ProductFilters from './ProductFilters'
import { mockProducts, categories } from '@/lib/mockData'

export default function ProductCatalog() {
	const [selectedCategory, setSelectedCategory] = useState('Todas')
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
	const [sortBy, setSortBy] = useState('name')
	const [searchTerm, setSearchTerm] = useState('')

	const filteredAndSortedProducts = useMemo(() => {
		let filtered = mockProducts.filter((product) => {
			// Category filter
			const categoryMatch = selectedCategory === 'Todas' || product.category === selectedCategory
			
			// Price filter
			const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
			
			// Search filter
			const searchMatch = searchTerm === '' || 
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()))

			return categoryMatch && priceMatch && searchMatch
		})

		// Sorting
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name)
				case 'price-asc':
					return a.price - b.price
				case 'price-desc':
					return b.price - a.price
				case 'rating':
					return b.rating - a.rating
				case 'newest':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				default:
					return 0
			}
		})

		return filtered
	}, [selectedCategory, priceRange, sortBy, searchTerm])

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Header */}
			<div className="mb-8">
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-3xl font-bold text-neutral-800 mb-4"
				>
					Catálogo de Productos
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="text-lg text-neutral-600 mb-6"
				>
					Descubre nuestra selección de suplementos de alta calidad
				</motion.p>

				{/* Search Bar */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="relative max-w-md"
				>
					<input
						type="text"
						placeholder="Buscar productos..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full input-field pl-10"
					/>
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<svg
							className="h-5 w-5 text-neutral-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</motion.div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				{/* Filters Sidebar */}
				<div className="lg:col-span-1">
					<ProductFilters
						categories={categories}
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
						priceRange={priceRange}
						onPriceRangeChange={setPriceRange}
						sortBy={sortBy}
						onSortChange={setSortBy}
					/>
				</div>

				{/* Products Grid */}
				<div className="lg:col-span-3">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mb-4 flex justify-between items-center"
					>
						<p className="text-neutral-600">
							{filteredAndSortedProducts.length} productos encontrados
						</p>
					</motion.div>

					{filteredAndSortedProducts.length > 0 ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
						>
							{filteredAndSortedProducts.map((product, index) => (
								<motion.div
									key={product.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
								>
									<ProductCard product={product} />
								</motion.div>
							))}
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="text-center py-12"
						>
							<div className="text-6xl text-neutral-300 mb-4">🔍</div>
							<h3 className="text-xl font-semibold text-neutral-800 mb-2">
								No se encontraron productos
							</h3>
							<p className="text-neutral-600 mb-4">
								Intenta ajustar tus filtros o términos de búsqueda
							</p>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => {
									setSelectedCategory('Todas')
									setPriceRange([0, 200])
									setSearchTerm('')
									setSortBy('name')
								}}
								className="btn-primary"
							>
								Limpiar Filtros
							</motion.button>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	)
}