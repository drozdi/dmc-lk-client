import { Accordion, Table } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Loading } from '../../../shared/ui'
import { useFormatСonsumptions } from '../stores/hooks'

export const LablesConsumption = observer(() => {
	const formatСonsumptions = useFormatСonsumptions()
	const ddata = useMemo(() => {
		return Object.values(formatСonsumptions)
	}, [formatСonsumptions])
	return (
		<Loading active={false} keepMounted>
			<Accordion>
				{ddata.map(item => (
					<Accordion.Item key={item.production_id} value={'tab-' + String(item.production_id)}>
						<Accordion.Control>{item.production_name}</Accordion.Control>
						<Accordion.Panel>
							<Table>
								<Table.Tbody>
									{item.labels.map(item => (
										<Table.Tr key={item.label}>
											<Table.Td>{item.label}</Table.Td>
											<Table.Td>{item.sum}</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		</Loading>
	)
})
