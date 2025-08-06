import {
	CognitoUserPool,
	CognitoUser,
	AuthenticationDetails,
	CognitoUserAttribute,
	CognitoUserSession,
	ISignUpResult
} from 'amazon-cognito-identity-js'

const poolData = {
	UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
	ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID!,
}

const userPool = new CognitoUserPool(poolData)

export interface AuthUser {
	id: string
	email: string
	firstName: string
	lastName: string
	phone?: string
}

export interface SignUpData {
	email: string
	password: string
	firstName: string
	lastName: string
	phone?: string
}

export interface SignInData {
	email: string
	password: string
}

export class AuthService {
	static async signUp(userData: SignUpData): Promise<ISignUpResult> {
		const { email, password, firstName, lastName, phone } = userData

		const attributeList = [
			new CognitoUserAttribute({
				Name: 'email',
				Value: email,
			}),
			new CognitoUserAttribute({
				Name: 'given_name',
				Value: firstName,
			}),
			new CognitoUserAttribute({
				Name: 'family_name',
				Value: lastName,
			}),
		]

		if (phone) {
			attributeList.push(
				new CognitoUserAttribute({
					Name: 'phone_number',
					Value: phone,
				})
			)
		}

		return new Promise((resolve, reject) => {
			userPool.signUp(email, password, attributeList, [], (err, result) => {
				if (err) {
					reject(err)
					return
				}
				resolve(result!)
			})
		})
	}

	static async confirmSignUp(email: string, confirmationCode: string): Promise<any> {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})

		return new Promise((resolve, reject) => {
			cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
				if (err) {
					reject(err)
					return
				}
				resolve(result)
			})
		})
	}

	static async signIn(userData: SignInData): Promise<CognitoUserSession> {
		const { email, password } = userData

		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password,
		})

		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})

		return new Promise((resolve, reject) => {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: (session) => {
					resolve(session)
				},
				onFailure: (err) => {
					reject(err)
				},
				newPasswordRequired: (userAttributes, requiredAttributes) => {
					reject(new Error('New password required'))
				},
			})
		})
	}

	static async signOut(): Promise<void> {
		const cognitoUser = userPool.getCurrentUser()
		if (cognitoUser) {
			cognitoUser.signOut()
		}
	}

	static async getCurrentUser(): Promise<AuthUser | null> {
		const cognitoUser = userPool.getCurrentUser()

		if (!cognitoUser) {
			return null
		}

		return new Promise((resolve, reject) => {
			cognitoUser.getSession((err: any, session: CognitoUserSession | null) => {
				if (err || !session || !session.isValid()) {
					resolve(null)
					return
				}

				cognitoUser.getUserAttributes((err, attributes) => {
					if (err) {
						reject(err)
						return
					}

					const userAttributes: { [key: string]: string } = {}
					attributes?.forEach((attr) => {
						userAttributes[attr.getName()] = attr.getValue()
					})

					const user: AuthUser = {
						id: cognitoUser.getUsername(),
						email: userAttributes.email,
						firstName: userAttributes.given_name || '',
						lastName: userAttributes.family_name || '',
						phone: userAttributes.phone_number,
					}

					resolve(user)
				})
			})
		})
	}

	static async getIdToken(): Promise<string | null> {
		const cognitoUser = userPool.getCurrentUser()

		if (!cognitoUser) {
			return null
		}

		return new Promise((resolve, reject) => {
			cognitoUser.getSession((err: any, session: CognitoUserSession | null) => {
				if (err || !session || !session.isValid()) {
					resolve(null)
					return
				}

				resolve(session.getIdToken().getJwtToken())
			})
		})
	}

	static async resendConfirmationCode(email: string): Promise<any> {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})

		return new Promise((resolve, reject) => {
			cognitoUser.resendConfirmationCode((err, result) => {
				if (err) {
					reject(err)
					return
				}
				resolve(result)
			})
		})
	}

	static async forgotPassword(email: string): Promise<any> {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})

		return new Promise((resolve, reject) => {
			cognitoUser.forgotPassword({
				onSuccess: resolve,
				onFailure: reject,
			})
		})
	}

	static async confirmPassword(
		email: string,
		confirmationCode: string,
		newPassword: string
	): Promise<any> {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})

		return new Promise((resolve, reject) => {
			cognitoUser.confirmPassword(confirmationCode, newPassword, {
				onSuccess: resolve,
				onFailure: reject,
			})
		})
	}
}