import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import {
	DmcInput,
	DmcItem,
	DmcItemExpansion,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
	DmcLoading,
	DmcMessage,
} from '../../../shared/ui'
import { formatPrintStore } from '../stores/format-print-store'
import { formatStore } from '../stores/format-store'

interface FormatListProps {
	className?: string
	group?: string
}

export const FormatList = observer(({ className, group }: FormatListProps) => {
	const { isLoading, formats, error } = formatStore
	const { formatPrints } = formatPrintStore

	const allList = useMemo(() => {
		const res = Object.fromEntries(formats.map(item => [item, []]))
		formatPrints.forEach(item => {
			res[item.format]?.push(item.print)
		})
		return res
	}, [formats, formatPrints])
	console.log(allList)

	const [newFormat, setNewFormat] = useState('')
	const handleChange = ({ target }: React.ChangeEvent) => {
		setNewFormat(target.value)
	}
	const handleKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === 'Enter') {
			formatStore.add(newFormat.trim())
			setNewFormat('')
		}
	}

	const ll = (label, ...args) => {
		console.log(label, args)
	}

	return (
		<div className={className}>
			{error && (
				<DmcMessage
					className='mb-8'
					color='warning'
					square
					underlined='left'
					label={error}
				/>
			)}
			<DmcInput
				filled
				underlined
				disabled={isLoading}
				value={newFormat}
				onChange={handleChange}
				onKeyPress={handleKeyPress}
			/>
			<DmcLoading active={isLoading}>
				<DmcList as='div'>
					{formats.map(item => (
						<DmcItemExpansion as='div' opened key={item} label={item}>
							<>
								<ReactSortable
									tag={DmcList}
									list={[]}
									setList={(...args) => {
										ll(item, ...args)
									}}
									group={group}
								>
									{allList[item].map(print => (
										<DmcItem>
											<DmcItemSection>
												<DmcItemLabel>{print}</DmcItemLabel>
											</DmcItemSection>
										</DmcItem>
									))}
								</ReactSortable>
							</>
						</DmcItemExpansion>
					))}
				</DmcList>
			</DmcLoading>
		</div>
	)
})
