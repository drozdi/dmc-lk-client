import { Paper } from '@mantine/core'
import { Template } from '@t'
import { LabelsGroup } from '../features/lables-group'

export function LabelsPage() {
	return (
		<Paper>
			<Template.Title>Групировка этикеток</Template.Title>
			<LabelsGroup />
		</Paper>
	)
}
