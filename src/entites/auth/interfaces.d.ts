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
