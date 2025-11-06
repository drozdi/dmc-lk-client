import { ActionIcon, Button, Group, Notification, Select, Stack, Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { TbCircleMinus } from 'react-icons/tb'
import { Link as LinkRouter } from 'react-router-dom'
import { Template } from '../../../../layout'
import { Item, ItemLabel, ItemSection, List, Loading } from '../../../../shared/ui'
import { useFetchQueries, useRemoveQuery } from '../../api/hooks/queries'

interface ListQueriesProps {
	className?: string
}

export const ListQueries = observer(({ className }: ListQueriesProps) => {
	const [size, setSize] = useState(100)
	const listQueries = useFetchQueries(Number(size))
	const {
		data,
		hasPreviousPage,
		hasNextPage,
		isFetchingPreviousPage,
		isFetchingNextPage,
		fetchNextPage,
		fetchPreviousPage,
		isLoading,
		error,
	} = listQueries

	const removeQuery = useRemoveQuery()

	const handleRemove = async (item: IAnalyticsElasticQueryItem) => {
		if (!confirm(`Точно хотите удалить "${item.name_query}"?`)) {
			return
		}
		await removeQuery.mutate(item.id)
	}

	return (
		<Stack className={className}>
			<Template slot='notification'>{error && <Notification color='red'>{error.message}</Notification>}</Template>
			<Loading active={isLoading || removeQuery.isPending} keepMounted>
				<List separator>
					{(data || []).length > 0 ? (
						(data || []).map((item: IAnalyticsElasticQueryItem) => (
							<Item dense key={item.id} component={LinkRouter} to={`/analytics/query/${item.id}`} hoverable>
								<ItemSection row top>
									<ItemLabel>{item.name_query}</ItemLabel>
								</ItemSection>
								<ItemSection side>
									<ActionIcon
										color='red'
										title='Удалить'
										loading={removeQuery.isPending}
										onClick={() => handleRemove(item)}
									>
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
			<Template.Footer>
				<Group>
					<Button disabled={!hasPreviousPage} loading={isFetchingPreviousPage} onClick={() => fetchPreviousPage()}>
						Предыдущая
					</Button>
					<Button disabled={!hasNextPage} loading={isFetchingNextPage} onClick={() => fetchNextPage()}>
						Следующая
					</Button>
				</Group>
				<Select value={String(size)} onChange={val => setSize(Number(val))} data={['15', '30', '50', '75', '100']} />
			</Template.Footer>
		</Stack>
	)
})
