import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DmcBtn, DmcMessage, Input } from '../../../shared/ui'
import { authStore } from '../../stores/auth-store'

export const SignInForm = observer(() => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const { isLoading, error } = authStore
	const navigate = useNavigate()
	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		if (await authStore.login(email, password)) {
			navigate('/')
		}
	}

	return (
		<>
			{error && (
				<DmcMessage
					className='mb-8'
					color='warning'
					square
					underlined='left'
					label={error}
				/>
			)}
			<form name='signIn' className='mt-8 space-y-3' onSubmit={handleSubmit}>
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

				<DmcBtn type='submit' color='primary' block loading={isLoading}>
					Войти
				</DmcBtn>
			</form>
		</>
	)
})
