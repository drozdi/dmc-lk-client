import { DataColumn, TableData, TableRowActionsPanel } from '@/shared/ui/table';
import type { ColumnEntity, TableBulkAction, TableRowAction, TableRowActionsPanelProps } from '@/shared/ui/table/type';
import { Badge, Group, Stack, Tabs, Text, TextInput, Title } from '@mantine/core';
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

/** Демо: group + grouped на одной колонке (department + departmentItems). */
interface UnifiedRow {
	department: string;
	departmentItems: UnifiedNested[];
	employee: string;
	salary: number;
}

interface UnifiedNested {
	department: string;
	departmentItems: [];
	employee: string;
	salary: number;
}

const unifiedData: UnifiedRow[] = [
	{
		department: 'Разработка',
		employee: 'Иванов',
		salary: 120000,
		departmentItems: [
			{ department: '', employee: 'Петров', salary: 95000, departmentItems: [] },
			{ department: '', employee: 'Сидоров', salary: 88000, departmentItems: [] },
		],
	},
	{
		department: 'Разработка',
		employee: 'Козлов',
		salary: 110000,
		departmentItems: [],
	},
	{
		department: 'Маркетинг',
		employee: 'Новикова',
		salary: 75000,
		departmentItems: [
			{ department: '', employee: 'Орлова', salary: 62000, departmentItems: [] },
		],
	},
	{
		department: 'Маркетинг',
		employee: 'Волков',
		salary: 80000,
		departmentItems: [],
	},
	{
		department: 'Продажи',
		employee: 'Морозов',
		salary: 90000,
		departmentItems: [
			{ department: '', employee: 'Лебедев', salary: 70000, departmentItems: [] },
			{ department: '', employee: 'Соколов', salary: 68000, departmentItems: [] },
		],
	},
];

/** Демо: grouped (склад → зона) + group (вложенные позиции в поле items). */
interface CombinedRow {
	warehouse: string;
	zone: string;
	product: string;
	sku: string;
	amount: number;
	items: CombinedRow[];
}

