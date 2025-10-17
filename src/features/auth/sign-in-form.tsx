import { Box, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../shared/ui'
import { authStore } from '../../stores/auth-store'

export const SignInForm = observer(props => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const { isLoading } = authStore
	const navigate = useNavigate()
	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		const res = await authStore.login(email, password)
		if (true === res) {
			navigate('/')
		}
	}

	return (
		<Box {...props}>
			<Stack component='form' name='signIn' onSubmit={handleSubmit}>
				<Loading active={isLoading} keepMounted>
					<TextInput
						label='Email'
						placeholder='Email'
						name='email'
						type='email'
						autoComplete='email'
						required
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<PasswordInput
						label='Пароль'
						placeholder='Пароль'
						name='password'
						type='password'
						autoComplete='current-password'
						required
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</Loading>
				<Button type='submit' fullWidth loading={isLoading}>
					Войти
				</Button>
			</Stack>
		</Box>
	)
})
