import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { TbColumnInsertRight, TbColumnRemove } from 'react-icons/tb'
import {
	DmcBtn,
	DmcInput,
	DmcLoading,
	DmcMarkupTable,
	DmcSelect,
} from '../../../../shared/ui'
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
	const { template, data, isNext, isPrev, limit, date, isLoading } =
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
			label: fields?.[item]?.label ?? item,
		}))
	}, [fields, list])

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: '#',
			},
			...template.company.select_field.map(item => ({
				accessorKey: item,
				header: fields?.[item]?.label ?? item,
			})),
		],
		[template, fields]
	)

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	})

	const whereItem = (select: string) =>
		template.company.list_where?.find(item => item.name_field_table === select)

	const whereItemAppend = (
		select: string,
		sign: '=' | '>=' | '<=' | '!=' | 'in' | 'not_in' | 'like',
		value: string | string[] = '',
		action: 'and' | 'or' | 'not' = 'and'
	) => {
		const index = template.company.list_where?.findIndex(
			item => item.name_field_table === select
		)
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
		template.company.select_field.push(select)
		elasticStore.saveTemp({ ...template })
		selectRef.current?.reset?.()
	}
	const handleRemoveField = (select: string) => {
		template.company.select_field = template.company.select_field.filter(
			item => item !== select
		)
		template.company.list_where = template.company.list_where.filter(
			item => item.name_field_table !== select
		)
		elasticStore.saveTemp({ ...template })
	}
	const handleChangeActionField = (
		select: string,
		action: 'and' | 'or' | 'not'
	) => {
		const where = whereItemAppend(select, '=', '', action)
		where.single_action_list = action
		elasticStore.saveTemp({ ...template })
	}
	const handleChangeSignField = (
		select: string,
		sign: '=' | '>=' | '<=' | '!=' | 'in' | 'not_in' | 'like'
	) => {
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
	const handleDateChange = ({ target }: React.ChangeEvent) => {
		elasticStore.setDate({
			[target.name]: target.value,
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
	}, [])

	return (
		<div className={className}>
			<div className='flex justify-between items-start'>
				<div className='flex gap-0 items-start justify-end'>
					<DmcInput
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
					<DmcInput
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
					<DmcBtn color='success' size='sm' onClick={handleSave}>
						Сохранить
					</DmcBtn>
					<DmcBtn color='info' size='sm' onClick={handleApply}>
						Применить
					</DmcBtn>
				</div>
				<div
					className='w-8 flex-none justify-end group relative overflow-visible'
					key='actions'
				>
					<button className='border-0 p-3 bg-info'>
						<TbColumnInsertRight />
					</button>
					<div className='absolute right-0 p-3 mt-2 w-72 bg-surface rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 z-10'>
						<DmcSelect
							filled
							dense
							underlined
							onChange={({ target }) => handleAddField(target.value)}
							ref={selectRef}
						>
							{variantFields.map(item => (
								<option key={item.value} value={item.value}>
									{item.label}
								</option>
							))}
						</DmcSelect>
					</div>
				</div>
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
										<div className='absolute right-0 p-3 mt-2 bg-surface rounded shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-300 z-50 cle'>
											<div className='flex gap-1 justify-between items-start'>
												<ActionForm
													value={
														whereItem(header.id)?.single_action_list || 'and'
													}
													onChange={single_action_list =>
														handleChangeActionField(
															header.id,
															single_action_list
														)
													}
												/>
												<button
													className='p-3 bg-warning rounded py-1 cursor-pointer'
													onClick={() => handleRemoveField(header.id)}
													title='Удалить поле'
												>
													<TbColumnRemove />
												</button>
											</div>
											<SignForm
												value={whereItem(header.id)?.sing_action || '='}
												onChange={sing_action =>
													handleChangeSignField(header.id, sing_action)
												}
											/>
											{whereItem(header.id)?.sing_action === 'in' ||
											whereItem(header.id)?.sing_action === 'not_in' ? (
												<InForm
													values={whereItem(header.id)?.search_value}
													onChange={values =>
														handleChangeInField(header.id, values)
													}
												/>
											) : (
												<DmcInput
													filled
													dense
													square
													underlined
													onChange={({ target }) =>
														handleChangeValueField(header.id, target.value)
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
			<div className='flex gap-3 justify-between mt-3 items-start'>
				<div className='flex gap-3 justify-end'>
					<DmcBtn
						color='secondary'
						size='sm'
						disabled={!isPrev}
						loading={isLoading}
						onClick={() => elasticStore.prev()}
					>
						Предыдущая
					</DmcBtn>
					<DmcBtn
						color='secondary'
						size='sm'
						disabled={!isNext}
						loading={isLoading}
						onClick={() => elasticStore.next()}
					>
						Следующая
					</DmcBtn>
				</div>
				<DmcSelect
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
				</DmcSelect>
			</div>
		</div>
	)
})
