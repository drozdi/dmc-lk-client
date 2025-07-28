import { observer } from 'mobx-react-lite'
import { Navigate } from 'react-router'
import { authStore } from '../components/stores/auth-store'

export const SignOutPage = observer(() => {
	authStore.logout()
	return <Navigate to='/' />
})
