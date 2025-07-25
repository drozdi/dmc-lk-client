import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { observer } from 'mobx-react-lite'

import { formatPrintStore } from '../stores/format-print-store'
import { formatStore } from '../stores/format-store'
import { printStore } from '../stores/print-store'

import { DmcItemExpansion, DmcList, DmcLoading } from '../../../shared/ui'

import { useEffect, useMemo, useRef } from 'react'
import { Container } from './components/Container'

export const LabelsPage = observer(() => {
	const { prints, isLoading: isLoadingPrints } = printStore
	const { formats, isLoading: isLoadingFormats } = formatStore
	const { formatPrints, isLoading: isLoadingFormatPrints } = formatPrintStore

	const containers = useMemo<
		Record<
			string,
			Array<{
				id: number | string
				print: string
				format: string
				_id?: number | string
			}>
		>
	>(() => {
		const con = Object.fromEntries(formats.map(item => [item, []]))
		con['.default'] = prints.map(item => ({
			print: item,
			id: item,
			format: '.default',
			_id: undefined,
		}))

		formatPrints.forEach(item => {
			con[item.format].push({
				format: item.format,
				print: item.print,
				id: item.print,
				_id: item.id,
			})
			const i = con['.default'].findIndex(e => e === item.print)
			if (i !== -1) {
				con['.default'].splice(i, 1)
			}
		})

		return con
	}, [formats, prints, formatPrints])

	const previousItems = useRef(containers)
	useEffect(() => {
		previousItems.current = containers
	}, [containers])

	const findIndex = (item, id) =>
		item === id || (typeof item === 'object' && 'id' in item && item.id === id)

	const update = newList => {
		console.log(newList)
		if (JSON.stringify(newList) === JSON.stringify(previousItems.current)) {
			return
		}
	}

	const handleDragStart = event => {
		previousItems.current = { ...containers }
	}
	const handleDragEnd = event => {
		const { source, target } = event.operation
		//console.log(event)
		const sourceIndex2 = containers.findIndex(item =>
			findIndex(item, source.id)
		)
		const targetIndex2 = containers.findIndex(item =>
			findIndex(item, target.id)
		)

		console.log(sourceIndex2, targetIndex2, source.id, target.id)

		update(move(containers, event))
		if (event.canceled || source.type !== 'column') return
	}

	return (
		<div className='flex gap-3'>
			<DmcLoading
				active={isLoadingPrints || isLoadingFormats || isLoadingFormatPrints}
			>
				<DragDropProvider
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<DmcList as='div' className='flex-1/2'>
						{formats.map(item => (
							<DmcItemExpansion as='div' opened key={item} label={item}>
								<Container column={item} items={containers[item]} />
							</DmcItemExpansion>
						))}
					</DmcList>
					<Container
						className='flex-1/2'
						column='.default'
						items={containers['.default']}
					/>
				</DragDropProvider>
			</DmcLoading>
		</div>
	)
})
