'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
	const { user, loading } = useAuth()

	useEffect(() => {
		// En un entorno real, aquí verificarías si el usuario tiene permisos de admin
		// Por ahora, cualquier usuario autenticado puede acceder
		if (!loading && !user) {
			window.location.href = '/login?redirect=/admin'
		}
	}, [user, loading])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-neutral-800 mb-2">
						Acceso Denegado
					</h1>
					<p className="text-neutral-600">
						Debes iniciar sesión para acceder al panel de administración.
					</p>
				</div>
			</div>
		)
	}

	return <AdminDashboard />
}