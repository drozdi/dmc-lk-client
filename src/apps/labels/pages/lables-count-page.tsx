import { DmcTabs } from '../../../shared/ui'
import { LabelsCount } from '../features/lables-count'
import { LabelsHistory } from '../features/lables-history'
export function LabelsCountPage() {
	return (
		<DmcTabs>
			<DmcTabs.List grow>
				<DmcTabs.Tab value='item-count'>Текущее состояние</DmcTabs.Tab>
				<DmcTabs.Tab value='item-history'>История</DmcTabs.Tab>
			</DmcTabs.List>
			<DmcTabs.Panels>
				<DmcTabs.Panel value='item-count'>
					<LabelsCount />
				</DmcTabs.Panel>
				<DmcTabs.Panel value='item-history'>
					<LabelsHistory />
				</DmcTabs.Panel>
			</DmcTabs.Panels>
		</DmcTabs>
	)
}
