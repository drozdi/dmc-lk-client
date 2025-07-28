import { UsersList } from '../features/users-list'

export function UsersPage() {
	return (
		<>
			<h2 className='text-2xl text-center'>Пользователи</h2>
			<UsersList className='mt-3' />
		</>
	)
}
