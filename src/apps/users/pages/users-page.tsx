import { UsersList } from '../features/users-list'

export function UsersPage() {
	return (
		<>
			<h1 className='text-2xl text-center'>Пользователи</h1>
			<UsersList className='mt-3' />
		</>
	)
}
