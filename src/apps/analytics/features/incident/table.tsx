import { Button, Group, Select, Stack, Table, Text, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { TbXboxX } from 'react-icons/tb'
import { ButtonRemove, Icon, Loading } from '../../../../shared/ui'
import { fieldsStore } from '../../stores/fields-store'
import { incidentStore } from '../../stores/incident-store'

const _variantDetails = ['production_id', 'taskid', 'device_id', 'event_id', 'node_id', 'place_id']

export const IncidentTable = observer(() => {
	const { fields, list } = fieldsStore
	const { template, limit, data, isLoading } = incidentStore

	const variantDetails = useMemo<
		Array<{
			value: string
			label: string
		}>
	>(
		() =>
			_variantDetails
				.filter(item => template.details.findIndex(col => col.accessorKey === item) === -1)
				.map(item => ({
					value: item,
					label: fields?.[item]?.label ?? item,
				})),
		[fields, template]
	)
	const variantFields = useMemo<
		Array<{
			value: string
			label: string
		}>
	>(
		() =>
			list
				.filter(item => !_variantDetails.includes(item))
				.filter(item => template.fields.findIndex(col => col.accessorKey === item) === -1)
				.map(item => ({
					value: item,
					label: fields?.[item]?.label ?? item,
				})),
		[fields, template, list]
	)

	const columns = useMemo(
		() => [
			{
				accessorKey: 'data',
				header: 'Ошибка',
				type: 'main',
			},
			{
				accessorKey: 'total_counter',
				header: 'Ошибок',
				type: 'main',
			},
			...template.details,
			...template.fields,
		],
		[template]
	)

	const handleAddField = (field: string) => {
		if (!field) {
			return
		}
		template.fields.push({
			accessorKey: field,
			header: fields[field].label,
			type: 'field',
			index: template.fields.length,
		})
		incidentStore.saveTemp({ ...template })
	}
	const handleAddDetail = (field: string) => {
		if (!field) {
			return
		}
		template.details.push({
			accessorKey: field,
			header: fields[field].label,
			type: 'detail',
			index: template.fields.length,
		})
		incidentStore.saveTemp({ ...template })
	}
	const canRemove = (column: { accessorKey: string; type: 'detail' | 'field' | 'main' }) => {
		return column.type !== 'main'
	}
	const handleRemove = (column: { accessorKey: string; type: 'detail' | 'field' | 'main' }) => {
		switch (column.type) {
			case 'field':
				template.fields = template.fields.filter(item => item.accessorKey !== column.accessorKey)
				break
			case 'detail':
				template.details = template.details.filter(item => item.accessorKey !== column.accessorKey)
				break
		}
		incidentStore.saveTemp({ ...template })
	}
	const handleDate = (index, date) => {
		if (index === 0) {
			template.filterdate = [date, template.filterdate?.[1]]
		} else {
			template.filterdate = [template.filterdate?.[0], date]
		}
		incidentStore.saveTemp({ ...template })
	}

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	})

	const [value, setValue] = useState('')
	const handleKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === 'Enter' && value) {
			template.data.push(value)
			incidentStore.saveTemp({ ...template })
			setValue('')
		}
	}
	const handleRemoveItem = (value: string) => {
		template.data = template.data.filter(item => value !== item)
		incidentStore.saveTemp({ ...template })
	}

	return (
		<Stack gap='xs'>
			<ul className='list-none mb-3'>
				<li>
					<TextInput
						placeholder='Ошибка'
						value={value}
						onChange={({ target }) => setValue(target.value)}
						onKeyPress={handleKeyPress}
					/>
				</li>
				{template.data.map(item => (
					<li className='flex justify-between items-start' key={item}>
						{item}{' '}
						<ButtonRemove onClick={() => handleRemoveItem(item)} title='Удалить ошибку'>
							<TbXboxX />
						</ButtonRemove>
					</li>
				))}
			</ul>
			<Group gap='xs' justify='space-between'>
				<Select placeholder='Групировать поля' value='' onChange={handleAddDetail} data={variantDetails} />
				<Select placeholder='Показывать поля' value='' onChange={handleAddField} data={variantFields} />
				<Group gap='xs'>
					<Text>С</Text>
					<DatePickerInput
						name='date_from'
						value={template.filterdate?.[0] || ''}
						onChange={value => handleDate(0, value)}
					/>
					<Text>по</Text>
					<DatePickerInput
						name='date_to'
						value={template.filterdate?.[1] || ''}
						onChange={value => handleDate(1, value)}
					/>
				</Group>
				<Button onClick={() => incidentStore.send()}>Применить</Button>
			</Group>
			<Loading active={isLoading} keepMounted>
				<Table withRowBorders>
					<Table.Thead>
						{table.getHeaderGroups().map(headerGroup => (
							<Table.Tr key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => (
									<Table.Th key={header.id} colSpan={header.colSpan}>
										<Group justify='space-between'>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											{canRemove(header.column.columnDef) && (
												<ButtonRemove
													onClick={() => handleRemove(header.column.columnDef)}
													title={`Удалить поле "${header.column.columnDef.header}"`}
												>
													<Icon>tb-column-remove</Icon>
												</ButtonRemove>
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
								{row.getVisibleCells().map(cell => (
									<Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
								))}
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Loading>
			<Group justify='end'>
				<Select
					value={String(limit)}
					onChange={value => incidentStore.setLimit(value)}
					data={['15', '30', '50', '75', '100']}
				/>
			</Group>
		</Stack>
	)
})
