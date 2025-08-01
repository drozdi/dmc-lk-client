import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { TbColumnRemove, TbXboxX } from 'react-icons/tb'
import {
	DmcBtn,
	DmcBtnRemove,
	DmcInput,
	DmcLoading,
	DmcMarkupTable,
	DmcSelect,
} from '../../../../shared/ui'
import { fieldsStore } from '../../stores/fields-store'
import { incidentStore } from '../../stores/incident-store'

const _variantDetails = [
	'production_id',
	'taskid',
	'device_id',
	'event_id',
	'node_id',
	'place_id',
]

export const TableIncident = observer(() => {
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
				.filter(
					item =>
						template.details.findIndex(col => col.accessorKey === item) === -1
				)
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
				.filter(
					item =>
						template.fields.findIndex(col => col.accessorKey === item) === -1
				)
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
	const canRemove = (column: {
		accessorKey: string
		type: 'detail' | 'field' | 'main'
	}) => {
		return column.type !== 'main'
	}
	const handleRemove = (column: {
		accessorKey: string
		type: 'detail' | 'field' | 'main'
	}) => {
		switch (column.type) {
			case 'field':
				template.fields = template.fields.filter(
					item => item.accessorKey !== column.accessorKey
				)
				break
			case 'detail':
				template.details = template.details.filter(
					item => item.accessorKey !== column.accessorKey
				)
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
		<>
			<ul className='list-none mb-3'>
				<li>
					<DmcInput
						filled
						dense
						square
						underlined
						placeholder='Ошибка'
						value={value}
						onChange={({ target }) => setValue(target.value)}
						onKeyPress={handleKeyPress}
					/>
				</li>
				{template.data.map(item => (
					<li className='flex justify-between items-start' key={item}>
						{item}{' '}
						<DmcBtnRemove
							size='xs'
							onClick={() => handleRemoveItem(item)}
							title='Удалить ошибку'
						>
							<TbXboxX />
						</DmcBtnRemove>
					</li>
				))}
			</ul>
			<div className='flex justify-between'>
				<DmcSelect
					filled
					dense
					square
					underlined
					hideMessage
					value=''
					onChange={({ target }) => handleAddDetail(target.value)}
				>
					<option disabled value=''>
						Групировать поля
					</option>
					{variantDetails.map(item => (
						<option key={item.value} value={item.value}>
							{item.label}
						</option>
					))}
				</DmcSelect>
				<DmcSelect
					filled
					dense
					square
					underlined
					hideMessage
					value=''
					onChange={({ target }) => handleAddField(target.value)}
				>
					<option disabled value=''>
						Показывать поля
					</option>
					{variantFields.map(item => (
						<option key={item.value} value={item.value}>
							{item.label}
						</option>
					))}
				</DmcSelect>
				<DmcInput
					label='С'
					type='date'
					name='date_from'
					dense
					square
					filled
					underlined
					hideMessage
					value={template.filterdate?.[0] || ''}
					onChange={({ target }) => handleDate(0, target.value)}
				/>
				<DmcInput
					label='по'
					type='date'
					name='date_to'
					dense
					square
					filled
					underlined
					hideMessage
					value={template.filterdate?.[1] || ''}
					onChange={({ target }) => handleDate(1, target.value)}
				/>
				<DmcBtn
					color='info'
					size='sm'
					square
					onClick={() => incidentStore.send()}
				>
					Применить
				</DmcBtn>
			</div>
			<DmcLoading active={isLoading} keepMounted>
				<DmcMarkupTable rowBorder striped>
					<DmcMarkupTable.Thead>
						{table.getHeaderGroups().map(headerGroup => (
							<DmcMarkupTable.Tr key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => (
									<DmcMarkupTable.Th
										className='group relative overflow-visible'
										key={header.id}
										colSpan={header.colSpan}
									>
										{canRemove(header.column.columnDef) && (
											<div className='absolute right-0 p-3 mt-2 bg-surface rounded shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 z-50 cle'>
												<div className='flex gap-1 justify-between items-start'>
													<DmcBtnRemove
														onClick={() =>
															handleRemove(header.column.columnDef)
														}
														title='Удалить поле'
													>
														<TbColumnRemove />
													</DmcBtnRemove>
												</div>
											</div>
										)}

										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</DmcMarkupTable.Th>
								))}
							</DmcMarkupTable.Tr>
						))}
					</DmcMarkupTable.Thead>
					<DmcMarkupTable.Tbody>
						{table.getRowModel().rows.map(row => (
							<DmcMarkupTable.Tr key={row.id}>
								{row.getVisibleCells().map(cell => (
									<DmcMarkupTable.Td key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</DmcMarkupTable.Td>
								))}
							</DmcMarkupTable.Tr>
						))}
					</DmcMarkupTable.Tbody>
				</DmcMarkupTable>
			</DmcLoading>
			<div className='flex gap-3 justify-end mt-3 items-start'>
				<DmcSelect
					dense
					filled
					value={limit}
					onChange={({ target }) => incidentStore.setLimit(target.value)}
				>
					<option value={15}>15</option>
					<option value={30}>30</option>
					<option value={50}>50</option>
					<option value={75}>75</option>
					<option value={100}>100</option>
				</DmcSelect>
			</div>
		</>
	)
})
