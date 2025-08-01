import { useEffect, useMemo, useState } from 'react'
import { TbCircleMinus } from 'react-icons/tb'
import { Link as LinkRouter } from 'react-router'
import { useQuery } from '../../../../shared/hooks'
import {
	DmcBtn,
	DmcItem,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
	DmcLoading,
	DmcMessage,
	DmcSelect,
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
	const {
		isLoading: isLoadingList,
		error: errorList,
		request: requestList,
	} = useQuery(requestAnalyticsGetQueries)
	const {
		isLoading: isLoadingRemove,
		error: errorRemove,
		request: requestRemove,
	} = useQuery(requestAnalyticsRemoveQuery)
	const isLoading = useMemo<boolean>(
		() => isLoadingList || isLoadingRemove,
		[isLoadingList, isLoadingRemove]
	)
	const error = useMemo<string>(
		() => errorList || errorRemove,
		[errorList, errorRemove]
	)

	const [list, setList] = useState([])
	const [size, setSize] = useState(15)
	const [number, setNumber] = useState(0)
	const [{ isNext, isPrev }, setState] = useState<{
		[key: string]: boolean
	}>({
		isNext: false,
		isPrev: false,
	})

	const fetchList = async () => {
		const res = await requestList({
			size,
			number,
		})
		setState({
			isNext: res.request.length >= size,
			isPrev: number > 1,
		})
		setList(res.request)
	}
	const handleRemove = async (event: React.MouseEvent, item) => {
		event?.stopPropagation()
		event?.preventDefault()
		if (!confirm(`Точно хотите удалмть "${item.name_query}"?`)) {
			return
		}
		await requestRemove(item.id)
		await fetchList()
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
			<DmcLoading active={isLoading} keepMounted>
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
				<DmcSelect
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
				</DmcSelect>
			</div>
		</div>
	)
}
