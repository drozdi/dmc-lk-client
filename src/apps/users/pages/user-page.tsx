import { Paper } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { Template } from '../../../layout'
import { UserForm } from '../features/user-form'

export function UserPage() {
	const { userId } = useParams()
	return (
		<Paper>
			<Template.Title>Пользователь</Template.Title>
			<UserForm id={userId} />
		</Paper>
	)
}
