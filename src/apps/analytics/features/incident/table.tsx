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
	DmcLoading,
	DmcMarkupTable,
	Input,
	Select,
} from '../../../../shared/ui'
import { fieldsStore } from '../../stores/fields-store'
import { incidentStore } from '../../stores/incident-store'

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
			[
				'production_id',
				'taskid',
				'device_id',
				'event_id',
				'node_id',
				'place_id',
			].map(item => ({
				value: item,
				label: fields?.[item]?.label ?? item,
			})),
		[fields]
	)
	const variantFields = useMemo<
		Array<{
			value: string
			label: string
		}>
	>(
		() =>
			list.map(item => ({
				value: item,
				label: fields?.[item]?.label ?? item,
			})),
		[fields, list]
	)

	const columns = useMemo(
		() => [
			{
				accessorKey: 'data',
				header: 'Ошибка',
			},
			{
				accessorKey: 'total_counter',
				header: 'Ошибок',
			},
			...template.details,
			...template.fields,
		],
		[template]
	)

	const handleAddField = (field: string) => {
		template.fields.push({
			accessorKey: field,
			header: fields[field].label,
			type: 'field',
			index: template.fields.length,
		})
		incidentStore.saveTemp({ ...template })
	}
	const handleAddDetail = (field: string) => {
		template.details.push({
			accessorKey: field,
			header: fields[field].label,
			type: 'detail',
			index: template.fields.length,
		})
		incidentStore.saveTemp({ ...template })
	}
	const handleRemove = (column: {
		accessorKey: string
		type: 'detail' | 'field'
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
				{template.data.map(item => (
					<li key={item}>
						{item}{' '}
						<TbXboxX
							className='float-right cursor-pointer'
							onClick={() => handleRemoveItem(item)}
						/>
					</li>
				))}
				<li>
					<Input
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
			</ul>
			<div className='flex justify-between items-start'>
				<div className='flex-none justify-end group relative overflow-visible'>
					<button className='border-0 p-3 bg-info'>Групировать</button>
					<div className='absolute left-0 p-3 mt-2 w-72 bg-surface rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 z-10'>
						<Select
							filled
							dense
							underlined
							onChange={({ target }) => handleAddDetail(target.value)}
						>
							{variantDetails.map(item => (
								<option key={item.value} value={item.value}>
									{item.label}
								</option>
							))}
						</Select>
					</div>
				</div>
				<div className='flex gap-0 items-start justify-end'>
					<Input
						label='С'
						type='date'
						name='date_from'
						dense
						square
						filled
						underlined
						value={template.filterdate?.[0] || ''}
						onChange={({ target }) => handleDate(0, target.value)}
					/>
					<Input
						label='по'
						type='date'
						name='date_to'
						dense
						square
						filled
						underlined
						value={template.filterdate?.[1] || ''}
						onChange={({ target }) => handleDate(1, target.value)}
					/>
				</div>
				<div className='flex gap-3 justify-end'>
					<DmcBtn color='info' size='sm' onClick={() => incidentStore.send()}>
						Применить
					</DmcBtn>
				</div>
				<div className='flex-none justify-end group relative overflow-visible'>
					<button className='border-0 p-3 bg-info'>Показывать</button>
					<div className='absolute right-0 p-3 mt-2 w-72 bg-surface rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 z-10'>
						<Select
							filled
							dense
							underlined
							onChange={({ target }) => handleAddField(target.value)}
						>
							{variantFields.map(item => (
								<option key={item.value} value={item.value}>
									{item.label}
								</option>
							))}
						</Select>
					</div>
				</div>
			</div>
			<DmcLoading active={isLoading}>
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
										<div className='absolute right-0 p-3 mt-2 bg-surface rounded shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 z-50 cle'>
											<div className='flex gap-1 justify-between items-start'>
												<button
													className=' p-3 bg-warning rounded py-1 cursor-pointer'
													onClick={() => handleRemove(header.column.columnDef)}
													title='Удалить поле'
												>
													<TbColumnRemove />
												</button>
											</div>
										</div>

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
				<Select
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
				</Select>
			</div>
		</>
	)
})
