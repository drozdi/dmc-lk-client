import { useEffect, useState } from 'react'
import { TbCircleMinus } from 'react-icons/tb'
import { Link as LinkRouter } from 'react-router'
import {
	DmcBtn,
	DmcItem,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
	DmcLoading,
	DmcMessage,
	Select,
} from '../../../../shared/ui'
import { cls } from '../../../../shared/utils'
import {
	requestAnalyticsGetQueries,
	requestAnalyticsRemoveQuery,
} from '../../api/queries'

interface ListQueriesProps {
	className?: string
}

export function ListQueries({ className }: ListQueriesProps) {
	const [list, setList] = useState([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>()

	const [size, setSize] = useState(15)
	const [number, setNumber] = useState(0)
	const [{ isNext, isPrev }, setState] = useState<{
		[key: string]: boolean
	}>({
		isNext: false,
		isPrev: false,
	})

	const fetchList = async () => {
		setIsLoading(true)
		setError('')
		try {
			const res = await requestAnalyticsGetQueries({
				size,
				number,
			})
			setState({
				isNext: res.request.length >= size,
				isPrev: number > 1,
			})
			setList(res.request)
		} catch (error) {
			setError(error.response?.data?.detail || error.message || 'Ошибка')
			setList([])
		} finally {
			setIsLoading(false)
		}
	}
	const handleRemove = async (event: React.MouseEvent, item) => {
		event?.stopPropagation()
		event?.preventDefault()
		if (!confirm(`Точно хотите удалмть "${item.name_query}"?`)) {
			return
		}
		setIsLoading(true)
		setError('')
		try {
			await requestAnalyticsRemoveQuery(item.id)
			await fetchList()
		} catch (error) {
			setError(error.response?.data?.detail || error.message || 'Ошибка')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchList()
	}, [size, number])

	return (
		<div className={cls(className, 'flex flex-col gap-3')}>
			{error && (
				<DmcMessage
					className='mb-8'
					color='warning'
					square
					underlined='left'
					label={error}
				/>
			)}
			<DmcLoading active={isLoading}>
				<DmcList separator>
					{list.map(item => (
						<DmcItem
							key={item.id}
							className='cursor-pointer'
							as={LinkRouter}
							to={`/analytics/query/${item.id}`}
							hoverable
						>
							<DmcItemSection>
								<DmcItemLabel>{item.name_query}</DmcItemLabel>
							</DmcItemSection>
							<DmcItemSection side>
								<DmcBtn
									color='warning'
									title='Удалить'
									onClick={e => handleRemove(e, item)}
								>
									<TbCircleMinus />
								</DmcBtn>
							</DmcItemSection>
						</DmcItem>
					))}
				</DmcList>
			</DmcLoading>
			<div className='flex justify-between items-center gap-3'>
				<div className='flex items-center gap-3'>
					<DmcBtn
						size='sm'
						color='secondary'
						disabled={!isPrev}
						loading={isLoading}
						onClick={() => setNumber(v => v - 1)}
					>
						Предыдущая
					</DmcBtn>
					<DmcBtn
						size='sm'
						color='secondary'
						disabled={!isNext}
						loading={isLoading}
						onClick={() => setNumber(v => v + 1)}
					>
						Следующая
					</DmcBtn>
				</div>
				<Select
					defaultValue={size}
					filled
					dense
					underlined
					onChange={({ target }) => setSize(target.value)}
				>
					<option value='15'>15</option>
					<option value='30'>30</option>
					<option value='50'>50</option>
					<option value='75'>75</option>
					<option value='100'>100</option>
				</Select>
			</div>
		</div>
	)
}
