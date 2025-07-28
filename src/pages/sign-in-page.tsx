import { SignInForm } from '../components/features/auth/sign-in-form'
export function SignInPage() {
	return (
		<>
			<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
				Авторизуйтесь
			</h2>
			<SignInForm />
			<small>
				Прямая регистрация новых пользователей закрыта. Обратитесь к
				админастратору.
			</small>
		</>
	)
}
