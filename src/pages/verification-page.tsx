import { Stack, Title } from '@mantine/core'
import { VerificationForm } from '../features/auth/verification-form'

export function VerificationPage() {
	return (
		<Stack>
			<Title ta='center' order={1}>
				Проверка
			</Title>
			<VerificationForm />
		</Stack>
	)
}
