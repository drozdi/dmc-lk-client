import { observer } from 'mobx-react-lite'
import { TbLogin, TbLogout } from 'react-icons/tb'
import { Link } from '../../../layout/components/link'
import { authStore } from '../../../stores/auth-store'

export const InOutBtn = observer(() => {
	return (
		<div>
			{authStore.isAuthenticated ? (
				<Link to='/auth/sign-out' title='Выйти'>
					<TbLogout />
				</Link>
			) : (
				<Link to='/auth/sign-in' title='Войти'>
					<TbLogin />
				</Link>
			)}
		</div>
	)
})
