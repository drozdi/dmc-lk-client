import { Paper } from '@mantine/core'
import { Template } from '../../../layout'
import { UsersList } from '../features/users-list'
export function UsersPage() {
	return (
		<Paper>
			<Template.Title fz='h2' ta='center'>
				Пользователи
			</Template.Title>
			<UsersList />
		</Paper>
	)
}
