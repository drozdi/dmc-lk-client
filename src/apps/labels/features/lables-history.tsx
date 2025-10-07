import { Accordion, Notification } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '../../../shared/hooks'
import { DmcItem, DmcItemLabel, DmcItemSection, DmcList, Loading } from '../../../shared/ui'
import { requestLabelsCountHistory } from '../api'

export const LabelsHistory = () => {
	const [data, setData] = useState({})
	const { isLoading, error, request } = useQuery(requestLabelsCountHistory)
	const ddata = useMemo(() => {
		return Object.values(data).map(item => ({
			name_production: item[0].name_production,
			production_id: item[0].production_id,
			items: item.sort((a, b) => a.date_applic < b.date_applic),
		}))
	}, [data])
	async function fetch() {
		const res = await request()
		setData(res.data.response)
	}
	useEffect(() => {
		fetch()
	}, [])
	return (
		<>
			{error && <Notification color='red'>{error}</Notification>}
			<Loading active={isLoading} keepMounted>
				<Accordion variant='contained'>
					{ddata.map(item => (
						<Accordion.Item key={item.production_id} value={String(item.production_id)}>
							<Accordion.Control>{item.name_production}</Accordion.Control>
							<Accordion.Panel>
								<DmcList dense separator>
									{item.items.map(item => (
										<DmcItem key={item.id}>
											<DmcItemSection>
												<DmcItemLabel>{item.place_name}</DmcItemLabel>
												<DmcItemLabel caption>
													{dayjs(item.date_applic).format('HH:mm DD-MM-YYYY')} - {item.format_template}
												</DmcItemLabel>
											</DmcItemSection>
											<DmcItemSection side>{item.count_label}</DmcItemSection>
										</DmcItem>
									))}
								</DmcList>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Loading>
		</>
	)
}
