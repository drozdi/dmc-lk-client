import { Flex, Notification, Select, Stack, Table, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { TbList } from 'react-icons/tb'
import { Template } from '../../../layout/context'
import { Loading } from '../../../shared/ui'
import { userStore } from '../../../stores/user-store'

import { labelsStore } from '../stores'

import { GroupContainer } from './components/group/container'
import { GroupItem } from './components/group/item'
import { GroupProvider } from './components/group/provider'

export const LabelsGroup = observer(() => {
	const { products } = userStore
	const { error, isLoading, prints: _prints, formats: _formats, formatPrints: _formatPrints } = labelsStore

	const [production_id, setProduction_id] = useState()

	const prints = useMemo(() => _prints[production_id] || [], [_prints, production_id])
	const formats = useMemo(() => _formats[production_id] || [], [_formats, production_id])
	const formatPrints = useMemo(() => _formatPrints[production_id] || [], [_formatPrints, production_id])

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
		const con = Object.fromEntries((formats || []).map(item => [item, []])) || {}
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

	const findIndex = (item, id) => item === id || (typeof item === 'object' && 'id' in item && item.id === id)

	const handleDragEnd = async event => {
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
			await labelsStore.deleteFormatPrint(containers[sourceParent][sourceIndex]._id)
			labelsStore.loadPrints(true)
			labelsStore.loadFormats(true)
		} else if (sourceParent !== target.id && containers[sourceParent][sourceIndex]._id) {
			labelsStore.updateFormatPrint(containers[sourceParent][sourceIndex]._id, {
				production_id,
				add_label_format: target.id,
				statistics_print_format: containers[sourceParent][sourceIndex].print,
			})
		} else if (target.id !== '.default' && !containers[sourceParent][sourceIndex]._id) {
			labelsStore.addFormatPrint({
				production_id,
				add_label_format: target.id,
				statistics_print_format: containers[sourceParent][sourceIndex].print,
			})
		}
	}

	const [newFormat, setNewFormat] = useState<string>('')
	const handleChange = ({ target }: React.ChangeEvent) => {
		setNewFormat(target.value)
	}
	const handleKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === 'Enter') {
			labelsStore.addFormat({ format: newFormat.trim(), production_id })
			setNewFormat('')
		}
	}

	useEffect(() => {
		labelsStore.load(true)
	}, [])

	return (
		<Stack gap='xs'>
			<Template slot='notification'>{error && <Notification color='red'>{error}</Notification>}</Template>
			<Select
				w='100%'
				checkIconPosition='right'
				value={String(production_id)}
				onChange={setProduction_id}
				data={products.map(product => ({
					value: String(product.production_id),
					label: `${product.name_production} (${product.production_id})`,
				}))}
			/>

			<Loading active={isLoading} keepMounted>
				<TextInput
					w='100%'
					placeholder='Добавить формат'
					disabled={isLoading}
					value={newFormat}
					onChange={handleChange}
					onKeyPress={handleKeyPress}
				/>
				<GroupProvider onDragEnd={handleDragEnd}>
					<Flex mt='xs'>
						<Stack
							style={{
								width: '50%',
							}}
						>
							{formats.map(item => (
								<GroupContainer key={item} column={item}>
									<Table>
										<Table.Thead>
											<Table.Tr>
												<Table.Td w='2rem'></Table.Td>
												<Table.Td>{item}</Table.Td>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{(containers[item] || []).map(item => (
												<GroupItem key={item.id} id={item.id} data={item}>
													<Table.Tr>
														<Table.Td ta='center'>
															<TbList />
														</Table.Td>
														<Table.Td>{item.id}</Table.Td>
													</Table.Tr>
												</GroupItem>
											))}
										</Table.Tbody>
									</Table>
								</GroupContainer>
							))}
						</Stack>

						<GroupContainer column='.default'>
							<Table
								style={{
									width: '50%',
								}}
							>
								<Table.Thead>
									<Table.Tr>
										<Table.Td w='2rem'></Table.Td>
										<Table.Td>Без группы</Table.Td>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{(containers['.default'] || []).map(item => (
										<GroupItem key={item.id} id={item.id} data={item}>
											<Table.Tr>
												<Table.Td ta='center'>
													<TbList />
												</Table.Td>
												<Table.Td>{item.id}</Table.Td>
											</Table.Tr>
										</GroupItem>
									))}
								</Table.Tbody>
							</Table>
						</GroupContainer>
					</Flex>
				</GroupProvider>
			</Loading>
		</Stack>
	)
})
