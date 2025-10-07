import { Button, NavLink, Notification } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '../../../shared/hooks'
import { DmcSelect, Loading } from '../../../shared/ui'
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
						onClick={() => {
							navigate(`/users/${item.id}`)
						}}
						key={item.id}
						label={[item.last_name, item.first_name, item.father_name].join(' ')}
					/>
				))}
			</Loading>
			<div className='mt-3 flex justify-between items-start gap-3'>
				<div className='flex justify-start items-start gap-3'>
					<Button disabled={number != 1}>Предыдущая</Button>
					<Button disabled={list.length < size}>Следующая</Button>
				</div>
				<div>
					<DmcSelect
						dense
						filled
						value={size}
						onChange={({ target }) => {
							setNumber(0)
							setSize(target.value)
						}}
					>
						<option value='15'>15</option>
						<option value='30'>30</option>
						<option value='50'>50</option>
						<option value='75'>75</option>
						<option value='100'>100</option>
					</DmcSelect>
				</div>
			</div>
		</div>
	)
}
