import { requestAnalyticsElastic } from '@/entites/analytics';
import { DataColumn, TableData } from "@/shared/ui/table";
import { TextInput } from '@mantine/core';
import { useState } from 'react';

interface SS {
	position: number,
	mass: number,
	symbol: string,
	name: string,
	grouped?: string,
	group?: SS[],
}
const elements: SS[] = [
		{
			position: 6,
			mass: 12.011,
			symbol: "C",
			name: "Carbon",
			grouped: "1",
			group: [
				{
					position: 8,
					mass: 12.011,
					symbol: "C",
					name: "Carbon",
				},
				{
					position: 7,
					mass: 14.007,
					symbol: "N",
					name: "Nitrogen",
				},
				{
					position: 39,
					mass: 88.906,
					symbol: "Y",
					name: "Yttrium",
				},
				{
					position: 56,
					mass: 137.33,
					symbol: "Ba",
					name: "Barium",
				},
			],
		},
		{
			position: 7,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
			group: [
				{
					position: 6,
					mass: 12.011,
					symbol: "C",
					name: "Carbon",
				},
				{
					position: 7,
					mass: 14.007,
					symbol: "N",
					name: "Nitrogen",
				},
				{
					position: 39,
					mass: 88.906,
					symbol: "Y",
					name: "Yttrium",
				},
				{
					position: 56,
					mass: 137.33,
					symbol: "Ba",
					name: "Barium",
				},
			],
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 6,
			mass: 12.011,
			symbol: "C",
			name: "Carbon",
			grouped: "3",
		},
		{
			position: 7,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "1",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "2",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "3",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "1",
		},
		{
			position: 6,
			mass: 12.011,
			symbol: "C",
			name: "Carbon",
			grouped: "2",
		},
		{
			position: 7,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "3",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "1",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "2",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "3",
		},
		{
			position: 6,
			mass: 12.011,
			symbol: "C",
			name: "Carbon",
			grouped: "1",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
		{
			position: 100,
			mass: 14.007,
			symbol: "N",
			name: "Nitrogen",
			grouped: "2",
		},
		{
			position: 39,
			mass: 88.906,
			symbol: "Y",
			name: "Yttrium",
			grouped: "3",
		},
		{
			position: 56,
			mass: 137.33,
			symbol: "Ba",
			name: "Barium",
			grouped: "1",
		},
		{
			position: 58,
			mass: 140.12,
			symbol: "Ce",
			name: "Cerium",
			grouped: "2",
		},
	];


export function TablePage() {
	
	const [data, setData] = useState<SS[]>(elements)
	return <TableData<SS> data={data} editMode='row' breakpoint='sm' onRowEditComplete={
		(item, index) => setData(v => v.map((e, i) => i === index? item: e))} groupAt='start'>
		
		<DataColumn<SS> field="group" isGroup />

		{/* <DataColumn<SS> field="grouped" header="Grouped" /> */}
		<DataColumn<SS> resizable editor={(item, column, onChange, onSave) => 
				<TextInput defaultValue={item[column.field] as string} 
					onChange={({target}) => onChange(target.value) }
					onKeyPress={({ key }) => {
					if (key === 'Enter') {
						onSave()
					}
				}} />
		} sortable field="position" header="Element position" />
		<DataColumn<SS> resizable editor={(item, column, onChange, onSave) => 
			<TextInput defaultValue={item[column.field] as string} 
				onChange={({target}) => onChange(target.value) }
				onKeyPress={({ key }) => {
					if (key === 'Enter') {
						onSave()
					}
				}}
				/>
		} sortable field="name" header="Element name" />
		<DataColumn<SS> resizable editor={(item, column, onChange, onSave) => 
			<TextInput defaultValue={item[column.field] as string} 
				onChange={({target}) => onChange(target.value) }
				onKeyPress={({ key }) => {
					if (key === 'Enter') {
						onSave()
					}
				}}
				/>
		} field="symbol" header="Symbol" />
		<DataColumn<SS> resizable editor={(item, column, onChange, onSave) => 
			<TextInput defaultValue={item[column.field] as string} 
				onChange={({target}) => onChange(target.value) }
				onKeyPress={({ key }) => {
					if (key === 'Enter') {
						onSave()
					}
				}}
				/>
		} field="mass" header="Atomic mass" />
	</TableData>

	return <TableData<{id: string}> data={async (limit = 100, page = '') => {
		const res = await requestAnalyticsElastic({
			company: {
				select_field: [],
				list_where: [],
				date_limit: {
					"date_from": "2026-01-20",
					"date_to": "2026-05-15"
				},
			},
			paginate: {
				id_record: page as string,
				limit_page: limit
			}
		})
		return {
			data: res.data,
			next: res.last_id_record
		}
	}}>
		<DataColumn<{id: string}> field="id" header="ID" />
	</TableData>
}