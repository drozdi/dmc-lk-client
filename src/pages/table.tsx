import { requestAnalyticsElastic } from '@/entites/analytics';
import { DataColumn, TableData } from '@/shared/ui/table';
import type { ColumnEntity } from '@/shared/ui/table/type';
import { Stack, Tabs, Text, Title } from '@mantine/core';
import { TextInput } from '@mantine/core';
import { useState } from 'react';

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

	return (
		<Stack gap="lg" p="md">
			<Title order={2}>TableData — демо</Title>

			<Tabs defaultValue="multi-group" keepMounted={false}>
				<Tabs.List>
					<Tabs.Tab value="multi-group">Мульти-группировка</Tabs.Tab>
					<Tabs.Tab value="group-grouped">group + grouped</Tabs.Tab>
					<Tabs.Tab value="multi-sort">Мульти-сортировка</Tabs.Tab>
					<Tabs.Tab value="edit">Редактирование + group</Tabs.Tab>
					<Tabs.Tab value="fetch">Async fetch</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="multi-group" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>3 уровня: region → category → status</Title>
						<Text size="sm" c="dimmed">
							Раскрывайте строки поэтапно: каждый уровень — вложенная таблица со
							следующим ключом группировки. Expander — в колонке текущего уровня.
						</Text>
					</Stack>
					<TableData<MultiGroupRow>
						data={multiGroupData}
						groupKeys={['region', 'category', 'status']}
						storage="demo.multi-group"
						limit={50}
					>
						<DataColumn<MultiGroupRow> field="region" grouped header="Регион" />
						<DataColumn<MultiGroupRow> field="category" grouped header="Категория" />
						<DataColumn<MultiGroupRow> field="status" grouped header="Статус" />
						<DataColumn<MultiGroupRow> field="name" header="Название" sortable />
						<DataColumn<MultiGroupRow> field="amount" header="Сумма" sortable align="right" />
					</TableData>
				</Tabs.Panel>

				<Tabs.Panel value="group-grouped" pt="md">
					<Stack gap="xl">
						<Stack gap="xs">
							<Title order={4}>group + grouped — разные колонки</Title>
							<Text size="sm" c="dimmed">
								<b>grouped</b> — строки сворачиваются по складу и зоне (поэтапное
								раскрытие). <b>group</b> — колонка «Комплектация» раскрывает вложенную
								таблицу из массива <code>items</code>.
							</Text>
							<TableData<CombinedRow>
								data={combinedData}
								groupKeys={['warehouse', 'zone']}
								groupAt="start"
								storage="demo.group-grouped"
								limit={50}
							>
								<DataColumn<CombinedRow> field="items" group header="Комплектация" />
								<DataColumn<CombinedRow> field="warehouse" grouped header="Склад" />
								<DataColumn<CombinedRow> field="zone" grouped header="Зона" />
								<DataColumn<CombinedRow> field="product" header="Товар" sortable />
								<DataColumn<CombinedRow> field="sku" header="SKU" />
								<DataColumn<CombinedRow> field="amount" header="Сумма" sortable align="right" />
							</TableData>
						</Stack>

						<Stack gap="xs">
							<Title order={4}>group + grouped — одна колонка</Title>
							<Text size="sm" c="dimmed">
								Колонка <code>department</code> одновременно <b>grouped</b> (сворачивает
								строки по отделу) и <b>group</b> (раскрывает сотрудников из{' '}
								<code>departmentItems</code>). Скалярное значение — в <code>department</code>,
								вложенный массив — по соглашению <code>{'{field}Items'}</code> или через{' '}
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
								<DataColumn<UnifiedRow> field="employee" header="Сотрудник" sortable />
								<DataColumn<UnifiedRow> field="salary" header="Зарплата" sortable align="right" />
							</TableData>
						</Stack>
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="multi-sort" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Мульти-сортировка</Title>
						<Text size="sm" c="dimmed">
							Клик по заголовку — цикл desc/asc/off. Shift+клик или multiSort —
							добавляет поле в цепочку (бейдж с приоритетом).
						</Text>
					</Stack>
					<TableData<MultiGroupRow> data={multiGroupData} multiSort storage="demo.multi-sort" limit={50}>
						<DataColumn<MultiGroupRow> field="region" header="Регион" sortable />
						<DataColumn<MultiGroupRow> field="category" header="Категория" sortable />
						<DataColumn<MultiGroupRow> field="status" header="Статус" sortable />
						<DataColumn<MultiGroupRow> field="name" header="Название" sortable />
						<DataColumn<MultiGroupRow> field="amount" header="Сумма" sortable align="right" />
					</TableData>
				</Tabs.Panel>

				<Tabs.Panel value="edit" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Редактирование строк + nested group</Title>
						<Text size="sm" c="dimmed">
							Enter — сохранить ячейку. Колонка group — вложенная таблица в поле
							записи.
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
						<DataColumn<SS> resizable editor={editorCell} field="symbol" header="Symbol" />
						<DataColumn<SS> resizable editor={editorCell} field="mass" header="Atomic mass" />
					</TableData>
				</Tabs.Panel>

				<Tabs.Panel value="fetch" pt="md">
					<Stack gap="xs" mb="md">
						<Title order={4}>Cursor pagination (fetcher)</Title>
					</Stack>
					<TableData<{ id: string }>
						data={async (input) => {
							const limit = input?.limit ?? 100;
							const page = input?.page ?? '';
							const res = await requestAnalyticsElastic({
								company: {
									select_field: [],
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
								data: res.data as { id: string }[],
								next: res.last_id_record ?? '',
							};
						}}
					>
						<DataColumn<{ id: string }> field="id" header="ID" />
					</TableData>
				</Tabs.Panel>
			</Tabs>
		</Stack>
	);
}
