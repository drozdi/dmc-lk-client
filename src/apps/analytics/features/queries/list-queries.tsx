import { ActionIcon, Button, Notification, Select } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { TbCircleMinus } from 'react-icons/tb'
import { Link as LinkRouter } from 'react-router'
import { useQuery } from '../../../../shared/hooks'
import { DmcItem, DmcItemLabel, DmcItemSection, DmcList, Loading } from '../../../../shared/ui'
import { cls } from '../../../../shared/utils'
import { requestAnalyticsRemoveQuery } from '../../api/queries'
import { elasticStore } from '../../stores/elastic-store'

interface ListQueriesProps {
	className?: string
}

export const ListQueries = observer(({ className }: ListQueriesProps) => {
	const { list, isLoading: isLoadingList, error: errorList, state, size, number } = elasticStore
	const { isNext = false, isPrev = false } = state
	const {
		isLoading: isLoadingRemove,
		error: errorRemove,
		request: requestRemove,
	} = useQuery(requestAnalyticsRemoveQuery)
	const isLoading = useMemo<boolean>(() => isLoadingList || isLoadingRemove, [isLoadingList, isLoadingRemove])
	const error = useMemo<string>(() => errorList || errorRemove, [errorList, errorRemove])

	const handleRemove = async (event: React.MouseEvent, item) => {
		event?.stopPropagation()
		event?.preventDefault()
		if (!confirm(`Точно хотите удалмть "${item.name_query}"?`)) {
			return
		}
		await requestRemove(item.id)
		await elasticStore.loadList(true)
	}

	return (
		<div className={cls(className, 'flex flex-col gap-3')}>
			{error && <Notification color='red'>{error}</Notification>}
			<Loading active={isLoading} keepMounted>
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
								<ActionIcon color='red' title='Удалить' onClick={e => handleRemove(e, item)}>
									<TbCircleMinus />
								</ActionIcon>
							</DmcItemSection>
						</DmcItem>
					))}
				</DmcList>
			</Loading>
			<div className='flex justify-between items-center gap-3'>
				<div className='flex items-center gap-3'>
					<Button disabled={!isPrev} loading={isLoading} onClick={() => elasticStore.setNumber(number - 1)}>
						Предыдущая
					</Button>
					<Button disabled={!isNext} loading={isLoading} onClick={() => elasticStore.setNumber(number + 1)}>
						Следующая
					</Button>
				</div>
				<Select
					value={size}
					onChange={({ target }) => elasticStore.setSize(target.value)}
					data={['15', '30', '50', '75', '100']}
				/>
			</div>
		</div>
	)
})
