import { Button, Group, NavLink, Notification, Select } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Template } from '../../../layout/context'
import { useQuery } from '../../../shared/hooks'
import { Loading } from '../../../shared/ui'
import { requestGetUsers } from '../api'

interface UsersListProps {
	className?: string
}
export function UsersList({ className }: UsersListProps) {
	const navigate = useNavigate()
	const { isLoading, error, request } = useQuery(requestGetUsers, 'Ошибка при загрузке пользователей')
	const [list, setList] = useState<IUsersUser[]>([])
	const [size, setSize] = useState<number>(30)
	const [number, setNumber] = useState<number>(0)

	const fetchUsers = async () => {
		const res = await request({ size, number })
		setList(res.user.request)
	}

	useEffect(() => {
		fetchUsers()
	}, [number, size])

	return (
		<div className={className}>
			<Loading active={isLoading} keepMounted>
				{error && <Notification color='red'>{error}</Notification>}
				{list.map(item => (
					<NavLink
						onClick={event => {
							event.preventDefault()
							navigate(`/users/${item.id}`)
						}}
						href={`/users/${item.id}`}
						key={item.id}
						label={[item.last_name, item.first_name, item.father_name].join(' ')}
					/>
				))}
			</Loading>
			<Template slot='footer'>
				<Group>
					<Button disabled={number != 1}>Предыдущая</Button>
					<Button disabled={list.length < size}>Следующая</Button>
				</Group>
				<Select
					value={String(size)}
					onChange={value => {
						setNumber(0)
						setSize(value)
					}}
					data={['15', '30', '50', '75', '100']}
				/>
			</Template>
		</div>
	)
}
