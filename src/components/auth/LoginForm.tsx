'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const { signIn } = useAuth()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			await signIn({ email, password })
		} catch (error: any) {
			setError(error.message || 'Error al iniciar sesión')
		} finally {
			setLoading(false)
		}
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
					Iniciar Sesión
				</h1>
				<p className="text-neutral-600">
					Accede a tu cuenta de bienestar personal
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
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
						Correo Electrónico
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="input-field"
						placeholder="tu@email.com"
						required
					/>
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
						Contraseña
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="input-field"
						placeholder="••••••••"
						required
					/>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
						/>
						<label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600">
							Recordarme
						</label>
					</div>

					<Link
						href="/forgot-password"
						className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
					>
						¿Olvidaste tu contraseña?
					</Link>
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
							Iniciando...
						</div>
					) : (
						'Iniciar Sesión'
					)}
				</motion.button>
			</form>

			<div className="mt-8 text-center">
				<p className="text-neutral-600">
					¿No tienes cuenta?{' '}
					<Link
						href="/register"
						className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
					>
						Regístrate aquí
					</Link>
				</p>
			</div>
		</motion.div>
	)
}