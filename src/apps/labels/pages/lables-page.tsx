import { Paper } from '@mantine/core'
import { TemplateTitle } from '@t'
import { LabelsGroup } from '../features/lables-group'

export function LabelsPage() {
	return (
		<Paper>
			<TemplateTitle>Групировка этикеток</TemplateTitle>
			<LabelsGroup />
		</Paper>
	)
}
