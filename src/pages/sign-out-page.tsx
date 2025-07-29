import { observer } from 'mobx-react-lite'
import { Navigate } from 'react-router'
import { authStore } from '../components/stores/auth-store'
import { userStore } from '../components/stores/user-store'

export const SignOutPage = observer(() => {
	authStore.logout()
	userStore.reset()
	return <Navigate to='/' />
})
