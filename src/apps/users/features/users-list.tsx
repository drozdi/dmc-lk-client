import { Button, Group, NavLink, Notification, Paper, Select } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Template } from '../../../layout/context'
import { Loading } from '../../../shared/ui'
import { useFetchUsers } from '../api'

interface UsersListProps {
	className?: string
}
export function UsersList({ className }: UsersListProps) {
	const [list, setList] = useState<IUsersUser[]>([])
	const [size, setSize] = useState<number>(30)
	const [number, setNumber] = useState<number>(0)
	const navigate = useNavigate()
	const ff = useFetchUsers({ number, size })
	const { isLoading, error, data } = ff

	useEffect(() => {
		setList(data?.user?.request || [])
	}, [data])

	return (
		<Paper>
			<Loading active={isLoading} keepMounted>
				{list.map(item => (
					<NavLink
						component={Link}
						to={`/users/${item.id}`}
						key={item.id}
						label={[item.last_name, item.first_name, item.father_name].join(' ')}
					/>
				))}
			</Loading>

			<Template slot='notification'>{error && <Notification color='red'>{error}</Notification>}</Template>
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
		</Paper>
	)
}
