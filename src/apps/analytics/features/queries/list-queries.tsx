import { ActionIcon, Button, Group, Notification, Select, Stack, Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { TbCircleMinus } from 'react-icons/tb'
import { Link as LinkRouter } from 'react-router-dom'
import { Template } from '../../../../layout/context'
import { useQuery, useQueryError, useQueryLoading } from '../../../../shared/hooks'
import { Item, ItemLabel, ItemSection, List, Loading } from '../../../../shared/ui'
import { useFetchQueries } from '../../api/hooks/queries'
import { requestAnalyticsQueriesDelete } from '../../api/queries'

interface ListQueriesProps {
	className?: string
}

export const ListQueries = observer(({ className }: ListQueriesProps) => {
	const [size, setSize] = useState('100')
	const listQueries = useFetchQueries(Number(size))
	const {
		data,
		hasPreviousPage,
		hasNextPage,
		isFetchingPreviousPage,
		isFetchingNextPage,
		fetchNextPage,
		fetchPreviousPage,
	} = listQueries

	const removeQuery = useQuery(requestAnalyticsQueriesDelete)
	const { request: requestRemove } = removeQuery

	const isLoading = useQueryLoading(listQueries, removeQuery)
	const error = useQueryError(listQueries, removeQuery)

	const handleRemove = async (event: React.MouseEvent, item) => {
		event?.stopPropagation()
		event?.preventDefault()
		if (!confirm(`Точно хотите удалить "${item.name_query}"?`)) {
			return
		}
		await requestRemove(item.id)
	}

	return (
		<Stack className={className}>
			<Template slot='notification'>{error && <Notification color='red'>{error}</Notification>}</Template>
			<Loading active={isLoading} keepMounted>
				<List separator>
					{data?.length > 0 ? (
						data.map(item => (
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
						))
					) : (
						<Text fz='h2' ta='center' c='dimmed'>
							Запросов не существует
						</Text>
					)}
				</List>
			</Loading>

			<Group justify='end'>
				<Button component={LinkRouter} to='/analytics/elastic'>
					Добавить
				</Button>
			</Group>
			<Template slot='footer'>
				<Group>
					<Button disabled={!hasPreviousPage} loading={isFetchingPreviousPage} onClick={fetchPreviousPage}>
						Предыдущая
					</Button>
					<Button disabled={!hasNextPage} loading={isFetchingNextPage} onClick={fetchNextPage}>
						Следующая
					</Button>
				</Group>
				<Select value={String(size)} onChange={setSize} data={['15', '30', '50', '75', '100']} />
			</Template>
		</Stack>
	)
})
