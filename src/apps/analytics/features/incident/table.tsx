import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { observer } from 'mobx-react-lite'
import { useMemo, useRef } from 'react'
import { TbColumnInsertRight, TbColumnRemove } from 'react-icons/tb'
import { Btn, Input, MarkupTable, Select } from '../../../../shared/ui'
import { elasticStore } from '../../stores/elastic-store'
import { ActionForm } from './components/action-form'
import { InForm } from './components/in-form'
import { SignForm } from './components/sign-form'

export const TableIncident = observer(() => {
	const { fields, list, template, date, data, isNext, isPrev, limit } =
		elasticStore
	const selectRef = useRef()

	const variantFields = useMemo<
		Array<{
			value: string
			label: string
		}>
	>(() => {
		return list.map(item => ({
			value: item,
			label: fields[item].label,
		}))
	}, [fields, list])

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: '#',
			},
			...template,
		],
		[template]
	)
	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	})

	const handleAddField = (e: React.ChangeEvent) => {
		elasticStore.saveTemp([
			...template,
			{
				accessorKey: e.target.value,
				header: fields[e.target.value].label,
			},
		])
		selectRef.current?.reset?.()
	}
	const handleRemoveField = (index: number) => {
		template.splice(index, 1)
		elasticStore.saveTemp([...template])
	}
	const handleChangeSignField = (index: number, sign: string) => {
		template[index].sign = sign
		template[index].value = ''
		elasticStore.saveTemp([...template])
	}
	const handleChangeInField = (index: number, value: any[]) => {
		template[index].value = value
		elasticStore.saveTemp([...template])
	}
	const handleChangeValueField = (index: number, value: string) => {
		template[index].value = value
		elasticStore.saveTemp([...template])
	}
	const handleChangeActionField = (index: number, action: string) => {
		template[index].action = action
		elasticStore.saveTemp([...template])
	}
	const handleDateChange = ({ target }: React.ChangeEvent) => {
		elasticStore.setDate({
			[target.name]: target.value,
		})
	}

	const handleApply = async () => {
		await elasticStore.send()
	}

	return (
		<>
			<div className='flex justify-between items-start'>
				<div className='flex gap-0 items-start justify-end'>
					<Input
						value={date.date_from}
						label='С'
						type='date'
						name='date_from'
						onChange={handleDateChange}
						dense
						square
						filled
						underlined
					/>
					<Input
						value={date.date_to}
						label='по'
						type='date'
						name='date_to'
						onChange={handleDateChange}
						dense
						square
						filled
						underlined
					/>
				</div>
				<div className='flex gap-3 justify-end'>
					<Btn color='success' size='sm'>
						Сохранить
					</Btn>
					<Btn color='info' size='sm' onClick={handleApply}>
						Применить
					</Btn>
				</div>
				<div
					className='w-8 flex-none justify-end group relative overflow-visible'
					key='actions'
				>
					<button className='border-0 p-3 bg-info'>
						<TbColumnInsertRight />
					</button>
					<div className='absolute right-0 p-3 mt-2 w-72 bg-surface rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 z-10'>
						<Select
							filled
							dense
							underlined
							onChange={handleAddField}
							ref={selectRef}
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
			<MarkupTable rowBorder striped>
				<MarkupTable.Thead>
					{table.getHeaderGroups().map(headerGroup => (
						<MarkupTable.Tr key={headerGroup.id}>
							{headerGroup.headers.map((header, index) => (
								<MarkupTable.Th
									className='group relative overflow-visible'
									key={header.id}
									colSpan={header.colSpan}
								>
									<div className='absolute right-0 p-3 mt-2 bg-surface rounded shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 z-50 cle'>
										<div className='flex gap-1 justify-between items-start'>
											<ActionForm
												value={template[index - 1]?.action || 'and'}
												onChange={action =>
													handleChangeActionField(index - 1, action)
												}
											/>
											<button
												className=' p-3 bg-warning rounded py-1 cursor-pointer'
												onClick={() => handleRemoveField(index - 1)}
												title='Удалить поле'
											>
												<TbColumnRemove />
											</button>
										</div>
										<SignForm
											value={template[index - 1]?.sign || '='}
											onChange={sign => handleChangeSignField(index - 1, sign)}
										/>
										{template[index - 1]?.sign === 'in' ||
										template[index - 1]?.sign === 'not_in' ? (
											<InForm
												values={template[index - 1]?.value}
												onChange={values =>
													handleChangeInField(index - 1, values)
												}
											/>
										) : (
											<Input
												filled
												dense
												square
												underlined
												onChange={({ target }) =>
													handleChangeValueField(index - 1, target.value)
												}
											/>
										)}
									</div>

									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</MarkupTable.Th>
							))}
						</MarkupTable.Tr>
					))}
				</MarkupTable.Thead>
				<MarkupTable.Tbody>
					{table.getRowModel().rows.map(row => (
						<MarkupTable.Tr key={row.id}>
							{row.getVisibleCells().map(cell => (
								<MarkupTable.Td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</MarkupTable.Td>
							))}
						</MarkupTable.Tr>
					))}
				</MarkupTable.Tbody>
			</MarkupTable>
			<div className='flex gap-3 justify-between mt-3 items-start'>
				<div className='flex gap-3 justify-end'>
					<Btn
						color='secondary'
						size='sm'
						disabled={!isPrev}
						onClick={() => elasticStore.prev()}
					>
						Предыдущая
					</Btn>
					<Btn
						color='secondary'
						size='sm'
						disabled={!isNext}
						onClick={() => elasticStore.next()}
					>
						Следующая
					</Btn>
				</div>
				<Select
					dense
					filled
					value={limit}
					onChange={({ target }) => elasticStore.setLimit(target.value)}
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
