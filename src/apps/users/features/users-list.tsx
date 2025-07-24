import { useEffect, useState } from 'react'
import { Link as LinkTo } from 'react-router'
import {
	DmcBtn,
	DmcLink,
	DmcLoading,
	DmcMessage,
	Select,
} from '../../../shared/ui'
import { listUsers } from '../api'

interface UsersListProps {
	className?: string
}
export function UsersList({ className }: UsersListProps) {
	const [list, setList] = useState<IUsersUser[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [size, setSize] = useState<number>(30)
	const [number, setNumber] = useState<number>(0)
	const [error, setError] = useState<Error | string | null>(null)

	const fetchUsers = async () => {
		setIsLoading(true)
		try {
			const res = await listUsers({ size, number })
			console.log(res)
			setList(res.user.request)
		} catch (error) {
			setError(error.message || 'Ошибка при загрузке пользователей')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [number, size])

	return (
		<div className={className}>
			<DmcLoading active={isLoading}>
				{error && (
					<DmcMessage
						className='mb-8'
						color='warning'
						square
						underlined='left'
						label={error}
					/>
				)}
				{list.map(item => (
					<DmcLink
						as={LinkTo}
						key={item.id}
						to={`/users/${item.id}`}
						label={[item.last_name, item.first_name, item.father_name].join(
							' '
						)}
					/>
				))}
			</DmcLoading>
			<div className='mt-3 flex justify-between items-start gap-3'>
				<div className='flex justify-start items-start gap-3'>
					<DmcBtn disabled={number != 1} color='secondary' size='sm'>
						Предыдущая
					</DmcBtn>
					<DmcBtn disabled={list.length < size} color='secondary' size='sm'>
						Следующая
					</DmcBtn>
				</div>
				<div>
					<Select
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
					</Select>
				</div>
			</div>
		</div>
	)
}
