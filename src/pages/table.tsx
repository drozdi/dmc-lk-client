import { XColumn, XTable } from "@/shared/ui/table/table";
import { useState } from "react";

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
			position: 7,
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
	
	const [tt, setTt] = useState<Record<keyof SS, boolean>>({
		position: true,
		name: true,
		symbol: true,
		mass: true,
		grouped: true,
		group: true,
	})

	const toggle = (field: keyof SS) => {
		setTt(v => ({...v, [field]: !v[field]}))
	}

	return <XTable<SS> data={elements}>
		{tt.position && <XColumn<SS> toggleable={(column) => {
			toggle(column.field)
		}} field="position" header="Element position" />}
		{tt.name && <XColumn<SS> toggleable={(column) => {
			toggle(column.field)
		}} field="name" header="Element name" />}
		{tt.symbol && <XColumn<SS> toggleable={(column) => {
			toggle(column.field)
		}} field="symbol" header="Symbol" />}
		{tt.mass && <XColumn<SS> toggleable={(column) => {
			toggle(column.field)
		}} field="mass" header="Atomic mass" />}
	</XTable>
}