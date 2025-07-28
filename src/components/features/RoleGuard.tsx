import { observer } from 'mobx-react-lite'
import { useAuthStore } from '../stores/authStore'

export const RoleGuard = observer(({ children, requiredRole }) => {
	const authStore = useAuthStore()

	if (authStore.user?.role !== requiredRole) {
		return (
			<div className='p-4 bg-red-100 text-red-700'>
				У вас недостаточно прав для доступа к этому разделу
			</div>
		)
	}

	return children
})
