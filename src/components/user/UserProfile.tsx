'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

export default function UserProfile() {
	const { user } = useAuth()
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		phone: user?.phone || '',
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSave = async () => {
		// TODO: Implement profile update functionality
		setIsEditing(false)
	}

	const handleCancel = () => {
		setFormData({
			firstName: user?.firstName || '',
			lastName: user?.lastName || '',
			phone: user?.phone || '',
		})
		setIsEditing(false)
	}

	if (!user) {
		return (
			<div className="max-w-2xl mx-auto p-6 text-center">
				<p className="text-neutral-600">Debes iniciar sesión para ver tu perfil.</p>
			</div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8"
		>
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-neutral-800">Mi Perfil</h1>
				{!isEditing && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setIsEditing(true)}
						className="btn-primary"
					>
						Editar Perfil
					</motion.button>
				)}
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-neutral-700 mb-2">
							Nombre
						</label>
						{isEditing ? (
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleInputChange}
								className="input-field"
							/>
						) : (
							<p className="text-neutral-800 bg-neutral-50 p-3 rounded-md">
								{user.firstName}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-neutral-700 mb-2">
							Apellido
						</label>
						{isEditing ? (
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleInputChange}
								className="input-field"
							/>
						) : (
							<p className="text-neutral-800 bg-neutral-50 p-3 rounded-md">
								{user.lastName}
							</p>
						)}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-2">
						Correo Electrónico
					</label>
					<p className="text-neutral-800 bg-neutral-50 p-3 rounded-md">
						{user.email}
					</p>
					<p className="text-sm text-neutral-500 mt-1">
						No puedes cambiar tu dirección de correo electrónico
					</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-neutral-700 mb-2">
						Teléfono
					</label>
					{isEditing ? (
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleInputChange}
							className="input-field"
							placeholder="Número de teléfono"
						/>
					) : (
						<p className="text-neutral-800 bg-neutral-50 p-3 rounded-md">
							{user.phone || 'No especificado'}
						</p>
					)}
				</div>

				{isEditing && (
					<div className="flex justify-end space-x-4 pt-4">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleCancel}
							className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors"
						>
							Cancelar
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleSave}
							className="btn-primary px-6 py-2"
						>
							Guardar Cambios
						</motion.button>
					</div>
				)}
			</div>

			{/* Additional Profile Sections */}
			<div className="mt-12 space-y-8">
				<div className="border-t border-neutral-200 pt-8">
					<h2 className="text-xl font-semibold text-neutral-800 mb-4">
						Preferencias de Bienestar
					</h2>
					<p className="text-neutral-600 mb-4">
						Completa tu perfil de bienestar para recibir recomendaciones personalizadas
					</p>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="btn-secondary"
					>
						Completar Cuestionario
					</motion.button>
				</div>

				<div className="border-t border-neutral-200 pt-8">
					<h2 className="text-xl font-semibold text-neutral-800 mb-4">
						Historial de Pedidos
					</h2>
					<p className="text-neutral-600 mb-4">
						Revisa tus compras anteriores y realiza seguimiento de tus pedidos
					</p>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="btn-secondary"
					>
						Ver Pedidos
					</motion.button>
				</div>

				<div className="border-t border-neutral-200 pt-8">
					<h2 className="text-xl font-semibold text-neutral-800 mb-4">
						Seguimiento de Consumo
					</h2>
					<p className="text-neutral-600 mb-4">
						Registra y monitorea el consumo de tus suplementos
					</p>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => window.location.href = '/seguimiento'}
						className="btn-secondary"
					>
						Gestionar Suplementos
					</motion.button>
				</div>
			</div>
		</motion.div>
	)
}