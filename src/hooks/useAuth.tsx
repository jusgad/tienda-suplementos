'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { AuthService, AuthUser, SignUpData, SignInData } from '@/lib/auth'

interface AuthContextType {
	user: AuthUser | null
	loading: boolean
	signUp: (userData: SignUpData) => Promise<void>
	confirmSignUp: (email: string, code: string) => Promise<void>
	signIn: (userData: SignInData) => Promise<void>
	signOut: () => Promise<void>
	forgotPassword: (email: string) => Promise<void>
	confirmPassword: (email: string, code: string, newPassword: string) => Promise<void>
	resendConfirmationCode: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		checkAuth()
	}, [])

	const checkAuth = async () => {
		try {
			const currentUser = await AuthService.getCurrentUser()
			setUser(currentUser)
		} catch (error) {
			console.error('Error checking auth:', error)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	const signUp = async (userData: SignUpData) => {
		try {
			await AuthService.signUp(userData)
		} catch (error) {
			console.error('Error signing up:', error)
			throw error
		}
	}

	const confirmSignUp = async (email: string, code: string) => {
		try {
			await AuthService.confirmSignUp(email, code)
		} catch (error) {
			console.error('Error confirming sign up:', error)
			throw error
		}
	}

	const signIn = async (userData: SignInData) => {
		try {
			await AuthService.signIn(userData)
			const currentUser = await AuthService.getCurrentUser()
			setUser(currentUser)
		} catch (error) {
			console.error('Error signing in:', error)
			throw error
		}
	}

	const signOut = async () => {
		try {
			await AuthService.signOut()
			setUser(null)
		} catch (error) {
			console.error('Error signing out:', error)
			throw error
		}
	}

	const forgotPassword = async (email: string) => {
		try {
			await AuthService.forgotPassword(email)
		} catch (error) {
			console.error('Error requesting password reset:', error)
			throw error
		}
	}

	const confirmPassword = async (email: string, code: string, newPassword: string) => {
		try {
			await AuthService.confirmPassword(email, code, newPassword)
		} catch (error) {
			console.error('Error confirming password:', error)
			throw error
		}
	}

	const resendConfirmationCode = async (email: string) => {
		try {
			await AuthService.resendConfirmationCode(email)
		} catch (error) {
			console.error('Error resending confirmation code:', error)
			throw error
		}
	}

	const value = {
		user,
		loading,
		signUp,
		confirmSignUp,
		signIn,
		signOut,
		forgotPassword,
		confirmPassword,
		resendConfirmationCode,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}