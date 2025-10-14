import { useParams } from 'react-router-dom'
import { UserForm } from '../features/user-form'

export function UserPage() {
	const { userId } = useParams()
	return <UserForm id={userId} />
}
