import { Text } from '@mantine/core'
import { UsersList } from '../features/users-list'

export function UsersPage() {
	return (
		<>
			<Text fz='h2' ta='center'>
				Пользователи
			</Text>
			<UsersList />
		</>
	)
}
