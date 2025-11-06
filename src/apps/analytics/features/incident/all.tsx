import { Accordion, Center, Notification } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Template } from '../../../../layout'
import { useQuery_ } from '../../../../shared/hooks'
import { Loading } from '../../../../shared/ui'
import { requestAnalyticsIncident } from '../../api'
import { IncidentDetail } from './components/incident-detail'

export const IncidentAll = observer(
	({ query = {}, ...props }: { query: IRequestAnalyticsIncident; [key: string]: any }) => {
		const { data, isLoading, error, fetch } = useQuery_(['incident'], requestAnalyticsIncident, {
			select: (data: IResponse<IResponseAnalyticsIncident>) => data?.message || [],
		})
		const [openend, setOpenend] = useState<string[]>([])

		useEffect(() => {
			fetch?.(query)
		}, [query])

		return (
			<>
				<Template slot='notification'>{error && <Notification color='red'>{error}</Notification>}</Template>
				<Loading {...props} active={isLoading} keepMounted>
					{data?.length ? (
						<Accordion multiple chevronPosition='left' onChange={setOpenend}>
							{data.map((item: IAnalyticsIncidentItem) => (
								<Accordion.Item key={item.data} value={item.data}>
									<Accordion.Control icon={item.total_counter}>{item.data}</Accordion.Control>
									<Accordion.Panel>
										<div style={{ minHeight: 100 }}>
											{openend.includes(item.data) && <IncidentDetail {...query} data={[item.data]} />}
										</div>
									</Accordion.Panel>
								</Accordion.Item>
							))}
						</Accordion>
					) : (
						<Center w='100%' h='10rem' fz='h1'>
							Данные отсутствуют
						</Center>
					)}
				</Loading>
			</>
		)
	}
)
