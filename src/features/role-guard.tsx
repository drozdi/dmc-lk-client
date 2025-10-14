import { Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useAuthStore } from '../stores/authStore'

export const RoleGuard = observer(({ children, requiredRole }) => {
	const authStore = useAuthStore()

	if (authStore.user?.role !== requiredRole) {
		return (
			<Text p='1rem' bg='red.4' c='red.9'>
				У вас недостаточно прав для доступа к этому разделу
			</Text>
		)
	}

	return children
})
