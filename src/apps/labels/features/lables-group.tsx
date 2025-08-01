import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { TbList } from 'react-icons/tb'
import {
	DmcInput,
	DmcItem,
	DmcItemExpansion,
	DmcItemLabel,
	DmcItemSection,
	DmcList,
	DmcLoading,
	DmcMessage,
	DmcSelect,
} from '../../../shared/ui'

import { userStore } from '../../../components/stores/user-store'

import { formatPrintStore } from '../stores/format-print-store'
import { formatStore } from '../stores/format-store'
import { printStore } from '../stores/print-store'

import { GroupContainer } from './components/group/container'
import { GroupItem } from './components/group/item'
import { GroupProvider } from './components/group/provider'

export const LabelsGroup = observer(() => {
	const { products } = userStore
	const {
		prints: _prints,
		isLoading: isLoadingPrints,
		error: errorPrints,
	} = printStore
	const {
		formats: _formats,
		isLoading: isLoadingFormats,
		error: errorFormats,
	} = formatStore
	const {
		formatPrints: _formatPrints,
		isLoading: isLoadingFormatPrints,
		error: errorFormatPrints,
	} = formatPrintStore

	const [production_id, setProduction_id] = useState()

	const prints = useMemo(
		() => _prints[production_id] || [],
		[_prints, production_id]
	)
	const formats = useMemo(
		() => _formats[production_id] || [],
		[_formats, production_id]
	)
	const formatPrints = useMemo(
		() => _formatPrints[production_id] || [],
		[_formatPrints, production_id]
	)
	const error = useMemo(
		() => errorPrints || errorFormats || errorFormatPrints,
		[errorPrints, errorFormats, errorFormatPrints]
	)

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
		const con =
			Object.fromEntries((formats || []).map(item => [item, []])) || {}
		con['.default'] = (prints || []).map(item => ({
			print: item,
			id: item,
			format: '.default',
			_id: undefined,
		}))
		formatPrints.forEach(item => {
			item.format &&
				con[item.format]?.push({
					format: item.format,
					print: item.print,
					id: item.print,
					_id: item.id,
				})
			const i = con['.default'].findIndex(e => e.print === item.print)
			if (i !== -1) {
				con['.default'].splice(i, 1)
			}
		})

		return con
	}, [formats, prints, formatPrints])

	useEffect(() => {
		if (!production_id) {
			setProduction_id(products[0]?.production_id)
		}
	}, [products, production_id])

	const findIndex = (item, id) =>
		item === id || (typeof item === 'object' && 'id' in item && item.id === id)

	const handleDragEnd = event => {
		const { source, target } = event.operation

		let sourceIndex = -1
		let sourceParent
		let targetIndex = -1
		let targetParent

		for (const [id, children] of Object.entries(containers)) {
			if (sourceIndex === -1) {
				sourceIndex = children.findIndex(item => findIndex(item, source.id))
				if (sourceIndex !== -1) {
					sourceParent = id
				}
			}
			if (targetIndex === -1) {
				targetIndex = children.findIndex(item => findIndex(item, target.id))
				if (targetIndex !== -1) {
					targetParent = id
				}
			}
			if (sourceIndex !== -1 && targetIndex !== -1) {
				break
			}
		}

		if (sourceIndex === -1 && targetIndex === -1) {
			return
		}

		if (containers[sourceParent][sourceIndex]._id && target.id === '.default') {
			formatPrintStore.delete(containers[sourceParent][sourceIndex]._id)
		} else if (
			sourceParent !== target.id &&
			containers[sourceParent][sourceIndex]._id
		) {
			formatPrintStore.update(containers[sourceParent][sourceIndex]._id, {
				production_id,
				add_label_format: target.id,
				statistics_print_format: containers[sourceParent][sourceIndex].print,
			})
		} else if (
			target.id !== '.default' &&
			!containers[sourceParent][sourceIndex]._id
		) {
			formatPrintStore.add({
				production_id,
				add_label_format: target.id,
				statistics_print_format: containers[sourceParent][sourceIndex].print,
			})
		}

		if (event.canceled || source.type !== 'column') return
	}

	const [newFormat, setNewFormat] = useState<string>('')
	const handleChange = ({ target }: React.ChangeEvent) => {
		setNewFormat(target.value)
	}
	const handleKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === 'Enter') {
			formatStore.add({ format: newFormat.trim(), production_id })
			setNewFormat('')
		}
	}

	return (
		<div className=''>
			{error && (
				<DmcMessage
					className='mb-8'
					color='warning'
					square
					underlined='left'
					label={error}
				/>
			)}
			<div className='flex gap-3'>
				<DmcSelect
					dense
					filled
					value={production_id}
					onChange={({ target }) => setProduction_id(target.value)}
				>
					{products.map(product => (
						<option key={product.production_id} value={product.production_id}>
							{product.name_production} ({product.production_id})
						</option>
					))}
				</DmcSelect>
			</div>

			<DmcLoading
				active={isLoadingPrints || isLoadingFormats || isLoadingFormatPrints}
				keepMounted
			>
				<div className='flex gap-3'>
					<GroupProvider onDragEnd={handleDragEnd}>
						<DmcList as='div' className='flex-1/2'>
							<DmcItem>
								<DmcItemSection>
									<DmcInput
										dense
										square
										filled
										underlined
										placeholder='Добавить формат'
										disabled={
											isLoadingPrints ||
											isLoadingFormats ||
											isLoadingFormatPrints
										}
										value={newFormat}
										onChange={handleChange}
										onKeyPress={handleKeyPress}
										hideMessage
										className='w-full'
									/>
								</DmcItemSection>
							</DmcItem>

							{formats.map(item => (
								<GroupContainer key={item} column={item}>
									<DmcItemExpansion as='div' opened label={item}>
										<DmcList as='div'>
											{(containers[item] || []).map(item => (
												<GroupItem key={item.id} id={item.id} data={item}>
													<DmcItem as='div'>
														<DmcItemSection side>
															<TbList />
														</DmcItemSection>
														<DmcItemSection>
															<DmcItemLabel>{item.id}</DmcItemLabel>
														</DmcItemSection>
													</DmcItem>
												</GroupItem>
											))}
										</DmcList>
									</DmcItemExpansion>
								</GroupContainer>
							))}
						</DmcList>
						<GroupContainer column='.default'>
							<DmcList as='div' className='flex-1/2'>
								{(containers['.default'] || []).map(item => (
									<GroupItem key={item.id} id={item.id} data={item}>
										<DmcItem as='div'>
											<DmcItemSection side>
												<TbList />
											</DmcItemSection>
											<DmcItemSection>
												<DmcItemLabel>{item.id}</DmcItemLabel>
											</DmcItemSection>
										</DmcItem>
									</GroupItem>
								))}
							</DmcList>
						</GroupContainer>
					</GroupProvider>
				</div>
			</DmcLoading>
		</div>
	)
})
