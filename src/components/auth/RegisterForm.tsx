'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterForm() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [showConfirmation, setShowConfirmation] = useState(false)
	const [confirmationCode, setConfirmationCode] = useState('')

	const { signUp, confirmSignUp, resendConfirmationCode } = useAuth()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (formData.password !== formData.confirmPassword) {
			setError('Las contraseñas no coinciden')
			return
		}

		if (formData.password.length < 8) {
			setError('La contraseña debe tener al menos 8 caracteres')
			return
		}

		setLoading(true)

		try {
			await signUp({
				email: formData.email,
				password: formData.password,
				firstName: formData.firstName,
				lastName: formData.lastName,
				phone: formData.phone || undefined,
			})
			setShowConfirmation(true)
		} catch (error: any) {
			setError(error.message || 'Error al registrar usuario')
		} finally {
			setLoading(false)
		}
	}

	const handleConfirmation = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			await confirmSignUp(formData.email, confirmationCode)
			// Redirect to login or dashboard
		} catch (error: any) {
			setError(error.message || 'Error al confirmar el registro')
		} finally {
			setLoading(false)
		}
	}

	const handleResendCode = async () => {
		try {
			await resendConfirmationCode(formData.email)
			setError('')
		} catch (error: any) {
			setError(error.message || 'Error al reenviar código')
		}
	}

	if (showConfirmation) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						Confirma tu Registro
					</h1>
					<p className="text-neutral-600">
						Hemos enviado un código de confirmación a {formData.email}
					</p>
				</div>

				{error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
					>
						{error}
					</motion.div>
				)}

				<form onSubmit={handleConfirmation} className="space-y-6">
					<div>
						<label htmlFor="confirmationCode" className="block text-sm font-medium text-neutral-700 mb-2">
							Código de Confirmación
						</label>
						<input
							type="text"
							id="confirmationCode"
							value={confirmationCode}
							onChange={(e) => setConfirmationCode(e.target.value)}
							className="input-field"
							placeholder="123456"
							required
						/>
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
						disabled={loading}
						className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50"
					>
						{loading ? (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
								Confirmando...
							</div>
						) : (
							'Confirmar Registro'
						)}
					</motion.button>
				</form>

				<div className="mt-6 text-center">
					<button
						onClick={handleResendCode}
						className="text-primary-600 hover:text-primary-500 text-sm transition-colors"
					>
						¿No recibiste el código? Reenviar
					</button>
				</div>
			</motion.div>
		)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
		>
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-neutral-800 mb-2">
					Crear Cuenta
				</h1>
				<p className="text-neutral-600">
					Únete a nuestra comunidad de bienestar
				</p>
			</div>

			{error && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6"
				>
					{error}
				</motion.div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
							Nombre
						</label>
						<input
							type="text"
							id="firstName"
							name="firstName"
							value={formData.firstName}
							onChange={handleInputChange}
							className="input-field"
							required
						/>
					</div>
					<div>
						<label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
							Apellido
						</label>
						<input
							type="text"
							id="lastName"
							name="lastName"
							value={formData.lastName}
							onChange={handleInputChange}
							className="input-field"
							required
						/>
					</div>
				</div>

				<div>
					<label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
						Correo Electrónico
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						className="input-field"
						placeholder="tu@email.com"
						required
					/>
				</div>

				<div>
					<label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
						Teléfono (Opcional)
					</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						value={formData.phone}
						onChange={handleInputChange}
						className="input-field"
						placeholder="+1234567890"
					/>
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
						Contraseña
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						className="input-field"
						placeholder="••••••••"
						required
					/>
				</div>

				<div>
					<label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
						Confirmar Contraseña
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleInputChange}
						className="input-field"
						placeholder="••••••••"
						required
					/>
				</div>

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type="submit"
					disabled={loading}
					className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50"
				>
					{loading ? (
						<div className="flex items-center justify-center">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
							Registrando...
						</div>
					) : (
						'Crear Cuenta'
					)}
				</motion.button>
			</form>

			<div className="mt-8 text-center">
				<p className="text-neutral-600">
					¿Ya tienes cuenta?{' '}
					<Link
						href="/login"
						className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
					>
						Inicia sesión aquí
					</Link>
				</p>
			</div>
		</motion.div>
	)
}