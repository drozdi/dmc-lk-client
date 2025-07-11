import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, Input } from '../../shared/ui'

export function SignInForm() {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const navigate = useNavigate()
	const handleSubmit = async e => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			// Здесь должна быть логика авторизации
			// Например, вызов API
			// await authService.login(email, password);
			navigate('/')
		} catch (err) {
			setError(err.message || 'Произошла ошибка при авторизации')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			{error && (
				<div className='bg-red-50 border-l-4 border-red-500 p-4'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<svg
								className='h-5 w-5 text-red-500'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
						<div className='ml-3'>
							<p className='text-sm text-red-700'>{error}</p>
						</div>
					</div>
				</div>
			)}
			<form className='mt-8 space-y-3' onSubmit={handleSubmit}>
				<input type='hidden' name='remember' value='true' />
				<Input
					label='Email'
					placeholder='Email'
					id='email-address'
					name='email'
					type='email'
					autoComplete='email'
					required
					stackLabel
					filled
					underlined
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<Input
					label='Пароль'
					placeholder='Пароль'
					id='email-address'
					name='password'
					type='password'
					autoComplete='current-password'
					required
					stackLabel
					filled
					underlined
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>

				<Btn type='submit' color='primary' block loading={isLoading}>
					Войти
				</Btn>
			</form>
		</>
	)
}
