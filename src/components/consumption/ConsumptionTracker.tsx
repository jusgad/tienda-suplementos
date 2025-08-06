'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConsumption } from '@/hooks/useConsumption'
import { mockProducts } from '@/lib/mockData'
import { ConsumptionRecord } from '@/types'

export default function ConsumptionTracker() {
	const {
		records,
		addConsumptionRecord,
		updateConsumptionRecord,
		deleteConsumptionRecord,
		getActiveRecords,
		getProductsNeedingReplenishment,
		markAsReplenished
	} = useConsumption()

	const [showAddForm, setShowAddForm] = useState(false)
	const [selectedProductId, setSelectedProductId] = useState('')
	const [dailyDose, setDailyDose] = useState(1)
	const [totalQuantity, setTotalQuantity] = useState(30)

	const activeRecords = getActiveRecords()
	const needReplenishment = getProductsNeedingReplenishment()

	const getProduct = (productId: string) => {
		return mockProducts.find(p => p.id === productId)
	}

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date)
	}

	const getDaysRemaining = (record: ConsumptionRecord) => {
		if (record.dailyDose === 0) return 0
		return Math.floor(record.remainingQuantity / record.dailyDose)
	}

	const getProgressPercentage = (record: ConsumptionRecord) => {
		return Math.max(0, (record.remainingQuantity / record.totalQuantity) * 100)
	}

	const handleAddRecord = () => {
		if (selectedProductId && dailyDose > 0 && totalQuantity > 0) {
			addConsumptionRecord(selectedProductId, dailyDose, totalQuantity)
			setShowAddForm(false)
			setSelectedProductId('')
			setDailyDose(1)
			setTotalQuantity(30)
		}
	}

	const handleUpdateQuantity = (recordId: string, newQuantity: number) => {
		updateConsumptionRecord(recordId, Math.max(0, newQuantity))
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						Seguimiento de Consumo
					</h1>
					<p className="text-lg text-neutral-600">
						Controla el consumo de tus suplementos y recibe recordatorios de reposición
					</p>
				</div>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowAddForm(true)}
					className="btn-primary"
				>
					Agregar Suplemento
				</motion.button>
			</div>

			{/* Replenishment Alerts */}
			{needReplenishment.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-accent-orange/10 border border-accent-orange/20 rounded-lg p-4 mb-6"
				>
					<div className="flex items-center mb-3">
						<svg className="w-5 h-5 text-accent-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
						<h3 className="text-lg font-semibold text-accent-orange">
							Productos para Reponer ({needReplenishment.length})
						</h3>
					</div>
					<div className="space-y-2">
						{needReplenishment.map((record) => {
							const product = getProduct(record.productId)
							if (!product) return null

							return (
								<div key={record.id} className="flex items-center justify-between bg-white rounded p-3">
									<div>
										<p className="font-medium text-neutral-800">{product.name}</p>
										<p className="text-sm text-neutral-600">
											Quedan {getDaysRemaining(record)} días ({record.remainingQuantity} dosis)
										</p>
									</div>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => markAsReplenished(record.id, record.totalQuantity)}
										className="btn-secondary text-sm"
									>
										Marcar como Repuesto
									</motion.button>
								</div>
							)
						})}
					</div>
				</motion.div>
			)}

			{/* Active Records */}
			<div className="space-y-6">
				{activeRecords.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-6xl text-neutral-300 mb-4">📊</div>
						<h3 className="text-xl font-semibold text-neutral-800 mb-2">
							No hay suplementos en seguimiento
						</h3>
						<p className="text-neutral-600 mb-6">
							Agrega tus suplementos para comenzar a hacer seguimiento de tu consumo
						</p>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => setShowAddForm(true)}
							className="btn-primary"
						>
							Agregar Primer Suplemento
						</motion.button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{activeRecords.map((record) => {
							const product = getProduct(record.productId)
							if (!product) return null

							const daysRemaining = getDaysRemaining(record)
							const progressPercentage = getProgressPercentage(record)

							return (
								<motion.div
									key={record.id}
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									className="bg-white rounded-lg shadow-md p-6"
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-neutral-800 mb-1">
												{product.name}
											</h3>
											<p className="text-sm text-neutral-600">
												Iniciado: {formatDate(record.startDate)}
											</p>
										</div>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => deleteConsumptionRecord(record.id)}
											className="text-red-500 hover:text-red-700 transition-colors"
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</motion.button>
									</div>

									{/* Progress Bar */}
									<div className="mb-4">
										<div className="flex justify-between items-center mb-2">
											<span className="text-sm font-medium text-neutral-700">
												Progreso
											</span>
											<span className="text-sm text-neutral-600">
												{record.remainingQuantity} / {record.totalQuantity} dosis
											</span>
										</div>
										<div className="w-full bg-neutral-200 rounded-full h-2">
											<motion.div
												className={`h-2 rounded-full ${
													progressPercentage > 30 ? 'bg-secondary-500' :
													progressPercentage > 10 ? 'bg-accent-orange' : 'bg-red-500'
												}`}
												initial={{ width: 0 }}
												animate={{ width: `${progressPercentage}%` }}
												transition={{ duration: 0.5 }}
											/>
										</div>
									</div>

									{/* Stats */}
									<div className="grid grid-cols-2 gap-4 mb-4">
										<div className="text-center">
											<p className="text-2xl font-bold text-primary-600">
												{daysRemaining}
											</p>
											<p className="text-xs text-neutral-600">Días restantes</p>
										</div>
										<div className="text-center">
											<p className="text-2xl font-bold text-secondary-600">
												{record.dailyDose}
											</p>
											<p className="text-xs text-neutral-600">Dosis diaria</p>
										</div>
									</div>

									{/* Quick Actions */}
									<div className="flex space-x-2">
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => handleUpdateQuantity(record.id, record.remainingQuantity - record.dailyDose)}
											disabled={record.remainingQuantity < record.dailyDose}
											className="btn-primary text-sm flex-1 disabled:opacity-50"
										>
											Consumir Dosis
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => markAsReplenished(record.id, record.totalQuantity)}
											className="btn-secondary text-sm"
										>
											Reponer
										</motion.button>
									</div>

									{/* Replenishment Alert */}
									{record.replenishmentDate && new Date() >= record.replenishmentDate && (
										<div className="mt-3 p-2 bg-accent-orange/10 rounded text-sm text-accent-orange">
											⚠️ Es hora de reponer este suplemento
										</div>
									)}
								</motion.div>
							)
						})}
					</div>
				)}
			</div>

			{/* Add Form Modal */}
			<AnimatePresence>
				{showAddForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
						>
							<h2 className="text-xl font-semibold text-neutral-800 mb-4">
								Agregar Suplemento al Seguimiento
							</h2>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-neutral-700 mb-2">
										Producto
									</label>
									<select
										value={selectedProductId}
										onChange={(e) => setSelectedProductId(e.target.value)}
										className="input-field"
									>
										<option value="">Seleccionar producto</option>
										{mockProducts.map((product) => (
											<option key={product.id} value={product.id}>
												{product.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral-700 mb-2">
										Dosis Diaria
									</label>
									<input
										type="number"
										min="1"
										value={dailyDose}
										onChange={(e) => setDailyDose(parseInt(e.target.value) || 1)}
										className="input-field"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral-700 mb-2">
										Cantidad Total (dosis)
									</label>
									<input
										type="number"
										min="1"
										value={totalQuantity}
										onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 30)}
										className="input-field"
									/>
								</div>
							</div>

							<div className="flex justify-end space-x-3 mt-6">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setShowAddForm(false)}
									className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors"
								>
									Cancelar
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={handleAddRecord}
									disabled={!selectedProductId}
									className="btn-primary disabled:opacity-50"
								>
									Agregar
								</motion.button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	)
}