import { DataColumn, TableData, TableRowActionsPanel } from '@/shared/ui/table';
import type { ColumnEntity, TableBulkAction, TableRowAction, TableRowActionsPanelProps } from '@/shared/ui/table/type';
import { Badge, Group, Stack, Tabs, TextInput, Title } from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import { TbPencil, TbTrash } from 'react-icons/tb';

/** Демо: 3 уровня мульти-группировки (region → category → status). */
interface MultiGroupRow {
	region: string;
	category: string;
	status: string;
	name: string;
	amount: number;
}

const multiGroupData: MultiGroupRow[] = [
	{ region: 'Европа', category: 'Электроника', status: 'active', name: 'Телефон A', amount: 120 },
	{ region: 'Европа', category: 'Электроника', status: 'active', name: 'Телефон B', amount: 95 },
	{ region: 'Европа', category: 'Электроника', status: 'draft', name: 'Планшет X', amount: 210 },
	{ region: 'Европа', category: 'Одежда', status: 'active', name: 'Куртка', amount: 80 },
	{ region: 'Европа', category: 'Одежда', status: 'active', name: 'Джинсы', amount: 45 },
	{ region: 'Европа', category: 'Одежда', status: 'archived', name: 'Шарф', amount: 12 },
	{ region: 'Азия', category: 'Электроника', status: 'active', name: 'Ноутбук Pro', amount: 890 },
	{ region: 'Азия', category: 'Электроника', status: 'draft', name: 'Ноутбук Lite', amount: 540 },
	{ region: 'Азия', category: 'Электроника', status: 'draft', name: 'Монитор', amount: 320 },
	{ region: 'Азия', category: 'Мебель', status: 'active', name: 'Стул', amount: 65 },
	{ region: 'Азия', category: 'Мебель', status: 'active', name: 'Стол', amount: 150 },
	{ region: 'Азия', category: 'Мебель', status: 'archived', name: 'Полка', amount: 30 },
	{ region: 'Америка', category: 'Электроника', status: 'active', name: 'Наушники', amount: 75 },
	{ region: 'Америка', category: 'Электроника', status: 'active', name: 'Колонка', amount: 110 },
	{ region: 'Америка', category: 'Одежда', status: 'draft', name: 'Футболка', amount: 25 },
	{ region: 'Америка', category: 'Одежда', status: 'draft', name: 'Кепка', amount: 18 },
	{ region: 'Америка', category: 'Мебель', status: 'active', name: 'Диван', amount: 420 },
	{ region: 'Америка', category: 'Мебель', status: 'archived', name: 'Тумба', amount: 90 },
];

/** Демо: group + grouped на одной колонке — flat-данные, без отдельного массива. */
interface UnifiedRow {
	department: string;
	employee: string;
	role: string;
	salary: number;
}

const unifiedData: UnifiedRow[] = [
	{ department: 'Разработка', employee: 'Иванов А.', role: 'Team Lead', salary: 185000 },
	{ department: 'Разработка', employee: 'Петров Б.', role: 'Middle', salary: 145000 },
	{ department: 'Разработка', employee: 'Сидоров В.', role: 'Junior', salary: 98000 },
	{ department: 'Разработка', employee: 'Козлов Г.', role: 'Senior', salary: 172000 },
	{ department: 'Маркетинг', employee: 'Новикова Е.', role: 'Head', salary: 156000 },
	{ department: 'Маркетинг', employee: 'Орлова Ж.', role: 'SMM', salary: 92000 },
	{ department: 'Маркетинг', employee: 'Волков И.', role: 'Analyst', salary: 118000 },
	{ department: 'Продажи', employee: 'Морозов К.', role: 'Head', salary: 164000 },
	{ department: 'Продажи', employee: 'Лебедев Л.', role: 'Manager', salary: 112000 },
	{ department: 'Продажи', employee: 'Соколов М.', role: 'Manager', salary: 108000 },
];

/** Демо: grouped (склад → зона) + group (комплектация в items). */
interface CombinedNested {
	warehouse?: string;
	zone?: string;
	product: string;
	sku: string;
	qty: number;
}

interface CombinedRow extends CombinedNested {
	items: CombinedNested[];
}

