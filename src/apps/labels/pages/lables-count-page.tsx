import { Paper, Tabs } from '@mantine/core'
import { Template } from '@t'
import { LablesConsumption } from '../features/lables-consumption'
import { LabelsCount } from '../features/lables-count'
import { LabelsHistory } from '../features/lables-history'
export function LabelsCountPage() {
	return (
		<Paper>
			<Template.Title>Статистика по этикеткам</Template.Title>
			<Tabs defaultValue='item-count'>
				<Tabs.List grow>
					<Tabs.Tab value='item-count'>Текущее состояние</Tabs.Tab>
					<Tabs.Tab value='item-consumption'>Метраж</Tabs.Tab>
					<Tabs.Tab value='item-history'>История</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value='item-count' pt='xs'>
					<LabelsCount />
				</Tabs.Panel>
				<Tabs.Panel value='item-consumption' pt='xs'>
					<LablesConsumption />
				</Tabs.Panel>
				<Tabs.Panel value='item-history' pt='xs'>
					<LabelsHistory />
				</Tabs.Panel>
			</Tabs>
		</Paper>
	)
}
