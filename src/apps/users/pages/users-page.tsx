import { Paper } from '@mantine/core'
import { TemplateTitle } from '@t'
import { UsersList } from '../features/users-list'
export function UsersPage() {
	return (
		<Paper>
			<TemplateTitle fz='h2' ta='center'>
				Пользователи
			</TemplateTitle>
			<UsersList />
		</Paper>
	)
}
