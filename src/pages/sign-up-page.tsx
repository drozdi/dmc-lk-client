import { Stack, Title } from '@mantine/core'
import { SignUpForm } from '../features/auth/sign-up-form'

export function SignUpPage() {
	return (
		<Stack>
			<Title ta='center' order={1}>
				Регистрация
			</Title>
			<SignUpForm />
		</Stack>
	)
}
