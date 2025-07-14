import { SignUpForm } from '../../features/auth/sign-up-form'
export function SignUpPage() {
	return (
		<>
			<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
				Регистрация
			</h2>
			<SignUpForm />
		</>
	)
}