const combinedData: CombinedRow[] = [
	{
		warehouse: 'Склад A',
		zone: 'Z-1',
		product: 'Ноутбук Pro',
		sku: 'NB-PRO',
		qty: 12,
		items: [
			{
				warehouse: 'Склад AA',
				zone: 'Z-1',
				product: 'RAM 16GB',
				sku: 'RAM-16',
				qty: 12,
			},
			{
				warehouse: 'Склад AA',
				zone: 'Z-1',
				product: 'SSD 512GB',
				sku: 'SSD-512',
				qty: 12,
			},
		],
	},
	{
		warehouse: 'Склад A',
		zone: 'Z-1',
		product: 'Монитор 27"',
		sku: 'MON-27',
		qty: 8,
		items: [
			{
				warehouse: 'Склад AA',
				zone: 'Z-1',
				product: 'Кабель HDMI',
				sku: 'HDMI-2',
				qty: 8,
			},
		],
	},
	{
		warehouse: 'Склад A',
		zone: 'Z-2',
		product: 'Клавиатура',
		sku: 'KB-01',
		qty: 24,
		items: [],
	},
	{
		warehouse: 'Склад A',
		zone: 'Z-2',
		product: 'Мышь',
		sku: 'MS-01',
		qty: 30,
		items: [],
	},
	{
		warehouse: 'Склад B',
		zone: 'Z-1',
		product: 'Стул офисный',
		sku: 'CHR-01',
		qty: 15,
		items: [
			{
				warehouse: 'Склад AA',
				zone: 'Z-1',
				product: 'Подлокотники',
				sku: 'ARM-01',
				qty: 15,
			},
			{
				warehouse: 'Склад AA',
				zone: 'Z-1',
				product: 'Крестовина',
				sku: 'BASE-01',
				qty: 15,
			},
		],
	},
	{
		warehouse: 'Склад B',
		zone: 'Z-2',
		product: 'Стол письменный',
		sku: 'DSK-01',
		qty: 6,
		items: [],
	},
];

interface ActionDemoRow {
	id: number;
	name: string;
	role: string;
	_actions?: unknown;
}

const actionDemoData: ActionDemoRow[] = [
	{ id: 1, name: 'Анна К.', role: 'Менеджер' },
	{ id: 2, name: 'Борис Л.', role: 'Разработчик' },
	{ id: 3, name: 'Вера М.', role: 'Аналитик' },
	{ id: 4, name: 'Глеб Н.', role: 'Дизайнер' },
];

interface CellEditRow {
	name: string;
	qty: number;
}

const cellEditSeed: CellEditRow[] = [
	{ name: 'Болт M8', qty: 120 },
	{ name: 'Гайка M8', qty: 340 },
	{ name: 'Шайба 8', qty: 500 },
	{ name: 'Винт M6', qty: 80 },
	{ name: 'Гвоздь 50', qty: 200 },
	{ name: 'Саморез 4×40', qty: 150 },
	{ name: 'Дюбель 6', qty: 90 },
	{ name: 'Хомут', qty: 45 },
];

const statusBadgeColor: Record<MultiGroupRow['status'], string> = {
	active: 'green',
	draft: 'yellow',
	archived: 'gray',
};

function DemoRowActionsPanel<T extends ActionDemoRow>({
	node,
	actions,
}: TableRowActionsPanelProps<T>) {
	return (
		<Group gap={6} wrap="nowrap">
			<Badge variant="light" size="sm">
				#{node.data.id}
			</Badge>
			<TableRowActionsPanel node={node} actions={actions} />
		</Group>
	);
}

interface SS {
	position: number;
	mass: number;
	symbol: string;
	name: string;
	grouped?: string;
	group?: SS[];
}

