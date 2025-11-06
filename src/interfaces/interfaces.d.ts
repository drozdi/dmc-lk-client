interface IResponse<T extends any> {
	success: boolean
	message: string | null | T
	data?: T
	response?: T
}

interface IUser {
	first_name: string
	last_name: string
	father_name: string
	email: string
	phone: string
}
interface IUserPassword extends IUser {
	password: string
}

interface AppRouterProps {
	path?: string
	children?: React.ReactNode
	render?: () => React.ReactNode
	routes?: any
	element?: any
}
