'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { CartItem, Product } from '@/types'

interface CartState {
	items: CartItem[]
	isOpen: boolean
	total: number
	itemCount: number
}

type CartAction = 
	| { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
	| { type: 'REMOVE_ITEM'; payload: { productId: string } }
	| { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
	| { type: 'CLEAR_CART' }
	| { type: 'TOGGLE_CART' }
	| { type: 'SET_CART_OPEN'; payload: boolean }
	| { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType extends CartState {
	addItem: (product: Product, quantity?: number) => void
	removeItem: (productId: string) => void
	updateQuantity: (productId: string, quantity: number) => void
	clearCart: () => void
	toggleCart: () => void
	setCartOpen: (open: boolean) => void
}

const initialState: CartState = {
	items: [],
	isOpen: false,
	total: 0,
	itemCount: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case 'ADD_ITEM': {
			const { product, quantity } = action.payload
			const existingItem = state.items.find(item => item.productId === product.id)

			let newItems: CartItem[]
			if (existingItem) {
				newItems = state.items.map(item =>
					item.productId === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				)
			} else {
				newItems = [
					...state.items,
					{
						productId: product.id,
						quantity,
						price: product.price,
						product,
					}
				]
			}

			const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
			const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

			return {
				...state,
				items: newItems,
				total,
				itemCount,
			}
		}

		case 'REMOVE_ITEM': {
			const newItems = state.items.filter(item => item.productId !== action.payload.productId)
			const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
			const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

			return {
				...state,
				items: newItems,
				total,
				itemCount,
			}
		}

		case 'UPDATE_QUANTITY': {
			const { productId, quantity } = action.payload
			if (quantity <= 0) {
				return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } })
			}

			const newItems = state.items.map(item =>
				item.productId === productId
					? { ...item, quantity }
					: item
			)

			const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
			const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

			return {
				...state,
				items: newItems,
				total,
				itemCount,
			}
		}

		case 'CLEAR_CART':
			return {
				...state,
				items: [],
				total: 0,
				itemCount: 0,
			}

		case 'TOGGLE_CART':
			return {
				...state,
				isOpen: !state.isOpen,
			}

		case 'SET_CART_OPEN':
			return {
				...state,
				isOpen: action.payload,
			}

		case 'LOAD_CART':
			const total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
			const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)

			return {
				...state,
				items: action.payload,
				total,
				itemCount,
			}

		default:
			return state
	}
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, initialState)

	// Load cart from localStorage on mount
	useEffect(() => {
		const savedCart = localStorage.getItem('wellness-cart')
		if (savedCart) {
			try {
				const cartItems = JSON.parse(savedCart)
				dispatch({ type: 'LOAD_CART', payload: cartItems })
			} catch (error) {
				console.error('Error loading cart from localStorage:', error)
			}
		}
	}, [])

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('wellness-cart', JSON.stringify(state.items))
	}, [state.items])

	const addItem = (product: Product, quantity = 1) => {
		dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
	}

	const removeItem = (productId: string) => {
		dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
	}

	const updateQuantity = (productId: string, quantity: number) => {
		dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
	}

	const clearCart = () => {
		dispatch({ type: 'CLEAR_CART' })
	}

	const toggleCart = () => {
		dispatch({ type: 'TOGGLE_CART' })
	}

	const setCartOpen = (open: boolean) => {
		dispatch({ type: 'SET_CART_OPEN', payload: open })
	}

	const value: CartContextType = {
		...state,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		toggleCart,
		setCartOpen,
	}

	return (
		<CartContext.Provider value={value}>
			{children}
		</CartContext.Provider>
	)
}

export function useCart() {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}