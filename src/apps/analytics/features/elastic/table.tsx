import { Button, Group, Popover, Select, Stack, Table, Text, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import { TbColumnRemove } from 'react-icons/tb'
import { Template } from '../../../../layout/context'
import { ButtonIcon, ButtonRemove, Loading } from '../../../../shared/ui'
import { elasticStore } from '../../stores/elastic-store'
import { fieldsStore } from '../../stores/fields-store'
import { ActionForm } from './components/action-form'
import { InForm } from './components/in-form'
import { SignForm } from './components/sign-form'

interface TableElasticProps {
	className?: string
}

export const TableElastic = observer(({ className }: TableElasticProps) => {
	const { fields, list } = fieldsStore
	const { template, data, isNext, isPrev, limit, date, isLoading } = elasticStore

	const variantFields = useMemo<
		Array<{
			value: string
			label: string
		}>
	>(() => {
		return list.map(item => ({
			value: String(item),
			label: fields?.[item]?.label ?? item,
		}))
	}, [fields, list])

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: '#',
				type: 'main',
			},
			...template.company.select_field.map(item => ({
				accessorKey: item,
				header: fields?.[item]?.label ?? item,
				type: 'field',
			})),
		],
		[template, fields]
	)

	const canEdit = (column: { accessorKey: string; type: 'field' | 'main' }) => {
		return column.type !== 'main'
	}

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	})

	const whereItem = (select: string) => template.company.list_where?.find(item => item.name_field_table === select)

	const whereItemAppend = (
		select: string,
		sign: '=' | '>=' | '<=' | '!=' | 'in' | 'not_in' | 'like',
		value: string | string[] = '',
		action: 'and' | 'or' | 'not' = 'and'
	) => {
		const index = template.company.list_where?.findIndex(item => item.name_field_table === select)
		let where = {
			name_field_table: select,
			sing_action: sign,
			search_value: value,
			single_action_list: action,
		}
		if (index === -1) {
			template.company.list_where.push(where)
		} else {
			where = template.company.list_where[index]
		}
		return where
	}

	const handleAddField = (select: string) => {
		if (!select) {
			return
		}
		template.company.select_field.push(select)
		elasticStore.saveTemp({ ...template })
	}
	const handleRemoveField = (select: string) => {
		template.company.select_field = template.company.select_field.filter(item => item !== select)
		template.company.list_where = template.company.list_where.filter(item => item.name_field_table !== select)
		elasticStore.saveTemp({ ...template })
	}
	const handleChangeActionField = (select: string, action: 'and' | 'or' | 'not') => {
		const where = whereItemAppend(select, '=', '', action)
		where.single_action_list = action
		elasticStore.saveTemp({ ...template })
	}
	const handleChangeSignField = (select: string, sign: '=' | '>=' | '<=' | '!=' | 'in' | 'not_in' | 'like') => {
		const where = whereItemAppend(select, sign)
		where.sing_action = sign
		where.search_value = ''
		elasticStore.saveTemp({ ...template })
	}
	const handleChangeInField = (select: string, value: string[]) => {
		const where = whereItemAppend(select, '=', value)
		where.search_value = value
		elasticStore.saveTemp({ ...template })
	}
	const handleChangeValueField = (select: string, value: string) => {
		const where = whereItemAppend(select, '=', value)
		where.search_value = value
		elasticStore.saveTemp({ ...template })
	}
	const handleDateChange = (name: string, value: any) => {
		elasticStore.setDate({
			[name]: value,
		})
	}

	const handleApply = async () => {
		await elasticStore.reset()
	}
	const handleSave = async () => {
		if (!elasticStore.name) {
			elasticStore.setName(prompt('Введите название запроса'))
		}
		await elasticStore.save()
	}

	useEffect(() => {
		if (elasticStore.id) {
			elasticStore.reset()
		}
	}, [elasticStore.id])

	return (
		<>
			<Group justify='space-between'>
				<Group>
					<Select
						value={''}
						onChange={value => handleAddField(value)}
						placeholder='Добавить поле'
						data={variantFields}
					/>
					<Group>
						<Text>С</Text>
						<DatePickerInput
							name='date_from'
							value={date.date_from}
							onChange={value => handleDateChange('date_from', value)}
						/>
						<Text>по</Text>
						<DatePickerInput
							name='date_to'
							value={date.date_to}
							onChange={value => handleDateChange('date_to', value)}
						/>
					</Group>
				</Group>
				<Group>
					<Button color='green' onClick={handleSave}>
						Сохранить
					</Button>
					<Button onClick={handleApply}>Применить</Button>
				</Group>
			</Group>
			<Loading active={isLoading} keepMounted>
				<Table>
					<Table.Thead>
						{table.getHeaderGroups().map((headerGroup, index) => (
							<Table.Tr key={headerGroup.id + '-' + index}>
								{headerGroup.headers.map((header, index) => (
									<Table.Th key={header.id + '-' + index} colSpan={header.colSpan}>
										<Group justify='space-between'>
											<Text>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</Text>
											{canEdit(header.column.columnDef) && (
												<Popover>
													<Popover.Target>
														<ButtonIcon>tb-settings</ButtonIcon>
													</Popover.Target>
													<Popover.Dropdown w='18rem'>
														<Stack gap='xs'>
															<Group gap='xs' justify='space-between'>
																<ActionForm
																	value={whereItem(header.id)?.single_action_list || 'and'}
																	onChange={single_action_list =>
																		handleChangeActionField(header.id, single_action_list)
																	}
																/>

																<ButtonRemove onClick={() => handleRemoveField(header.id)} title='Удалить поле'>
																	<TbColumnRemove />
																</ButtonRemove>
															</Group>

															<SignForm
																value={whereItem(header.id)?.sing_action || '='}
																onChange={sing_action => handleChangeSignField(header.id, sing_action)}
															/>
															{whereItem(header.id)?.sing_action === 'in' ||
															whereItem(header.id)?.sing_action === 'not_in' ? (
																<InForm
																	values={whereItem(header.id)?.search_value}
																	onChange={values => handleChangeInField(header.id, values)}
																/>
															) : (
																<TextInput
																	onChange={({ target }) => handleChangeValueField(header.id, target.value)} ///
																/>
															)}
														</Stack>
													</Popover.Dropdown>
												</Popover>
											)}
										</Group>
									</Table.Th>
								))}
							</Table.Tr>
						))}
					</Table.Thead>
					<Table.Tbody>
						{table.getRowModel().rows.map(row => (
							<Table.Tr key={row.id}>
								{row.getVisibleCells().map((cell, index) => (
									<Table.Td key={cell.id + '-' + index}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Table.Td>
								))}
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Loading>
			<Template slot='footer'>
				<Group>
					<Button disabled={!isPrev} loading={isLoading} onClick={() => elasticStore.prev()}>
						Предыдущая
					</Button>
					<Button disabled={!isNext} loading={isLoading} onClick={() => elasticStore.next()}>
						Следующая
					</Button>
				</Group>
				<Select
					value={String(limit)}
					data={['15', '30', '50', '75', '100']}
					onChange={value => elasticStore.setLimit(value)}
				/>
			</Template>
		</>
	)
})