const combinedData: CombinedRow[] = [
	{
		warehouse: 'Склад A',
		zone: 'Z-1',
		product: 'Ноутбук Pro',
		sku: 'NB-PRO',
		amount: 890,
		items: [
			{ warehouse: '', zone: '', product: 'RAM 16GB', sku: 'RAM-16', amount: 80, items: [] },
			{ warehouse: '', zone: '', product: 'SSD 512GB', sku: 'SSD-512', amount: 120, items: [] },
		],
	},
	{
		warehouse: 'Склад A',
		zone: 'Z-1',
		product: 'Монитор 27"',
		sku: 'MON-27',
		amount: 320,
		items: [
			{ warehouse: '', zone: '', product: 'Кабель HDMI', sku: 'HDMI-2', amount: 15, items: [] },
		],
	},
	{
		warehouse: 'Склад A',
		zone: 'Z-2',
		product: 'Клавиатура',
		sku: 'KB-01',
		amount: 45,
		items: [],
	},
	{
		warehouse: 'Склад B',
		zone: 'Z-1',
		product: 'Стул офисный',
		sku: 'CHR-01',
		amount: 65,
		items: [
			{ warehouse: '', zone: '', product: 'Подлокотники', sku: 'ARM-01', amount: 20, items: [] },
			{ warehouse: '', zone: '', product: 'Крестовина', sku: 'BASE-01', amount: 25, items: [] },
		],
	},
	{
		warehouse: 'Склад B',
		zone: 'Z-2',
		product: 'Стол письменный',
		sku: 'DSK-01',
		amount: 150,
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
		| SS[]
		| ((input?: { limit: number; page: string | number }) => Promise<{
				data: SS[];
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
		// group: [
		// 	{
		// 		position: 8,
		// 		mass: 12.011,
		// 		symbol: "C",
		// 		name: "Carbon",
		// 	},
		// 	{
		// 		position: 7,
		// 		mass: 14.007,
		// 		symbol: "N",
		// 		name: "Nitrogen",
		// 	},
		// 	{
		// 		position: 39,
		// 		mass: 88.906,
		// 		symbol: "Y",
		// 		name: "Yttrium",
		// 	},
		// 	{
		// 		position: 56,
		// 		mass: 137.33,
		// 		symbol: "Ba",
		// 		name: "Barium",
		// 	},
		// ],
		group: async () => {
			return {
				data: [
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
			};
		},
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

export function TablePage() {
	const [data, setData] = useState<SS[]>(elements);
	const [actionData, setActionData] = useState<ActionDemoRow[]>(actionDemoData);

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

			<Tabs defaultValue="multi-group" keepMounted={false}>
				<Tabs.List>
					<Tabs.Tab value="multi-group">Мульти-группировка</Tabs.Tab>
					<Tabs.Tab value="group-grouped">group + grouped</Tabs.Tab>
					<Tabs.Tab value="multi-sort">Мульти-сортировка</Tabs.Tab>
					<Tabs.Tab value="edit">Редактирование + group</Tabs.Tab>
					<Tabs.Tab value="row-actions">Действия со строкой</Tabs.Tab>
					<Tabs.Tab value="fetch">Async fetch</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="multi-group" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>3 уровня: region → category → status</Title>
						<Text size="sm" c="dimmed">
							Раскрывайте строки поэтапно: каждый уровень — вложенная
							таблица со следующим ключом группировки. Expander — в колонке
							текущего уровня.
						</Text>
					</Stack>
					<TableData<MultiGroupRow>
						data={multiGroupData}
						groupKeys={['region', 'category', 'status']}
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
				</Tabs.Panel>

				<Tabs.Panel value="group-grouped" pt="md">
					<Stack gap="xl">
						<Stack gap="xs">
							<Title order={4}>group + grouped — разные колонки</Title>
							<Text size="sm" c="dimmed">
								<b>grouped</b> — строки сворачиваются по складу и зоне
								(поэтапное раскрытие). <b>group</b> — колонка
								«Комплектация» раскрывает вложенную таблицу из массива{' '}
								<code>items</code>.
							</Text>
							<TableData<CombinedRow>
								data={combinedData}
								groupKeys={['warehouse', 'zone']}
								groupAt="start"
								storage="demo.group-grouped"
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
									field="amount"
									header="Сумма"
									sortable
									align="right"
								/>
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>group + grouped — одна колонка</Title>
							<Text size="sm" c="dimmed">
								Колонка <code>department</code> одновременно{' '}
								<b>grouped</b> (сворачивает строки по отделу) и{' '}
								<b>group</b> (раскрывает сотрудников из{' '}
								<code>departmentItems</code>). Скалярное значение — в{' '}
								<code>department</code>, вложенный массив — по соглашению{' '}
								<code>{'{field}Items'}</code> или через{' '}
								<code>groupItemsField</code>.
							</Text>
							<TableData<UnifiedRow>
								data={unifiedData}
								groupKeys={['department']}
								groupAt="start"
								storage="demo.group-grouped-unified"
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
								<DataColumn<UnifiedRow>
									field="salary"
									header="Зарплата"
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
								выравнивания. <code>bulkActions</code> — в заголовке
								колонки выделения.
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

				<Tabs.Panel value="fetch" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Cursor pagination (fetcher)</Title>
					</Stack>
					<TableData<SSS>
						data={elementsS}
					>
						<DataColumn<SS>
							sortable
							draggable
							resizable
							editor={(item, column, onChange, onSave) => (
								<TextInput
									defaultValue={
										item[column.field as keyof SS] as string
									}
									onChange={({ target }) => onChange(target.value)}
									onKeyPress={({ key }) => {
										if (key === 'Enter') {
											onSave();
										}
									}}
								/>
							)}
							field="position"
							header="Element position"
						/>
						<DataColumn<SS>
							sortable
							draggable
							resizable
							editor={(item, column, onChange, onSave) => (
								<TextInput
									defaultValue={
										item[column.field as keyof SS] as string
									}
									onChange={({ target }) => onChange(target.value)}
									onKeyPress={({ key }) => {
										if (key === 'Enter') {
											onSave();
										}
									}}
								/>
							)}
							field="name"
							header="Element name"
						/>
						<DataColumn<SS>
							draggable
							resizable
							toggleable
							editor={(item, column, onChange, onSave) => (
								<TextInput
									defaultValue={
										item[column.field as keyof SS] as string
									}
									onChange={({ target }) => onChange(target.value)}
									onKeyPress={({ key }) => {
										if (key === 'Enter') {
											onSave();
										}
									}}
								/>
							)}
							field="symbol"
							header="Symbol"
						/>
						<DataColumn<SS>
							draggable
							resizable
							toggleable
							editor={(item, column, onChange, onSave) => (
								<TextInput
									defaultValue={
										item[column.field as keyof SS] as string
									}
									onChange={({ target }) => onChange(target.value)}
									onKeyPress={({ key }) => {
										if (key === 'Enter') {
											onSave();
										}
									}}
								/>
							)}
							field="mass"
							header="Atomic mass"
						/>
					</TableData>
				</Tabs.Panel>
			</Tabs>
		</Stack>
	);
}
