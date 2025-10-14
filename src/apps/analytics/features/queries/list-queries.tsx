import { ActionIcon, Button, Group, Notification, Select, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { TbCircleMinus } from 'react-icons/tb'
import { Link as LinkRouter } from 'react-router-dom'
import { Template } from '../../../../layout/context'
import { useQuery } from '../../../../shared/hooks'
import { Item, ItemLabel, ItemSection, List, Loading } from '../../../../shared/ui'
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
		<Stack>
			<Template slot='notification'>{error && <Notification color='red'>{error}</Notification>}</Template>
			<Loading active={isLoading} keepMounted>
				<List separator bordered striped>
					{list.map(item => (
						<Item dense key={item.id} component={LinkRouter} to={`/analytics/query/${item.id}`} hoverable>
							<ItemSection row top>
								<ItemLabel>{item.name_query}</ItemLabel>
							</ItemSection>
							<ItemSection side>
								<ActionIcon color='red' title='Удалить' onClick={e => handleRemove(e, item)}>
									<TbCircleMinus />
								</ActionIcon>
							</ItemSection>
						</Item>
					))}
				</List>
			</Loading>

			<Group justify='end'>
				<Button onClick={() => navigate('/analytics/elastic')}>Добавить</Button>
			</Group>
			<Template slot='footer'>
				<Group>
					<Button disabled={!isPrev} loading={isLoading} onClick={() => elasticStore.setNumber(number - 1)}>
						Предыдущая
					</Button>
					<Button disabled={!isNext} loading={isLoading} onClick={() => elasticStore.setNumber(number + 1)}>
						Следующая
					</Button>
				</Group>
				<Select
					value={String(size)}
					onChange={({ target }) => elasticStore.setSize(target.value)}
					data={['15', '30', '50', '75', '100']}
				/>
			</Template>
		</Stack>
	)
})
