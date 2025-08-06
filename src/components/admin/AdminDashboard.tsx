'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { mockProducts } from '@/lib/mockData'
import ContentManager from './ContentManager'

type AdminView = 'dashboard' | 'products' | 'orders' | 'users' | 'content'

export default function AdminDashboard() {
	const [activeView, setActiveView] = useState<AdminView>('dashboard')

	// Mock data para el dashboard
	const dashboardStats = {
		totalOrders: 1234,
		totalRevenue: 45678.90,
		totalUsers: 892,
		totalProducts: mockProducts.length,
		recentOrders: [
			{ id: 'ORD-001', customer: 'María García', total: 89.99, status: 'pending' },
			{ id: 'ORD-002', customer: 'Juan Pérez', total: 156.50, status: 'processing' },
			{ id: 'ORD-003', customer: 'Ana López', total: 67.25, status: 'shipped' },
			{ id: 'ORD-004', customer: 'Carlos Ruiz', total: 234.80, status: 'delivered' },
		],
		lowStockProducts: mockProducts.filter(p => p.stock < 20)
	}

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'EUR'
		}).format(price)
	}

	const menuItems = [
		{ id: 'dashboard', label: 'Dashboard', icon: '📊' },
		{ id: 'content', label: 'Contenido Web', icon: '✨' },
		{ id: 'products', label: 'Productos', icon: '📦' },
		{ id: 'orders', label: 'Pedidos', icon: '🛒' },
		{ id: 'users', label: 'Usuarios', icon: '👥' },
	]

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending': return 'bg-yellow-100 text-yellow-800'
			case 'processing': return 'bg-blue-100 text-blue-800'
			case 'shipped': return 'bg-purple-100 text-purple-800'
			case 'delivered': return 'bg-green-100 text-green-800'
			case 'cancelled': return 'bg-red-100 text-red-800'
			default: return 'bg-gray-100 text-gray-800'
		}
	}

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'pending': return 'Pendiente'
			case 'processing': return 'Procesando'
			case 'shipped': return 'Enviado'
			case 'delivered': return 'Entregado'
			case 'cancelled': return 'Cancelado'
			default: return status
		}
	}

	const renderDashboard = () => (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white rounded-lg shadow-md p-6"
				>
					<div className="flex items-center">
						<div className="text-3xl mr-4">📈</div>
						<div>
							<p className="text-sm font-medium text-neutral-600">Ingresos Totales</p>
							<p className="text-2xl font-bold text-green-600">
								{formatPrice(dashboardStats.totalRevenue)}
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-white rounded-lg shadow-md p-6"
				>
					<div className="flex items-center">
						<div className="text-3xl mr-4">🛒</div>
						<div>
							<p className="text-sm font-medium text-neutral-600">Total Pedidos</p>
							<p className="text-2xl font-bold text-blue-600">
								{dashboardStats.totalOrders}
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-white rounded-lg shadow-md p-6"
				>
					<div className="flex items-center">
						<div className="text-3xl mr-4">👥</div>
						<div>
							<p className="text-sm font-medium text-neutral-600">Usuarios Registrados</p>
							<p className="text-2xl font-bold text-purple-600">
								{dashboardStats.totalUsers}
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-white rounded-lg shadow-md p-6"
				>
					<div className="flex items-center">
						<div className="text-3xl mr-4">📦</div>
						<div>
							<p className="text-sm font-medium text-neutral-600">Productos Activos</p>
							<p className="text-2xl font-bold text-orange-600">
								{dashboardStats.totalProducts}
							</p>
						</div>
					</div>
				</motion.div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Orders */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-white rounded-lg shadow-md p-6"
				>
					<h3 className="text-lg font-semibold text-neutral-800 mb-4">
						Pedidos Recientes
					</h3>
					<div className="space-y-3">
						{dashboardStats.recentOrders.map((order) => (
							<div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
								<div>
									<p className="font-medium text-neutral-800">{order.id}</p>
									<p className="text-sm text-neutral-600">{order.customer}</p>
								</div>
								<div className="text-right">
									<p className="font-semibold text-neutral-800">
										{formatPrice(order.total)}
									</p>
									<span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
										{getStatusLabel(order.status)}
									</span>
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Low Stock Alert */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.5 }}
					className="bg-white rounded-lg shadow-md p-6"
				>
					<h3 className="text-lg font-semibold text-neutral-800 mb-4">
						Stock Bajo ({dashboardStats.lowStockProducts.length})
					</h3>
					<div className="space-y-3">
						{dashboardStats.lowStockProducts.slice(0, 4).map((product) => (
							<div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
								<div>
									<p className="font-medium text-neutral-800">{product.name}</p>
									<p className="text-sm text-neutral-600">{product.category}</p>
								</div>
								<div className="text-right">
									<p className="font-semibold text-red-600">
										{product.stock} unidades
									</p>
									<p className="text-sm text-neutral-600">
										{formatPrice(product.price)}
									</p>
								</div>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	)

	const renderProducts = () => (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-neutral-800">Gestión de Productos</h2>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="btn-primary"
				>
					Agregar Producto
				</motion.button>
			</div>

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-neutral-200">
						<thead className="bg-neutral-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Producto
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Categoría
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Precio
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Stock
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Rating
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Acciones
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-neutral-200">
							{mockProducts.map((product) => (
								<tr key={product.id} className="hover:bg-neutral-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mr-3">
												<span className="text-blue-600 font-bold">
													{product.name.charAt(0)}
												</span>
											</div>
											<div>
												<div className="text-sm font-medium text-neutral-900">
													{product.name}
												</div>
												<div className="text-sm text-neutral-500">
													{product.reviewsCount} reseñas
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
										{product.category}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
										{formatPrice(product.price)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
											${product.stock > 20 ? 'bg-green-100 text-green-800' : 
											  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
											  'bg-red-100 text-red-800'}`}>
											{product.stock} unidades
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
										⭐ {product.rating}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
										<button className="text-blue-600 hover:text-blue-900">
											Editar
										</button>
										<button className="text-red-600 hover:text-red-900">
											Eliminar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)

	const renderOrders = () => (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-neutral-800">Gestión de Pedidos</h2>
				<div className="flex space-x-2">
					<select className="input-field max-w-xs">
						<option>Todos los estados</option>
						<option>Pendiente</option>
						<option>Procesando</option>
						<option>Enviado</option>
						<option>Entregado</option>
					</select>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-neutral-200">
						<thead className="bg-neutral-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Pedido
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Cliente
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Fecha
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Total
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Estado
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
									Acciones
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-neutral-200">
							{dashboardStats.recentOrders.map((order, index) => (
								<tr key={order.id} className="hover:bg-neutral-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
										{order.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
										{order.customer}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
										{new Date().toLocaleDateString('es-ES')}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
										{formatPrice(order.total)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
											{getStatusLabel(order.status)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
										<button className="text-blue-600 hover:text-blue-900">
											Ver
										</button>
										<button className="text-green-600 hover:text-green-900">
											Actualizar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)

	const renderUsers = () => (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-neutral-800">Gestión de Usuarios</h2>
				<div className="flex space-x-2">
					<input
						type="text"
						placeholder="Buscar usuarios..."
						className="input-field max-w-xs"
					/>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="text-center py-12">
					<div className="text-6xl text-neutral-300 mb-4">👥</div>
					<h3 className="text-xl font-semibold text-neutral-800 mb-2">
						Gestión de Usuarios
					</h3>
					<p className="text-neutral-600">
						Funcionalidad de gestión de usuarios en desarrollo
					</p>
				</div>
			</div>
		</div>
	)

	const renderContent = () => {
		switch (activeView) {
			case 'dashboard': return renderDashboard()
			case 'content': return <ContentManager />
			case 'products': return renderProducts()
			case 'orders': return renderOrders()
			case 'users': return renderUsers()
			default: return renderDashboard()
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
			<div className="flex">
				{/* Sidebar */}
				<div className="w-64 bg-white shadow-xl min-h-screen border-r border-primary-100">
					<div className="p-6 border-b border-primary-100 bg-gradient-to-r from-primary-500 to-secondary-500">
						<h1 className="text-2xl font-bold text-white">
							✨ Admin
						</h1>
						<p className="text-primary-100 text-sm mt-1">Siente-te bien</p>
					</div>
					<nav className="p-4 space-y-2">
						{menuItems.map((item) => (
							<motion.button
								key={item.id}
								whileHover={{ scale: 1.02, x: 4 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setActiveView(item.id as AdminView)}
								className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
									activeView === item.id
										? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium shadow-lg'
										: 'text-neutral-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700'
								}`}
							>
								<span className="mr-3 text-xl">{item.icon}</span>
								<span className="font-medium">{item.label}</span>
							</motion.button>
						))}
					</nav>
				</div>

				{/* Main Content */}
				<div className="flex-1 p-8">
					<motion.div
						key={activeView}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						{renderContent()}
					</motion.div>
				</div>
			</div>
		</div>
	)
}