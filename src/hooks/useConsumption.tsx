'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ConsumptionRecord, Product } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { mockProducts } from '@/lib/mockData'

interface ConsumptionContextType {
	records: ConsumptionRecord[]
	addConsumptionRecord: (productId: string, dailyDose: number, totalQuantity: number) => void
	updateConsumptionRecord: (recordId: string, remainingQuantity: number) => void
	deleteConsumptionRecord: (recordId: string) => void
	getActiveRecords: () => ConsumptionRecord[]
	getProductsNeedingReplenishment: () => ConsumptionRecord[]
	markAsReplenished: (recordId: string, newQuantity: number) => void
}

const ConsumptionContext = createContext<ConsumptionContextType | undefined>(undefined)

export function ConsumptionProvider({ children }: { children: ReactNode }) {
	const [records, setRecords] = useState<ConsumptionRecord[]>([])
	const { user } = useAuth()

	// Load consumption records from localStorage
	useEffect(() => {
		if (user) {
			const savedRecords = localStorage.getItem(`consumption-${user.id}`)
			if (savedRecords) {
				try {
					const parsedRecords = JSON.parse(savedRecords)
					setRecords(parsedRecords.map((record: any) => ({
						...record,
						startDate: new Date(record.startDate),
						endDate: record.endDate ? new Date(record.endDate) : undefined,
						replenishmentDate: record.replenishmentDate ? new Date(record.replenishmentDate) : undefined,
					})))
				} catch (error) {
					console.error('Error loading consumption records:', error)
				}
			}
		}
	}, [user])

	// Save consumption records to localStorage
	useEffect(() => {
		if (user && records.length > 0) {
			localStorage.setItem(`consumption-${user.id}`, JSON.stringify(records))
		}
	}, [records, user])

	const addConsumptionRecord = (productId: string, dailyDose: number, totalQuantity: number) => {
		if (!user) return

		const newRecord: ConsumptionRecord = {
			id: `record_${Date.now()}`,
			userId: user.id,
			productId,
			startDate: new Date(),
			dailyDose,
			totalQuantity,
			remainingQuantity: totalQuantity,
			isActive: true,
		}

		// Calculate estimated replenishment date
		const daysToLastDose = Math.floor(totalQuantity / dailyDose)
		const replenishmentDate = new Date()
		replenishmentDate.setDate(replenishmentDate.getDate() + daysToLastDose - 3) // 3 days before running out

		if (daysToLastDose > 3) {
			newRecord.replenishmentDate = replenishmentDate
		}

		setRecords(prev => [...prev, newRecord])
	}

	const updateConsumptionRecord = (recordId: string, remainingQuantity: number) => {
		setRecords(prev => prev.map(record => {
			if (record.id === recordId) {
				const updated = { ...record, remainingQuantity }
				
				// If quantity is 0 or less, mark as inactive
				if (remainingQuantity <= 0) {
					updated.isActive = false
					updated.endDate = new Date()
				}

				// Update replenishment date if needed
				if (remainingQuantity > 0 && record.dailyDose > 0) {
					const daysRemaining = Math.floor(remainingQuantity / record.dailyDose)
					if (daysRemaining > 3) {
						const newReplenishmentDate = new Date()
						newReplenishmentDate.setDate(newReplenishmentDate.getDate() + daysRemaining - 3)
						updated.replenishmentDate = newReplenishmentDate
					}
				}

				return updated
			}
			return record
		}))
	}

	const deleteConsumptionRecord = (recordId: string) => {
		setRecords(prev => prev.filter(record => record.id !== recordId))
	}

	const getActiveRecords = () => {
		return records.filter(record => record.isActive)
	}

	const getProductsNeedingReplenishment = useCallback(() => {
		const today = new Date()
		return records.filter(record => 
			record.isActive && 
			record.replenishmentDate && 
			record.replenishmentDate <= today
		)
	}, [records])

	// Función para enviar notificaciones de reposición
	const sendReplenishmentNotifications = useCallback(async () => {
		if (!user) return

		const needingReplenishment = getProductsNeedingReplenishment()
		
		for (const record of needingReplenishment) {
			const product = mockProducts.find(p => p.id === record.productId)
			if (!product) continue

			const daysRemaining = Math.floor(record.remainingQuantity / record.dailyDose)

			try {
				await fetch('/api/notifications/send', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						type: 'replenishment',
						data: {
							userId: user.id,
							productName: product.name,
							daysRemaining,
							email: user.email,
							productUrl: `/productos/${product.id}`
						}
					})
				})
			} catch (error) {
				console.error('Error sending replenishment notification:', error)
			}
		}
	}, [user, getProductsNeedingReplenishment])

	const markAsReplenished = (recordId: string, newQuantity: number) => {
		setRecords(prev => prev.map(record => {
			if (record.id === recordId) {
				const updated = { ...record }
				updated.remainingQuantity = newQuantity
				updated.totalQuantity = newQuantity
				
				// Reset replenishment date
				if (record.dailyDose > 0) {
					const daysToLastDose = Math.floor(newQuantity / record.dailyDose)
					if (daysToLastDose > 3) {
						const replenishmentDate = new Date()
						replenishmentDate.setDate(replenishmentDate.getDate() + daysToLastDose - 3)
						updated.replenishmentDate = replenishmentDate
					}
				}

				return updated
			}
			return record
		}))
	}

	// Verificar automáticamente notificaciones cada hora
	useEffect(() => {
		if (user) {
			const interval = setInterval(() => {
				sendReplenishmentNotifications()
			}, 60 * 60 * 1000) // Cada hora

			// Verificar inmediatamente al cargar
			sendReplenishmentNotifications()

			return () => clearInterval(interval)
		}
	}, [user, records, sendReplenishmentNotifications])

	const value: ConsumptionContextType = {
		records,
		addConsumptionRecord,
		updateConsumptionRecord,
		deleteConsumptionRecord,
		getActiveRecords,
		getProductsNeedingReplenishment,
		markAsReplenished,
	}

	return (
		<ConsumptionContext.Provider value={value}>
			{children}
		</ConsumptionContext.Provider>
	)
}

export function useConsumption() {
	const context = useContext(ConsumptionContext)
	if (context === undefined) {
		throw new Error('useConsumption must be used within a ConsumptionProvider')
	}
	return context
}