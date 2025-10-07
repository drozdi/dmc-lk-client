import { Stack, Text, Title } from '@mantine/core'
import { SignInForm } from '../features/auth/sign-in-form'

export function SignInPage() {
	return (
		<Stack>
			<Title ta='center' order={1}>
				Авторизуйтесь
			</Title>
			<SignInForm />
			<Text>Прямая регистрация новых пользователей закрыта. Обратитесь к админастратору.</Text>
		</Stack>
	)
}