const elements: SS[] = [
		{
			position: 6,
			mass: 12.011,
		symbol: 'C',
		name: 'Carbon',
		grouped: '1',
		group: [
			{ position: 8, mass: 15.999, symbol: 'O', name: 'Oxygen' },
			{ position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
		],
	},
	{
		position: 7,
		mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		group: [
			{ position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
			{ position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
		],
	},
	{
		position: 39,
		mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '1',
	},
	{
		position: 56,
		mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '2',
	},
	{
		position: 58,
		mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '1',
	},
	{
		position: 100,
		mass: 262,
		symbol: 'Rf',
		name: 'Rutherfordium',
		grouped: '3',
	},
];

interface SSS {
	position: number;
	mass: number;
	symbol: string;
	name: string;
	grouped?: string;
	group?:
		| SSS[]
		| ((input?: { limit: number; page: string | number }) => Promise<{
				data: SSS[];
				next: string | number;
				total?: number;
				pages?: number;
		  }>);
}
const elementsS: SSS[] = [
	{
		position: 6,
		mass: 12.011,
		symbol: 'C',
		name: 'Carbon',
		grouped: '1',
			group: [
				{
					position: 8,
					mass: 12.011,
				symbol: 'C',
				name: 'Carbon',
				},
				{
					position: 7,
					mass: 14.007,
				symbol: 'N',
				name: 'Nitrogen',
				},
				{
					position: 39,
					mass: 88.906,
				symbol: 'Y',
				name: 'Yttrium',
				},
				{
					position: 56,
					mass: 137.33,
				symbol: 'Ba',
				name: 'Barium',
			},
		],
		// group: async () => {
		// 	return {
		// 		data: [
		// 			{
		// 				position: 8,
		// 				mass: 12.011,
		// 				symbol: 'C',
		// 				name: 'Carbon',
		// 			},
		// 			{
		// 				position: 7,
		// 				mass: 14.007,
		// 				symbol: 'N',
		// 				name: 'Nitrogen',
		// 			},
		// 			{
		// 				position: 39,
		// 				mass: 88.906,
		// 				symbol: 'Y',
		// 				name: 'Yttrium',
		// 			},
		// 			{
		// 				position: 56,
		// 				mass: 137.33,
		// 				symbol: 'Ba',
		// 				name: 'Barium',
		// 			},
		// 		],
		// 	};
		// },
		},
		{
			position: 7,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
			group: [
				{
					position: 6,
					mass: 12.011,
				symbol: 'C',
				name: 'Carbon',
				},
				{
					position: 7,
					mass: 14.007,
				symbol: 'N',
				name: 'Nitrogen',
				},
				{
					position: 39,
					mass: 88.906,
				symbol: 'Y',
				name: 'Yttrium',
				},
				{
					position: 56,
					mass: 137.33,
				symbol: 'Ba',
				name: 'Barium',
				},
			],
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		group: [
		{
			position: 56,
			mass: 137.33,
				symbol: 'Ba',
				name: 'Barium',
				grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
				symbol: 'Ce',
				name: 'Cerium',
				grouped: '2',
		},
		{
			position: 6,
			mass: 12.011,
				symbol: 'C',
				name: 'Carbon',
				grouped: '3',
		},
		{
			position: 7,
			mass: 14.007,
				symbol: 'N',
				name: 'Nitrogen',
				grouped: '1',
		},
		{
			position: 39,
			mass: 88.906,
				symbol: 'Y',
				name: 'Yttrium',
				grouped: '2',
		},
		{
			position: 56,
			mass: 137.33,
				symbol: 'Ba',
				name: 'Barium',
				grouped: '3',
		},
		{
			position: 58,
			mass: 140.12,
				symbol: 'Ce',
				name: 'Cerium',
				grouped: '1',
		},
		{
			position: 6,
			mass: 12.011,
				symbol: 'C',
				name: 'Carbon',
				grouped: '2',
		},
		{
			position: 7,
			mass: 14.007,
				symbol: 'N',
				name: 'Nitrogen',
				grouped: '3',
		},
		{
			position: 39,
			mass: 88.906,
				symbol: 'Y',
				name: 'Yttrium',
				grouped: '1',
			},
		],
	},
	{
		position: 39,
		mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		group: [
		{
			position: 56,
			mass: 137.33,
				symbol: 'Ba',
				name: 'Barium',
				grouped: '2',
		},
		{
			position: 58,
			mass: 140.12,
				symbol: 'Ce',
				name: 'Cerium',
				grouped: '3',
		},
		{
			position: 6,
			mass: 12.011,
				symbol: 'C',
				name: 'Carbon',
				grouped: '1',
		},
		{
			position: 100,
			mass: 14.007,
				symbol: 'N',
				name: 'Nitrogen',
				grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
				symbol: 'Y',
				name: 'Yttrium',
				grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
				symbol: 'Ba',
				name: 'Barium',
				grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
				symbol: 'Ce',
				name: 'Cerium',
				grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
				symbol: 'N',
				name: 'Nitrogen',
				grouped: '2',
			},
		],
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
		},
		{
			position: 100,
			mass: 14.007,
		symbol: 'N',
		name: 'Nitrogen',
		grouped: '2',
		},
		{
			position: 39,
			mass: 88.906,
		symbol: 'Y',
		name: 'Yttrium',
		grouped: '3',
		},
		{
			position: 56,
			mass: 137.33,
		symbol: 'Ba',
		name: 'Barium',
		grouped: '1',
		},
		{
			position: 58,
			mass: 140.12,
		symbol: 'Ce',
		name: 'Cerium',
		grouped: '2',
	},
];


function editorCell(
	item: SS,
	column: ColumnEntity<SS>,
	onChange: (value: SS[keyof SS]) => void,
	onSave: () => void,
) {
	const field = column.field as keyof SS;
	return (
		<TextInput
			defaultValue={String(item[field] ?? '')}
			onChange={({ target }) => onChange(target.value as SS[keyof SS])}
			onKeyDown={({ key }) => {
					if (key === 'Enter') {
					onSave();
					}
				}}
				/>
	);
}

function cellQtyEditor(
	item: CellEditRow,
	column: ColumnEntity<CellEditRow>,
	onChange: (value: CellEditRow[keyof CellEditRow]) => void,
	onSave: () => void,
) {
	const field = column.field as keyof CellEditRow;
	return (
		<TextInput
			type={field === 'qty' ? 'number' : 'text'}
			defaultValue={String(item[field] ?? '')}
			onChange={({ target }) => {
				const value =
					field === 'qty' ? Number(target.value) : target.value;
				onChange(value as CellEditRow[keyof CellEditRow]);
			}}
			onKeyDown={({ key }) => {
					if (key === 'Enter') {
					onSave();
					}
				}}
				/>
	);
}

export function TablePage() {
	const [data, setData] = useState<SS[]>(elements);
	const [actionData, setActionData] = useState<ActionDemoRow[]>(actionDemoData);
	const [cellEditData, setCellEditData] = useState<CellEditRow[]>(cellEditSeed);
	const [controlledSelected, setControlledSelected] = useState<ActionDemoRow['id'][]>([]);
	const [statesDemo, setStatesDemo] = useState<'empty' | 'loading' | 'error'>('empty');

	const createRowActions = useCallback(
		(
			onEdit: (item: ActionDemoRow, index: ActionDemoRow['id'] | string | number) => void,
		): TableRowAction<ActionDemoRow>[] => [
			{
				id: 'edit',
				label: 'Редактировать',
				icon: <TbPencil size={16} />,
				onClick: (item, node) => onEdit(item, node.index),
			},
			{
				id: 'delete',
				label: 'Удалить',
				icon: <TbTrash size={16} />,
				color: 'red',
				onClick: (_, node) => {
					setActionData((rows) =>
						rows.filter((_, index) => index !== Number(node.index)),
					);
				},
			},
		],
		[],
	);

	const rowActions = useMemo(
		() =>
			createRowActions((item) => {
				const next = window.prompt('Имя', item.name);
				if (next == null) {
					return;
				}
				setActionData((rows) =>
					rows.map((row) => (row.id === item.id ? { ...row, name: next } : row)),
				);
			}),
		[createRowActions],
	);

	const bulkActions = useMemo<TableBulkAction<ActionDemoRow>[]>(
		() => [
			{
				id: 'delete-selected',
				label: 'Удалить выбранные',
				icon: <TbTrash size={16} />,
				color: 'red',
				onClick: ({ selectedIndexes }) => {
					setActionData((rows) =>
						rows.filter((_, index) => !selectedIndexes.includes(index)),
					);
				},
			},
		],
		[],
	);

	return (
		<Stack gap="lg" p="md">
			<Title order={2}>TableData — демо</Title>

			<Tabs defaultValue="group-columns" keepMounted={false}>
				<Tabs.List>
					<Tabs.Tab value="group-columns">Группировка колонок</Tabs.Tab>
					<Tabs.Tab value="group-rows">Группа строк</Tabs.Tab>
					<Tabs.Tab value="multi-grouped">Мульти-группировка</Tabs.Tab>
					<Tabs.Tab value="group-grouped">group + grouped</Tabs.Tab>
					<Tabs.Tab value="multi-sort">Мульти-сортировка</Tabs.Tab>
					<Tabs.Tab value="edit">Редактирование + group</Tabs.Tab>
					<Tabs.Tab value="row-actions">Действия со строкой</Tabs.Tab>
					<Tabs.Tab value="examples">Примеры API</Tabs.Tab>
					<Tabs.Tab value="fetch">Async fetch</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="group-columns" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Групировка колонок</Title>
					</Stack>
					<TableData<SSS> data={elementsS} storage="demo.group" limit={50} withColumnBorders>
						
						<DataColumn<SSS> header='Group' align='center' draggable>
							<DataColumn<SSS> group field="group" />
							<DataColumn<SSS>
								draggable
								field="position"
								header="Element position"
							/>
							<DataColumn<SSS>
								draggable
								field="name"
								header="Element name"
							/>
						</DataColumn>
						

						<DataColumn<SSS>
							draggable
							field="symbol"
							header="Symbol"
							align='center'
						>
							<DataColumn<SSS> header='Symbol 1' align='center' />
							<DataColumn<SSS> header='Symbol 2' align='center' />
						</DataColumn>
						<DataColumn<SSS>
							draggable
							field="mass"
							header="Atomic mass"
						/>
					</TableData>
				</Tabs.Panel>

				{/* <Tabs.Panel value="group-rows" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Группа</Title>
						<Text size="sm" c="dimmed">
							Раскрывайте строки
						</Text>
					</Stack>
					<TableData<SSS> data={elementsS} storage="demo.group" limit={50}>
						<DataColumn<SSS> group field="group" />
						<DataColumn<SSS>
							resizable
							draggable
							field="position"
							header="Element position"
						/>
						<DataColumn<SSS>
							draggable
							resizable
							field="name"
							header="Element name"
						/>
						<DataColumn<SSS>
							draggable
							resizable
							toggleable
							field="symbol"
							header="Symbol"
						/>
						<DataColumn<SSS>
							draggable
							resizable
							toggleable
							field="mass"
							header="Atomic mass"
						/>
					</TableData>
				</Tabs.Panel>

				<Tabs.Panel value="multi-grouped" pt="md">
					<Stack gap="xs" mb="xl">
						<Stack gap="xs" mb="md">
							<Title order={4}>3 уровня: region → category → status</Title>
							<Text size="sm" c="dimmed">
								Раскрывайте строки поэтапно: каждый уровень — вложенная
								таблица со следующим ключом группировки. Expander — в
								колонке текущего уровня.
							</Text>
							<TableData<MultiGroupRow>
								data={multiGroupData}
								storage="demo.multi-group"
								limit={50}
							>
								<DataColumn<MultiGroupRow>
									field="region"
									grouped
									header="Регион"
								/>
								<DataColumn<MultiGroupRow>
									field="category"
									grouped
									header="Категория"
								/>
								<DataColumn<MultiGroupRow>
									field="status"
									grouped
									header="Статус"
								/>
								<DataColumn<MultiGroupRow>
									field="name"
									header="Название"
									sortable
								/>
								<DataColumn<MultiGroupRow>
									field="amount"
									header="Сумма"
									sortable
									align="right"
								/>
							</TableData>
						</Stack>

						<Stack gap="xs" mb="md">
							<Title order={4}>3 уровня: region → category → status <br />
							с опцией groupAt="end"</Title>
							<Text size="sm" c="dimmed">
								Раскрывайте строки поэтапно: каждый уровень — вложенная
								таблица со следующим ключом группировки. Expander — в
								колонке текущего уровня.
							</Text>
							<TableData<MultiGroupRow>
								data={multiGroupData}
								storage="demo.multi-group"
								limit={50}
								groupAt="end"
							>
								<DataColumn<MultiGroupRow>
									field="region"
									grouped
									header="Регион"
								/>
								<DataColumn<MultiGroupRow>
									field="category"
									grouped
									header="Категория"
								/>
								<DataColumn<MultiGroupRow>
									field="status"
									grouped
									header="Статус"
								/>
								<DataColumn<MultiGroupRow>
									field="name"
									header="Название"
									sortable
								/>
								<DataColumn<MultiGroupRow>
									field="amount"
									header="Сумма"
									sortable
									align="right"
								/>
							</TableData>
						</Stack>
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="group-grouped" pt="md">
					<Stack gap="xl">
						<Stack gap="xs">
							<Title order={4}>group + grouped — одна колонка</Title>
							<Text size="sm" c="dimmed">
								Колонка <code>department</code> — <b>grouped</b> (строки с
								одинаковым отделом) и <b>group</b> (раскрытие списка
								сотрудников). Данные — обычный flat-массив, без{' '}
								<code>departmentItems</code>: grouped собирает siblings в{' '}
								<code>node.nodes</code>, group показывает их во вложенной
								таблице без заголовков.
							</Text>
							<TableData<UnifiedRow>
								data={unifiedData}
								groupAt="start"
								storage="demo.group-grouped-unified-v3"
								limit={50}
							>
								<DataColumn<UnifiedRow>
									field="department"
									group
									grouped
									header="Отдел"
								/>
								<DataColumn<UnifiedRow>
									field="employee"
									header="Сотрудник"
									sortable
								/>
								<DataColumn<UnifiedRow> field="role" header="Должность" />
								<DataColumn<UnifiedRow>
									field="salary"
									header="Зарплата"
									sortable
									align="right"
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>group + grouped — разные колонки</Title>
							<Text size="sm" c="dimmed">
								Режим <code>groupLayout: group-first</code> (авто):
								сначала раскрытие по group-колонке, внутри — grouped
								(склад, зона), если колонки указаны. Group-колонки первые
								при <code>groupAt="start"</code>.
							</Text>
							<TableData<CombinedRow>
								data={combinedData}
								groupAt="start"
								storage="demo.group-grouped-v4"
								limit={50}
							>
								<DataColumn<CombinedRow>
									field="items"
									group
									header="Комплектация"
								/>
								<DataColumn<CombinedRow>
									field="warehouse"
									grouped
									header="Склад"
								/>
								<DataColumn<CombinedRow>
									field="zone"
									grouped
									header="Зона"
								/>
								<DataColumn<CombinedRow>
									field="product"
									header="Товар"
									sortable
								/>
								<DataColumn<CombinedRow> field="sku" header="SKU" />
								<DataColumn<CombinedRow>
									field="qty"
									header="Кол-во"
									sortable
									align="right"
								/>
							</TableData>
						</Stack>
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="multi-sort" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Мульти-сортировка</Title>
						<Text size="sm" c="dimmed">
							Клик по заголовку — цикл desc/asc/off. Shift+клик или
							multiSort — добавляет поле в цепочку (бейдж с приоритетом).
						</Text>
					</Stack>
					<TableData<MultiGroupRow>
						data={multiGroupData}
						multiSort
						storage="demo.multi-sort"
						limit={50}
					>
						<DataColumn<MultiGroupRow>
							field="region"
							header="Регион"
							sortable
						/>
						<DataColumn<MultiGroupRow>
							field="category"
							header="Категория"
							sortable
						/>
						<DataColumn<MultiGroupRow>
							field="status"
							header="Статус"
							sortable
						/>
						<DataColumn<MultiGroupRow>
							field="name"
							header="Название"
							sortable
						/>
						<DataColumn<MultiGroupRow>
							field="amount"
							header="Сумма"
							sortable
							align="right"
						/>
					</TableData>
				</Tabs.Panel>

				<Tabs.Panel value="edit" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Редактирование строк + nested group</Title>
						<Text size="sm" c="dimmed">
							Enter — сохранить ячейку. Колонка group — вложенная таблица в
							поле записи.
						</Text>
					</Stack>
					<TableData<SS>
						data={data}
						editMode="row"
						breakpoint="sm"
						groupAt="start"
						storage="demo.edit"
						onRowEditComplete={(item, index) =>
							setData((v) => v.map((e, i) => (i === index ? item : e)))
						}
					>
						<DataColumn<SS> field="group" group header="" />
						<DataColumn<SS>
							resizable
							editor={editorCell}
							sortable
							field="position"
							header="Element position"
						/>
						<DataColumn<SS>
							resizable
							editor={editorCell}
							sortable
							field="name"
							header="Element name"
						/>
						<DataColumn<SS>
							resizable
							editor={editorCell}
							field="symbol"
							header="Symbol"
						/>
						<DataColumn<SS>
							resizable
							editor={editorCell}
							field="mass"
							header="Atomic mass"
						/>
					</TableData>
				</Tabs.Panel>

				<Tabs.Panel value="row-actions" pt="md">
					<Stack gap="xl">
						<Stack gap="xs">
							<Title order={4}>Hover-панель</Title>
							<Text size="sm" c="dimmed">
								Наведите на строку — справа появится панель. Добавляется
								нулевая колонка-слот (без ширины) в заголовке и строке для
								выравнивания. При выделении строк <code>bulkActions</code>{' '}
								появляются в слоте заголовка.
							</Text>
							<TableData<ActionDemoRow>
								data={actionData}
								rowActions={rowActions}
								bulkActions={bulkActions}
								rowActionsPanel={DemoRowActionsPanel}
								rowActionsAt="end"
								selectable="start"
								storage="demo.row-actions-hover"
								limit={50}
							>
								<DataColumn<ActionDemoRow>
									field="name"
									header="Имя"
									sortable
								/>
								<DataColumn<ActionDemoRow> field="role" header="Роль" />
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Колонка действий (inline)</Title>
							<Text size="sm" c="dimmed">
								<code>DataColumn actions</code> — отдельная колонка.
								Заголовок может быть пустым — ячейка остаётся. При{' '}
								<code>selectable</code> и выделенных строках в заголовке
								появляется панель <code>bulkActions</code>.
							</Text>
							<TableData<ActionDemoRow>
								data={actionData}
								rowActions={rowActions}
								bulkActions={bulkActions}
								rowActionsOnHover={false}
								selectable="start"
								storage="demo.row-actions-column"
								limit={50}
							>
								<DataColumn<ActionDemoRow>
									field="name"
									header="Имя"
									sortable
								/>
								<DataColumn<ActionDemoRow> field="role" header="Роль" />
								<DataColumn<ActionDemoRow>
									field="_actions"
									actions
									actionsAt="end"
									header=""
									width={88}
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Колонка с меню</Title>
							<Text size="sm" c="dimmed">
								<code>actionsMenu</code> — одна кнопка «⋯». Массовые
								действия в заголовке тоже открываются через меню, если
								колонка с <code>actionsMenu</code>.
							</Text>
							<TableData<ActionDemoRow>
								data={actionData}
								rowActions={rowActions}
								bulkActions={bulkActions}
								rowActionsOnHover={false}
								selectable="start"
								storage="demo.row-actions-menu"
								limit={50}
							>
								<DataColumn<ActionDemoRow>
									field="_actions"
									align="left"
									actions
									actionsMenu
									actionsAt="start"
									header=""
									width={48}
								/>
								<DataColumn<ActionDemoRow>
									field="name"
									header="Имя"
									sortable
								/>
								<DataColumn<ActionDemoRow> field="role" header="Роль" />
							</TableData>
						</Stack>
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="examples" pt="md">
					<Stack gap="xl">
						<Stack gap="xs">
							<Title order={4}>Кастомный body</Title>
							<Text size="sm" c="dimmed">
								<code>DataColumn body</code> — произвольный рендер ячейки.
								Подходит для бейджей, ссылок, иконок.
							</Text>
							<TableData<MultiGroupRow>
								data={multiGroupData.slice(0, 8)}
								storage="demo.examples-custom-body"
								limit={20}
							>
								<DataColumn<MultiGroupRow>
									field="name"
									header="Название"
									sortable
								/>
								<DataColumn<MultiGroupRow>
									field="status"
									header="Статус"
									body={(item) => (
										<Badge
											color={statusBadgeColor[item.status]}
											variant="light"
										>
											{item.status}
										</Badge>
									)}
								/>
								<DataColumn<MultiGroupRow>
									field="amount"
									header="Сумма"
									align="right"
									body={(item) => (
										<Text fw={600}>
											{item.amount.toLocaleString('ru-RU')} ₽
										</Text>
									)}
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Колонки: resize, drag, toggle</Title>
							<Text size="sm" c="dimmed">
								<code>resizable</code>, <code>draggable</code>,{' '}
								<code>toggleable</code> — ширина, порядок и видимость
								колонок (наведите на заголовок для toggler). Состояние в{' '}
								<code>storage</code>.
							</Text>
							<TableData<MultiGroupRow>
								data={multiGroupData}
								storage="demo.examples-columns"
								limit={15}
							>
								<DataColumn<MultiGroupRow>
									field="region"
									header="Регион"
									sortable
									resizable
									draggable
									toggleable
								/>
								<DataColumn<MultiGroupRow>
									field="category"
									header="Категория"
									sortable
									resizable
									draggable
									toggleable
								/>
								<DataColumn<MultiGroupRow>
									field="name"
									header="Название"
									sortable
									resizable
									draggable
								/>
								<DataColumn<MultiGroupRow>
									field="amount"
									header="Сумма"
									sortable
									resizable
									draggable
									toggleable
									align="right"
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Controlled selection</Title>
							<Text size="sm" c="dimmed">
								<code>selectedRows</code> +{' '}
								<code>onSelectedRowsChange</code> — выделение под
								контролем родителя.
							</Text>
							<Text size="sm">
								Выбрано индексов:{' '}
								{controlledSelected.length
									? controlledSelected.join(', ')
									: '—'}
							</Text>
							<Group gap="xs">
								<Button
									size="xs"
									variant="light"
									onClick={() => setControlledSelected([])}
								>
									Сбросить
								</Button>
								<Button
									size="xs"
									variant="light"
									onClick={() =>
										setControlledSelected(actionData.map((_, i) => i))
									}
								>
									Выбрать все
								</Button>
							</Group>
							<TableData<ActionDemoRow>
								data={actionData}
								selectable="start"
								selectedRows={controlledSelected}
								onSelectedRowsChange={setControlledSelected}
								storage="demo.examples-controlled-select"
								limit={20}
							>
								<DataColumn<ActionDemoRow> field="name" header="Имя" />
								<DataColumn<ActionDemoRow> field="role" header="Роль" />
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Выделение справа</Title>
							<Text size="sm" c="dimmed">
								<code>selectable="end"</code> — колонка checkbox в конце
								строки.
							</Text>
							<TableData<ActionDemoRow>
								data={actionData}
								selectable="end"
								storage="demo.examples-select-end"
								limit={20}
							>
								<DataColumn<ActionDemoRow> field="name" header="Имя" />
								<DataColumn<ActionDemoRow> field="role" header="Роль" />
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>editMode: cell</Title>
							<Text size="sm" c="dimmed">
								Клик по ячейке с <code>editor</code> — режим
								редактирования одной ячейки. Enter — сохранить.
							</Text>
							<TableData<CellEditRow>
								data={cellEditData}
								editMode="cell"
								storage="demo.examples-cell-edit"
								onRowEditComplete={(item, index) =>
									setCellEditData((rows) =>
										rows.map((row, i) => (i === index ? item : row)),
									)
								}
							>
								<DataColumn<CellEditRow>
									field="name"
									header="Наименование"
									editor={cellQtyEditor}
								/>
								<DataColumn<CellEditRow>
									field="qty"
									header="Кол-во"
									align="right"
									editor={cellQtyEditor}
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Локальная пагинация</Title>
							<Text size="sm" c="dimmed">
								<code>limit</code>, <code>limits</code>,{' '}
								<code>withPagination</code> — постраничный вывод без
								fetcher.
							</Text>
							<TableData<MultiGroupRow>
								data={multiGroupData}
								limit={5}
								limits={[5, 10, 20]}
								storage="demo.examples-pagination"
							>
								<DataColumn<MultiGroupRow>
									field="region"
									header="Регион"
									sortable
								/>
								<DataColumn<MultiGroupRow>
									field="name"
									header="Название"
									sortable
								/>
								<DataColumn<MultiGroupRow>
									field="amount"
									header="Сумма"
									align="right"
									sortable
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>groupAt: end</Title>
							<Text size="sm" c="dimmed">
								Expander группировки справа — <code>groupAt="end"</code>.
							</Text>
							<TableData<MultiGroupRow>
								data={multiGroupData.slice(0, 10)}
								groupAt="end"
								storage="demo.examples-group-at-end"
								limit={20}
							>
								<DataColumn<MultiGroupRow>
									field="region"
									grouped
									header="Регион"
								/>
								<DataColumn<MultiGroupRow>
									field="category"
									grouped
									header="Категория"
								/>
								<DataColumn<MultiGroupRow>
									field="name"
									header="Название"
								/>
								<DataColumn<MultiGroupRow>
									field="amount"
									header="Сумма"
									align="right"
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Hover-панель слева</Title>
							<Text size="sm" c="dimmed">
								<code>rowActionsAt="start"</code> — панель действий при
								наведении слева от строки.
							</Text>
							<TableData<ActionDemoRow>
								data={actionData}
								rowActions={rowActions}
								rowActionsAt="start"
								storage="demo.examples-hover-start"
								limit={20}
							>
								<DataColumn<ActionDemoRow> field="name" header="Имя" />
								<DataColumn<ActionDemoRow> field="role" header="Роль" />
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Состояния: empty, loading, error</Title>
							<Text size="sm" c="dimmed">
								<code>noDataText</code>, <code>loading</code>,{' '}
								<code>error</code> — отображение пустого списка и
								состояний загрузки.
							</Text>
							<Group gap="xs">
								<Button
									size="xs"
									variant={statesDemo === 'empty' ? 'filled' : 'light'}
									onClick={() => setStatesDemo('empty')}
								>
									empty
								</Button>
								<Button
									size="xs"
									variant={
										statesDemo === 'loading' ? 'filled' : 'light'
									}
									onClick={() => setStatesDemo('loading')}
								>
									loading
								</Button>
								<Button
									size="xs"
									variant={statesDemo === 'error' ? 'filled' : 'light'}
									color="red"
									onClick={() => setStatesDemo('error')}
								>
									error
								</Button>
							</Group>
							<TableData<MultiGroupRow>
								data={[]}
								loading={statesDemo === 'loading'}
								error={
									statesDemo === 'error'
										? 'Не удалось загрузить данные'
										: undefined
								}
								noDataText="Нет записей для отображения"
								withPagination={false}
								storage="demo.examples-states"
							>
								<DataColumn<MultiGroupRow>
									field="name"
									header="Название"
								/>
								<DataColumn<MultiGroupRow>
									field="amount"
									header="Сумма"
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>Breakpoint — карточки</Title>
							<Text size="sm" c="dimmed">
								<code>breakpoint</code> — на узком экране таблица
								переключается в <code>layout</code> (по умолчанию
								карточки). Сожмите окно или откройте на мобильном.
							</Text>
							<TableData<UnifiedRow>
								data={unifiedData}
								breakpoint="md"
								storage="demo.examples-breakpoint"
								limit={20}
							>
								<DataColumn<UnifiedRow>
									field="department"
									header="Отдел"
								/>
								<DataColumn<UnifiedRow>
									field="employee"
									header="Сотрудник"
								/>
								<DataColumn<UnifiedRow>
									field="salary"
									header="Зарплата"
									align="right"
								/>
							</TableData>
						</Stack>
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="fetch" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Cursor pagination (fetcher)</Title>
					</Stack>
					<TableData<IAnalyticsElasticItem>
						page=""
						data={async (input) => {
							const limit = input?.limit ?? 100;
							const page = input?.page ?? '';
		const res = await requestAnalyticsElastic({
			company: {
									select_field: [
										'inn_company',
										'place_name',
										'device_name',
										'event_name',
									],
				list_where: [],
				date_limit: {
										date_from: '2026-01-20',
										date_to: '2026-05-15',
				},
			},
			paginate: {
				id_record: page as string,
									limit_page: limit,
								},
							});
		return {
								data: res.data as IAnalyticsElasticItem[],
								next: res.last_id_record ?? '',
							};
						}}
					>
						<DataColumn<IAnalyticsElasticItem>
							field="id"
							header="ID record"
						/>
						<DataColumn<IAnalyticsElasticItem>
							field="inn_company"
							header="ИНН компании"
						/>
						<DataColumn<IAnalyticsElasticItem>
							field="place_name"
							header="Название места"
						/>
						<DataColumn<IAnalyticsElasticItem>
							field="device_name"
							header="Название устройства"
						/>
						<DataColumn<IAnalyticsElasticItem>
							field="event_name"
							header="Название события"
						/>
	</TableData>
				</Tabs.Panel> */}
			</Tabs>
		</Stack>
	);
}
