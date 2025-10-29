import { Accordion, Center } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useQuery } from '../../../../shared/hooks'
import { Loading } from '../../../../shared/ui'
import { requestAnalyticsIncident } from '../../api'
import { IncidentDetail } from './components/incident-detail'

export const IncidentAll = observer(
	({ query = {}, ...props }: { query: IAnalyticsIncidentQuery; [key: string]: any }) => {
		const { isLoading, request } = useQuery(requestAnalyticsIncident)
		const [data, setData] = useState([])
		const [openend, setOpenend] = useState<string[]>([])

		async function fetch() {
			const res = await request(query)
			setData(res?.message)
		}
		useEffect(() => {
			fetch()
		}, [query])

		return (
			<>
				<Loading {...props} active={isLoading} keepMounted>
					{data.length ? (
						<Accordion multiple chevronPosition='left' onChange={setOpenend}>
							{data.map((item, index) => (
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
