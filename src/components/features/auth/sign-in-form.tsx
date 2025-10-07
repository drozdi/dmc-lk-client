import { Button, Notification } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DmcInput, Loading } from '../../../shared/ui'
import { authStore } from '../../../stores/auth-store'

export const SignInForm = observer(() => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const { isLoading, error } = authStore
	const navigate = useNavigate()
	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		await authStore.login(email, password)
		navigate('/')
	}

	return (
		<>
			{error && <Notification color='red'>{error}</Notification>}
			<form name='signIn' className='mt-8 space-y-3' onSubmit={handleSubmit}>
				<Loading active={isLoading} keepMounted>
					<DmcInput
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
					<DmcInput
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
				</Loading>
				<Button type='submit' fullWidth loading={isLoading}>
					Войти
				</Button>
			</form>
		</>
	)
})
