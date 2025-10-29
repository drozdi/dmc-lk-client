import { Paper } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { TemplateTitle } from '../../../layout'
import { UserForm } from '../features/user-form'

export function UserPage() {
	const { userId } = useParams()
	return (
		<Paper>
			<TemplateTitle>Пользователь</TemplateTitle>
			<UserForm id={userId} />
		</Paper>
	)
}
