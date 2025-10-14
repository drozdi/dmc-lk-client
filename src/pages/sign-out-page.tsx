import { observer } from 'mobx-react-lite'
import { Navigate } from 'react-router-dom'
import { authStore } from '../stores/auth-store'
import { userStore } from '../stores/user-store'

export const SignOutPage = observer(() => {
	authStore.logout()
	userStore.reset()
	return <Navigate to='/' />
})
