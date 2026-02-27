import {
	SelectAnalyticsIncidentDetails,
	SelectAnalyticsIncidentFields,
	useQueryAnalyticsFields,
} from "@/entites/analytics";
import { useStoreIncident } from "@/entites/analytics/stores/use-store-incident";
import { $setting } from "@/shared";
import { ButtonRemove, Icon, Loading } from "@/shared/ui";
import {
	ActionIcon,
	Button,
	Group,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { TbPlus, TbXboxX } from "react-icons/tb";

const dNow = dayjs();

interface IncidentQueryField {
	accessorKey: string;
	header: string;
	type: "detail" | "field" | "main";
	index?: number;
}

interface IncidentQueryProps {
	filterdate: string[];
	data: any[];
	fields: IncidentQueryField[];
	details: any[];
}

export const IncidentTable = () => {
	const qaf = useQueryAnalyticsFields();

	const storeIncident = useStoreIncident();

	const [template, updateTemplate] = $setting.useSetState<IncidentQueryProps>(
		"incident.table",
		{
			filterdate: [
				dNow.month(dNow.month() - 3).format("YYYY-MM-DD"),
				dNow.format("YYYY-MM-DD"),
			],
			data: [],
			fields: [],
			details: [],
		},
	);

	const [data, setData] = useState<IAnalyticsIncidentItem[]>([]);

	const { limit } = storeIncident;

	const columns = useMemo(
		() => [
			{
				accessorKey: "data",
				header: "Ошибка",
				type: "main",
			},
			{
				accessorKey: "total_counter",
				header: "Ошибок",
				type: "main",
			},
			...template.details,
			...template.fields,
		],
		[template],
	);

	const handleAddField = (field: string) => {
		if (!field) {
			return;
		}
		template.fields.push({
			accessorKey: field,
			header: qaf.findLabelByCode(field),
			type: "field",
			index: template.fields.length,
		});
		updateTemplate({ ...template });
	};
	const handleAddDetail = (field: string) => {
		if (!field) {
			return;
		}
		template.details.push({
			accessorKey: field,
			header: qaf.findLabelByCode(field),
			type: "detail",
			index: template.fields.length,
		});
		updateTemplate({ ...template });
	};
	const canRemove = (column: {
		accessorKey: IncidentQueryField["accessorKey"];
		type: IncidentQueryField["type"];
	}) => {
		return column.type !== "main";
	};
	const handleRemove = (column: {
		accessorKey: IncidentQueryField["accessorKey"];
		type: IncidentQueryField["type"];
	}) => {
		switch (column.type) {
			case "field":
				template.fields = template.fields.filter(
					(item) => item.accessorKey !== column.accessorKey,
				);
				break;
			case "detail":
				template.details = template.details.filter(
					(item) => item.accessorKey !== column.accessorKey,
				);
				break;
		}
		updateTemplate({ ...template });
	};
	const handleDate = (index: number, date: string) => {
		if (index === 0) {
			template.filterdate = [date, template.filterdate[1]];
		} else {
			template.filterdate = [template.filterdate[0], date];
		}
		updateTemplate({ ...template });
	};

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	});

	const [value, setValue] = useState("");
	const handleKeyPress = ({ key }: React.KeyboardEvent) => {
		if (key === "Enter" && value) {
			template.data.push(value);
			updateTemplate({ ...template });
			setValue("");
		}
	};
	const handleAddData = () => {
		if (value) {
			template.data.push(value);
			updateTemplate({ ...template });
			setValue("");
		}
	};
	const handleRemoveItem = (value: string) => {
		template.data = template.data.filter((item) => value !== item);
		updateTemplate({ ...template });
	};

	const handleSend = () => {
		storeIncident
			.send({
				filterdate: template.filterdate,
				data: template.data.map((item) => item),
				fields_name: template.fields.map((item) => item.accessorKey),
				details_field: template.details.map((item) => item.accessorKey),
			})
			.then((data) => setData(data || []));
	};

	return (
		<Stack gap="xs">
			<ul className="list-none mb-3">
				<li>
					<TextInput
						placeholder="Ошибка"
						value={value}
						onChange={({ target }) => setValue(target.value)}
						onKeyPress={handleKeyPress}
						rightSection={
							<ActionIcon onClick={handleAddData}>
								<TbPlus />
							</ActionIcon>
						}
					/>
				</li>
				{template.data.map((item) => (
					<li className="flex justify-between items-start" key={item}>
						{item}{" "}
						<ButtonRemove
							onClick={() => handleRemoveItem(item)}
							title="Удалить ошибку"
						>
							<TbXboxX />
						</ButtonRemove>
					</li>
				))}
			</ul>
			<Group gap="xs" justify="space-between">
				<SelectAnalyticsIncidentDetails
					excludeds={template.details.map((col) => col.accessorKey)}
					placeholder="Групировать поля"
					value=""
					onChange={(val) => handleAddDetail(val as string)}
				/>
				<SelectAnalyticsIncidentFields
					excludeds={template.fields.map((col) => col.accessorKey)}
					placeholder="Показывать поля"
					value=""
					onChange={(val) => handleAddField(val as string)}
				/>
				<Group gap="xs">
					<Text>С</Text>
					<DatePickerInput
						name="date_from"
						value={template.filterdate?.[0] || ""}
						onChange={(value) => handleDate(0, value as string)}
					/>
					<Text>по</Text>
					<DatePickerInput
						name="date_to"
						value={template.filterdate?.[1] || ""}
						onChange={(value) => handleDate(1, value as string)}
					/>
				</Group>
				<Button onClick={handleSend}>Применить</Button>
			</Group>
			<Loading active={storeIncident.isLoading} keepMounted>
				<Table withRowBorders>
					<Table.Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Table.Tr key={headerGroup.id}>
								{headerGroup.headers.map((header: any) => (
									<Table.Th
										key={header.id}
										colSpan={header.colSpan}
									>
										<Group justify="space-between" grow>
											<Text>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column
																.columnDef
																.header,
															header.getContext(),
														)}
											</Text>

											{canRemove(
												header?.column?.columnDef,
											) && (
												<Group justify="end">
													<ButtonRemove
														onClick={() =>
															handleRemove(
																header.column
																	.columnDef,
															)
														}
														title={`Удалить поле "${header.column.columnDef.header}"`}
													>
														<Icon>
															tb-column-remove
														</Icon>
													</ButtonRemove>
												</Group>
											)}
										</Group>
									</Table.Th>
								))}
							</Table.Tr>
						))}
					</Table.Thead>
					<Table.Tbody>
						{table.getRowModel().rows.map((row) => (
							<Table.Tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<Table.Td key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext(),
										)}
									</Table.Td>
								))}
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Loading>
			<Group justify="end">
				<Select
					value={String(limit)}
					onChange={(value) => storeIncident.setLimit(Number(value))}
					data={["15", "30", "50", "75", "100"]}
				/>
			</Group>
		</Stack>
	);
};
