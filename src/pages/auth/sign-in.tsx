import { SignInForm } from '../../features/auth/sign-in-form'
export function SignInPage() {
	return (
		<div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-3'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Авторизуйтесь
					</h2>
				</div>
				<SignInForm />
				<small>
					Прямая регистрация новых пользователей закрыта. Обратитесь к
					админастратору.
				</small>
			</div>
		</div>
	)
}
