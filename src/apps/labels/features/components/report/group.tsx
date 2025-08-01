import { DmcItemExpansion, DmcList } from '../../../../../shared/ui'
import { ReportItem } from './item'
export function ReportGroup({
	item,
	warningLimits,
	dangerLimits,
}: {
	item: {
		add_label_format: string
		sum: number
		items: any[]
	}
	warningLimits: number
	dangerLimits: number
}) {
	return (
		<DmcItemExpansion
			color={
				item.sum < dangerLimits
					? item.sum < warningLimits
						? 'warning'
						: 'danger'
					: ''
			}
			label={item.add_label_format}
			rightSection={item.sum}
		>
			<DmcList>
				{item.items.map(item => (
					<ReportItem
						item={item}
						dangerLimits={dangerLimits}
						warningLimits={warningLimits}
					/>
				))}
			</DmcList>
		</DmcItemExpansion>
	)
}
