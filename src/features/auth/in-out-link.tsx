import { ActionIcon } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbLogin, TbLogout } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../../stores/auth-store'

export const InOutLink = observer(() => {
	const navigate = useNavigate()
	return (
		<>
			{authStore.isAuthenticated ? (
				<ActionIcon
					variant='default'
					aria-label='Выйти'
					size='xl'
					radius='100%'
					onClick={() => navigate('/auth/sign-out')}
					title='Выйти'
				>
					<TbLogout />
				</ActionIcon>
			) : (
				<ActionIcon
					variant='default'
					aria-label='Войти'
					size='xl'
					radius='100%'
					onClick={() => navigate('/auth/sign-in')}
					title='Войти'
				>
					<TbLogin />
				</ActionIcon>
			)}
		</>
	)
})
