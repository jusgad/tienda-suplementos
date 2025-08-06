'use client'

import { motion } from 'framer-motion'

interface ProductFiltersProps {
	categories: string[]
	selectedCategory: string
	onCategoryChange: (category: string) => void
	priceRange: [number, number]
	onPriceRangeChange: (range: [number, number]) => void
	sortBy: string
	onSortChange: (sort: string) => void
}

export default function ProductFilters({
	categories,
	selectedCategory,
	onCategoryChange,
	priceRange,
	onPriceRangeChange,
	sortBy,
	onSortChange,
}: ProductFiltersProps) {
	const sortOptions = [
		{ value: 'name', label: 'Nombre A-Z' },
		{ value: 'price-asc', label: 'Precio: Menor a Mayor' },
		{ value: 'price-desc', label: 'Precio: Mayor a Menor' },
		{ value: 'rating', label: 'Mejor Valorados' },
		{ value: 'newest', label: 'Más Recientes' },
	]

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="bg-white rounded-lg shadow-md p-6 space-y-6"
		>
			<div>
				<h3 className="text-lg font-semibold text-neutral-800 mb-4">
					Filtros
				</h3>
			</div>

			{/* Categories */}
			<div>
				<h4 className="text-sm font-medium text-neutral-700 mb-3">
					Categorías
				</h4>
				<div className="space-y-2">
					{categories.map((category) => (
						<motion.button
							key={category}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => onCategoryChange(category)}
							className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
								selectedCategory === category
									? 'bg-primary-100 text-primary-800 font-medium'
									: 'text-neutral-600 hover:bg-neutral-100'
							}`}
						>
							{category}
						</motion.button>
					))}
				</div>
			</div>

			{/* Price Range */}
			<div>
				<h4 className="text-sm font-medium text-neutral-700 mb-3">
					Rango de Precio
				</h4>
				<div className="space-y-3">
					<div className="flex items-center space-x-2">
						<input
							type="range"
							min="0"
							max="200"
							value={priceRange[0]}
							onChange={(e) =>
								onPriceRangeChange([parseInt(e.target.value), priceRange[1]])
							}
							className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<input
							type="range"
							min="0"
							max="200"
							value={priceRange[1]}
							onChange={(e) =>
								onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
							}
							className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
						/>
					</div>
					<div className="flex justify-between text-sm text-neutral-600">
						<span>€{priceRange[0]}</span>
						<span>€{priceRange[1]}</span>
					</div>
				</div>
			</div>

			{/* Sort Options */}
			<div>
				<h4 className="text-sm font-medium text-neutral-700 mb-3">
					Ordenar por
				</h4>
				<select
					value={sortBy}
					onChange={(e) => onSortChange(e.target.value)}
					className="w-full input-field text-sm"
				>
					{sortOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			{/* Clear Filters */}
			<motion.button
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onClick={() => {
					onCategoryChange('Todas')
					onPriceRangeChange([0, 200])
					onSortChange('name')
				}}
				className="w-full px-4 py-2 text-sm text-neutral-600 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
			>
				Limpiar Filtros
			</motion.button>
		</motion.div>
	)
}