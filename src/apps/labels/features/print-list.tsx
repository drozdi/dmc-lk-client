import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { ReactSortable } from 'react-sortablejs'
import {
	DmcItem,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
	DmcLoading,
} from '../../../shared/ui'
import { formatPrintStore } from '../stores/format-print-store'
import { printStore } from '../stores/print-store'

interface PrintListProps {
	className?: string
	group?: string
}

export const PrintList = observer(({ className, group }: PrintListProps) => {
	const { isLoading, prints } = printStore
	const { formatPrints } = formatPrintStore
	const availablePrints = useMemo(() => {
		const res = [...prints]
		if (formatPrints.length) {
			formatPrints.forEach(item => {
				const i = res.findIndex(e => e === item.print)
				if (i !== -1) {
					res.splice(i, 1)
				}
			})
		}
		return res
	}, [prints, formatPrints])
	return (
		<div className={className}>
			<DmcLoading active={isLoading}>
				<DmcList striped>
					<ReactSortable
						list={availablePrints}
						setList={console.log}
						group={group}
					>
						{availablePrints.map(item => (
							<DmcItem key={item}>
								<DmcItemSection>
									<DmcItemLabel>{item}</DmcItemLabel>
								</DmcItemSection>
							</DmcItem>
						))}
					</ReactSortable>
				</DmcList>
			</DmcLoading>
		</div>
	)
})
