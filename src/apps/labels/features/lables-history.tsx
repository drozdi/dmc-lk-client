import { Accordion, Notification } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'
import { Template } from '../../../layout/context'
import { useQuery_ } from '../../../shared/hooks'
import { Item, ItemLabel, ItemSection, List, Loading } from '../../../shared/ui'
import { requestLabelsCountHistory } from '../api'

export const LabelsHistory = () => {
	const { isLoading, error, fetch, data } = useQuery_(['labels-count'], requestLabelsCountHistory, {
		select: data => data.data,
	})

	const ddata = useMemo(() => {
		return Object.values(data ?? {}).map(item => ({
			name_production: item[0].name_production,
			production_id: item[0].production_id,
			items: item.sort((a, b) => a.filterdate < b.filterdate),
		}))
	}, [data])
	useEffect(() => {
		fetch()
	}, [])
	return (
		<>
			<Template slot='notification'>{error && <Notification color='red'>{error}</Notification>}</Template>
			<Loading active={isLoading} keepMounted>
				<Accordion variant='contained'>
					{ddata.map(item => (
						<Accordion.Item key={item.production_id} value={'tab-' + String(item.production_id)}>
							<Accordion.Control>{item.name_production}</Accordion.Control>
							<Accordion.Panel>
								<List dense separator>
									{item.items.map(item => (
										<Item key={item.id}>
											<ItemSection left>
												<ItemLabel>{item.place_name}</ItemLabel>
												<ItemLabel caption>
													{dayjs(item.date_applic).format('HH:mm DD-MM-YYYY')} - {item.format_template}
												</ItemLabel>
											</ItemSection>
											<ItemSection side>{item.count_label}</ItemSection>
										</Item>
									))}
								</List>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Loading>
		</>
	)
}
